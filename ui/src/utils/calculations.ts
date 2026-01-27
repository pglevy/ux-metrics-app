/**
 * Calculation Utilities
 * 
 * Functions for calculating UX metrics from assessment data.
 * 
 * **Validates: Requirements 4.2, 5.2, 6.2, 7.2**
 * - 4.2: Calculate success rate as (successful completions / total attempts) × 100
 * - 5.2: Calculate duration in seconds automatically
 * - 6.2: Calculate efficiency as (optimal steps / actual steps) × 100
 * - 7.2: Calculate error rate as (errors / opportunities) × 100
 */

/**
 * Task Success Rate Data
 */
export interface TaskSuccessRateData {
  taskDescription: string;
  successful: boolean;
}

/**
 * Time on Task Data
 */
export interface TimeOnTaskData {
  taskDescription: string;
  startTime?: string;
  endTime?: string;
  manualDurationSeconds?: number;
}

/**
 * Task Efficiency Data
 */
export interface TaskEfficiencyData {
  taskDescription: string;
  optimalSteps: number;
  actualSteps: number;
}

/**
 * Time-based Efficiency Data
 */
export interface TimeBasedEfficiencyData {
  taskDescription: string;
  optimalTimeSeconds: number;
  actualTimeSeconds: number;
}

/**
 * Error Detail
 */
export interface ErrorDetail {
  type: 'wrong_click' | 'invalid_submission' | 'navigation_error';
  description: string;
}

/**
 * Error Rate Data
 */
export interface ErrorRateData {
  taskDescription: string;
  errors: ErrorDetail[];
  opportunities: number;
}

/**
 * SEQ Data
 */
export interface SEQData {
  taskDescription: string;
  rating: number; // 1-7
}

/**
 * Calculates the task success rate from a collection of task attempts.
 * 
 * @param responses - Array of task success/failure data
 * @returns Success rate as a percentage (0-100), or 0 if no responses
 * 
 * **Validates: Requirements 4.2**
 * Formula: (successful completions / total attempts) × 100
 * 
 * @example
 * const rate = calculateSuccessRate([
 *   { taskDescription: 'Task 1', successful: true },
 *   { taskDescription: 'Task 2', successful: false },
 *   { taskDescription: 'Task 3', successful: true }
 * ]);
 * // Returns: 66.67
 */
export function calculateSuccessRate(responses: TaskSuccessRateData[]): number {
  if (!responses || responses.length === 0) {
    return 0;
  }
  
  const successfulCount = responses.filter(r => r.successful).length;
  return (successfulCount / responses.length) * 100;
}

/**
 * Calculates the success rate from a single boolean value.
 * Convenience function for single-task assessments.
 * 
 * @param successful - Whether the task was successful
 * @returns 100 if successful, 0 if not
 * 
 * @example
 * const rate = calculateSingleSuccessRate(true); // Returns: 100
 */
export function calculateSingleSuccessRate(successful: boolean): number {
  return successful ? 100 : 0;
}

/**
 * Calculates the duration in seconds from time on task data.
 * Uses manual duration if provided, otherwise calculates from start/end times.
 * 
 * @param data - Time on task data with either manual duration or start/end times
 * @returns Duration in seconds, or 0 if data is invalid
 * 
 * **Validates: Requirements 5.2**
 * 
 * @example
 * // Using start/end times
 * const duration1 = calculateDuration({
 *   taskDescription: 'Task 1',
 *   startTime: '2024-01-01T10:00:00Z',
 *   endTime: '2024-01-01T10:02:30Z'
 * });
 * // Returns: 150 (2 minutes 30 seconds)
 * 
 * // Using manual duration
 * const duration2 = calculateDuration({
 *   taskDescription: 'Task 2',
 *   manualDurationSeconds: 90
 * });
 * // Returns: 90
 */
export function calculateDuration(data: TimeOnTaskData): number {
  // Prefer manual duration if provided
  if (data.manualDurationSeconds !== undefined && data.manualDurationSeconds >= 0) {
    return data.manualDurationSeconds;
  }
  
  // Calculate from start/end times
  if (!data.startTime || !data.endTime) {
    return 0;
  }
  
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  
  // Validate dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    console.warn('calculateDuration: Invalid date format');
    return 0;
  }
  
  // Handle case where end is before start
  if (end.getTime() < start.getTime()) {
    console.warn('calculateDuration: End time is before start time');
    return 0;
  }
  
  return (end.getTime() - start.getTime()) / 1000;
}

/**
 * Formats a duration in seconds to a human-readable string.
 * 
 * @param seconds - Duration in seconds
 * @returns Formatted string in "Xm Ys" format
 * 
 * **Validates: Requirements 5.5**
 * 
 * @example
 * formatDuration(150); // Returns: "2m 30s"
 * formatDuration(45);  // Returns: "0m 45s"
 * formatDuration(3600); // Returns: "60m 0s"
 */
export function formatDuration(seconds: number): string {
  if (seconds < 0 || !isFinite(seconds)) {
    return '0m 0s';
  }
  
  const totalSeconds = Math.round(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Formats a duration in seconds to a detailed human-readable string.
 * Includes hours for longer durations.
 * 
 * @param seconds - Duration in seconds
 * @returns Formatted string (e.g., "1h 30m 45s" or "2m 30s")
 * 
 * @example
 * formatDurationDetailed(5445); // Returns: "1h 30m 45s"
 * formatDurationDetailed(150);  // Returns: "2m 30s"
 */
export function formatDurationDetailed(seconds: number): string {
  if (seconds < 0 || !isFinite(seconds)) {
    return '0s';
  }
  
  const totalSeconds = Math.round(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  
  const parts: string[] = [];
  
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0 || hours > 0) {
    parts.push(`${minutes}m`);
  }
  parts.push(`${remainingSeconds}s`);
  
  return parts.join(' ');
}

/**
 * Calculates task efficiency as a percentage.
 * 
 * @param data - Task efficiency data with optimal and actual steps
 * @returns Efficiency percentage (can be > 100 if actual < optimal), or 0 if invalid
 * 
 * **Validates: Requirements 6.2**
 * Formula: (optimal steps / actual steps) × 100
 * 
 * @example
 * const efficiency = calculateEfficiency({
 *   taskDescription: 'Task 1',
 *   optimalSteps: 5,
 *   actualSteps: 8
 * });
 * // Returns: 62.5
 */
export function calculateEfficiency(data: TaskEfficiencyData): number {
  if (!data.actualSteps || data.actualSteps <= 0) {
    console.warn('calculateEfficiency: actualSteps must be greater than 0');
    return 0;
  }
  
  if (data.optimalSteps < 0) {
    console.warn('calculateEfficiency: optimalSteps cannot be negative');
    return 0;
  }
  
  return (data.optimalSteps / data.actualSteps) * 100;
}

/**
 * Calculates time-based efficiency as a percentage.
 * 
 * @param data - Time-based efficiency data with optimal and actual times
 * @returns Efficiency percentage (can be > 100 if actual < optimal), or 0 if invalid
 * 
 * **Validates: Requirements 6.3**
 * Formula: (optimal time / actual time) × 100
 * 
 * @example
 * const efficiency = calculateTimeBasedEfficiency({
 *   taskDescription: 'Task 1',
 *   optimalTimeSeconds: 60,
 *   actualTimeSeconds: 90
 * });
 * // Returns: 66.67
 */
export function calculateTimeBasedEfficiency(data: TimeBasedEfficiencyData): number {
  if (!data.actualTimeSeconds || data.actualTimeSeconds <= 0) {
    console.warn('calculateTimeBasedEfficiency: actualTimeSeconds must be greater than 0');
    return 0;
  }
  
  if (data.optimalTimeSeconds < 0) {
    console.warn('calculateTimeBasedEfficiency: optimalTimeSeconds cannot be negative');
    return 0;
  }
  
  return (data.optimalTimeSeconds / data.actualTimeSeconds) * 100;
}

/**
 * Calculates the error rate as a percentage.
 * 
 * @param data - Error rate data with errors and opportunities
 * @returns Error rate as a percentage (0-100+), or 0 if no opportunities
 * 
 * **Validates: Requirements 7.2**
 * Formula: (errors / opportunities) × 100
 * 
 * @example
 * const rate = calculateErrorRate({
 *   taskDescription: 'Task 1',
 *   errors: [
 *     { type: 'wrong_click', description: 'Clicked wrong button' },
 *     { type: 'navigation_error', description: 'Went to wrong page' }
 *   ],
 *   opportunities: 10
 * });
 * // Returns: 20
 */
export function calculateErrorRate(data: ErrorRateData): number {
  if (!data.opportunities || data.opportunities <= 0) {
    console.warn('calculateErrorRate: opportunities must be greater than 0');
    return 0;
  }
  
  const errorCount = data.errors?.length || 0;
  return (errorCount / data.opportunities) * 100;
}

/**
 * Calculates the error rate from simple counts.
 * Convenience function when you have error count and opportunities as numbers.
 * 
 * @param errorCount - Number of errors
 * @param opportunities - Number of opportunities for errors
 * @returns Error rate as a percentage (0-100+), or 0 if no opportunities
 * 
 * @example
 * const rate = calculateErrorRateFromCounts(3, 15); // Returns: 20
 */
export function calculateErrorRateFromCounts(errorCount: number, opportunities: number): number {
  if (!opportunities || opportunities <= 0) {
    return 0;
  }
  
  if (errorCount < 0) {
    return 0;
  }
  
  return (errorCount / opportunities) * 100;
}

/**
 * Gets a breakdown of errors by type.
 * 
 * @param errors - Array of error details
 * @returns Object with counts for each error type
 * 
 * **Validates: Requirements 7.3**
 * 
 * @example
 * const breakdown = getErrorBreakdown([
 *   { type: 'wrong_click', description: 'Error 1' },
 *   { type: 'wrong_click', description: 'Error 2' },
 *   { type: 'navigation_error', description: 'Error 3' }
 * ]);
 * // Returns: { wrong_click: 2, invalid_submission: 0, navigation_error: 1 }
 */
export function getErrorBreakdown(errors: ErrorDetail[]): Record<ErrorDetail['type'], number> {
  const breakdown: Record<ErrorDetail['type'], number> = {
    wrong_click: 0,
    invalid_submission: 0,
    navigation_error: 0,
  };
  
  if (!errors || errors.length === 0) {
    return breakdown;
  }
  
  for (const error of errors) {
    if (error.type in breakdown) {
      breakdown[error.type]++;
    }
  }
  
  return breakdown;
}

/**
 * Validates an SEQ rating value.
 * 
 * @param rating - The rating value to validate
 * @returns true if rating is valid (1-7 integer), false otherwise
 * 
 * **Validates: Requirements 8.2**
 * 
 * @example
 * validateSEQRating(5);   // Returns: true
 * validateSEQRating(0);   // Returns: false
 * validateSEQRating(8);   // Returns: false
 * validateSEQRating(3.5); // Returns: false
 */
export function validateSEQRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 7;
}

/**
 * Gets the SEQ rating label for a given value.
 * 
 * @param rating - The rating value (1-7)
 * @returns Human-readable label for the rating
 * 
 * @example
 * getSEQRatingLabel(1); // Returns: "Very Difficult"
 * getSEQRatingLabel(7); // Returns: "Very Easy"
 */
export function getSEQRatingLabel(rating: number): string {
  const labels: Record<number, string> = {
    1: 'Very Difficult',
    2: 'Difficult',
    3: 'Somewhat Difficult',
    4: 'Neutral',
    5: 'Somewhat Easy',
    6: 'Easy',
    7: 'Very Easy',
  };
  
  return labels[rating] || 'Unknown';
}

/**
 * Rounds a number to a specified number of decimal places.
 * Useful for displaying calculated metrics.
 * 
 * @param value - The number to round
 * @param decimals - Number of decimal places (default: 2)
 * @returns Rounded number
 * 
 * @example
 * roundToDecimals(66.66666, 2); // Returns: 66.67
 * roundToDecimals(100, 1);      // Returns: 100
 */
export function roundToDecimals(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Formats a percentage value for display.
 * 
 * @param value - The percentage value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string with % symbol
 * 
 * @example
 * formatPercentage(66.666); // Returns: "66.7%"
 * formatPercentage(100);    // Returns: "100.0%"
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  if (!isFinite(value)) {
    return '0.0%';
  }
  return `${roundToDecimals(value, decimals).toFixed(decimals)}%`;
}
