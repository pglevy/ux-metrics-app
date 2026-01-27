/**
 * Analytics Service
 * 
 * Provides aggregation and analysis functions for UX metrics.
 * Calculates median for time on task and mean for other metrics.
 * Supports filtering by date range, participant, and task.
 * 
 * **Validates: Requirements 10.1, 10.2, 10.3, 10.4**
 * - 10.1: Calculate median values for Time_on_Task across all sessions
 * - 10.2: Calculate mean values for Task_Success_Rate, Task_Efficiency, Error_Rate, and SEQ
 * - 10.3: Allow filtering of aggregated data by date range, participant, or task
 * - 10.4: Display comparison metrics when multiple studies or time periods are selected
 */

import type { 
  AggregatedMetrics, 
  MetricsSummary, 
  AssessmentResponse,
  Session,
  DateRange,
} from '../../../api/types'
import { getSessionsByStudy } from './sessionService'
import { getAllAssessmentResponses, getAssessmentResponsesBySession } from './assessmentResponseService'
import { getAssessmentTypeByType } from './assessmentTypeService'

/**
 * Filter options for analytics queries.
 */
export interface AnalyticsFilters {
  /** Filter by date range */
  dateRange?: {
    start: string
    end: string
  }
  /** Filter by participant ID */
  participantId?: string
  /** Filter by task description (partial match) */
  taskDescription?: string
}

/**
 * Comparison result between two sets of metrics.
 */
export interface MetricsComparison {
  /** First set of metrics (baseline) */
  baseline: AggregatedMetrics
  /** Second set of metrics (comparison) */
  comparison: AggregatedMetrics
  /** Differences between metrics */
  differences: {
    taskSuccessRate?: number | null
    timeOnTask?: number | null
    taskEfficiency?: number | null
    errorRate?: number | null
    seq?: number | null
  }
  /** Percentage changes */
  percentageChanges: {
    taskSuccessRate?: number | null
    timeOnTask?: number | null
    taskEfficiency?: number | null
    errorRate?: number | null
    seq?: number | null
  }
}

/**
 * Calculates the median of an array of numbers.
 * 
 * @param values - Array of numbers
 * @returns The median value, or null if array is empty
 * 
 * **Validates: Requirements 10.1**
 * 
 * @example
 * calculateMedian([1, 2, 3, 4, 5]); // Returns: 3
 * calculateMedian([1, 2, 3, 4]); // Returns: 2.5
 */
export function calculateMedian(values: number[]): number | null {
  if (!values || values.length === 0) {
    return null
  }

  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    // Even number of elements - average of two middle values
    return (sorted[mid - 1] + sorted[mid]) / 2
  } else {
    // Odd number of elements - middle value
    return sorted[mid]
  }
}

/**
 * Calculates the mean (average) of an array of numbers.
 * 
 * @param values - Array of numbers
 * @returns The mean value, or null if array is empty
 * 
 * **Validates: Requirements 10.2**
 * 
 * @example
 * calculateMean([1, 2, 3, 4, 5]); // Returns: 3
 * calculateMean([10, 20, 30]); // Returns: 20
 */
export function calculateMean(values: number[]): number | null {
  if (!values || values.length === 0) {
    return null
  }

  const sum = values.reduce((acc, val) => acc + val, 0)
  return sum / values.length
}

/**
 * Filters assessment responses based on provided criteria.
 * 
 * @param responses - Array of assessment responses to filter
 * @param sessions - Array of sessions for date/participant filtering
 * @param filters - Filter criteria
 * @returns Filtered array of assessment responses
 * 
 * **Validates: Requirements 10.3**
 */
export function filterAssessmentResponses(
  responses: AssessmentResponse[],
  sessions: Session[],
  filters: AnalyticsFilters
): AssessmentResponse[] {
  let filtered = [...responses]

  // Create a map of session IDs to sessions for quick lookup
  const sessionMap = new Map(sessions.map(s => [s.id, s]))

  // Filter by date range
  if (filters.dateRange) {
    const startDate = new Date(filters.dateRange.start)
    const endDate = new Date(filters.dateRange.end)
    endDate.setHours(23, 59, 59, 999) // Include entire end day

    filtered = filtered.filter(response => {
      const session = sessionMap.get(response.sessionId)
      if (!session) return false
      const sessionDate = new Date(session.createdAt)
      return sessionDate >= startDate && sessionDate <= endDate
    })
  }

  // Filter by participant
  if (filters.participantId) {
    const participantSessionIds = new Set(
      sessions
        .filter(s => s.participantId === filters.participantId)
        .map(s => s.id)
    )
    filtered = filtered.filter(response => participantSessionIds.has(response.sessionId))
  }

  // Filter by task description (partial match, case-insensitive)
  if (filters.taskDescription) {
    const searchTerm = filters.taskDescription.toLowerCase()
    filtered = filtered.filter(response => 
      response.taskDescription.toLowerCase().includes(searchTerm)
    )
  }

  return filtered
}

/**
 * Extracts metric values from assessment responses by type.
 * 
 * @param responses - Array of assessment responses
 * @param metricType - The type of metric to extract
 * @returns Array of numeric values for the specified metric
 */
function extractMetricValues(
  responses: AssessmentResponse[],
  metricType: 'task_success_rate' | 'time_on_task' | 'task_efficiency' | 'error_rate' | 'seq'
): number[] {
  const assessmentType = getAssessmentTypeByType(metricType)
  if (!assessmentType) return []

  const typeResponses = responses.filter(r => r.assessmentTypeId === assessmentType.id)
  
  const values: number[] = []
  
  for (const response of typeResponses) {
    switch (metricType) {
      case 'task_success_rate':
        if (response.calculatedMetrics.successRate !== undefined) {
          values.push(response.calculatedMetrics.successRate)
        } else if (response.responses.successful !== undefined) {
          values.push(response.responses.successful ? 100 : 0)
        }
        break
      case 'time_on_task':
        if (response.calculatedMetrics.durationSeconds !== undefined) {
          values.push(response.calculatedMetrics.durationSeconds)
        } else if (response.responses.manualDurationSeconds !== undefined) {
          values.push(response.responses.manualDurationSeconds as number)
        }
        break
      case 'task_efficiency':
        if (response.calculatedMetrics.efficiency !== undefined) {
          values.push(response.calculatedMetrics.efficiency)
        }
        break
      case 'error_rate':
        if (response.calculatedMetrics.errorRate !== undefined) {
          values.push(response.calculatedMetrics.errorRate)
        }
        break
      case 'seq':
        if (response.calculatedMetrics.seqRating !== undefined) {
          values.push(response.calculatedMetrics.seqRating)
        } else if (response.responses.rating !== undefined) {
          values.push(response.responses.rating as number)
        }
        break
    }
  }

  return values
}

/**
 * Calculates aggregated metrics for a study.
 * 
 * @param studyId - The study identifier
 * @param filters - Optional filters to apply
 * @returns Aggregated metrics for the study
 * 
 * **Validates: Requirements 10.1, 10.2, 10.3**
 * 
 * @example
 * const metrics = getStudyMetrics('study-123');
 * console.log(`Success Rate: ${metrics.metrics.taskSuccessRate?.mean}%`);
 */
export function getStudyMetrics(
  studyId: string,
  filters?: AnalyticsFilters
): AggregatedMetrics {
  // Get sessions for the study
  let sessions = getSessionsByStudy(studyId)
  
  // Apply session-level filters
  if (filters?.dateRange) {
    sessions = sessions.filter(s => {
      const sessionDate = new Date(s.createdAt)
      const startDate = new Date(filters.dateRange!.start)
      const endDate = new Date(filters.dateRange!.end)
      endDate.setHours(23, 59, 59, 999)
      return sessionDate >= startDate && sessionDate <= endDate
    })
  }
  
  if (filters?.participantId) {
    sessions = sessions.filter(s => s.participantId === filters.participantId)
  }

  // Get all assessment responses for these sessions
  let responses: AssessmentResponse[] = []
  for (const session of sessions) {
    const sessionResponses = getAssessmentResponsesBySession(session.id)
    responses = responses.concat(sessionResponses)
  }

  // Apply task description filter
  if (filters?.taskDescription) {
    const searchTerm = filters.taskDescription.toLowerCase()
    responses = responses.filter(r => 
      r.taskDescription.toLowerCase().includes(searchTerm)
    )
  }

  // Calculate date range
  let dateRange: DateRange = { start: '', end: '' }
  if (sessions.length > 0) {
    const dates = sessions.map(s => new Date(s.createdAt).getTime())
    dateRange = {
      start: new Date(Math.min(...dates)).toISOString(),
      end: new Date(Math.max(...dates)).toISOString(),
    }
  }

  // Extract values for each metric type
  const successRateValues = extractMetricValues(responses, 'task_success_rate')
  const timeOnTaskValues = extractMetricValues(responses, 'time_on_task')
  const efficiencyValues = extractMetricValues(responses, 'task_efficiency')
  const errorRateValues = extractMetricValues(responses, 'error_rate')
  const seqValues = extractMetricValues(responses, 'seq')

  // Calculate metrics
  const metrics: MetricsSummary = {
    taskSuccessRate: {
      mean: calculateMean(successRateValues),
      count: successRateValues.length,
    },
    timeOnTask: {
      median: calculateMedian(timeOnTaskValues),
      mean: calculateMean(timeOnTaskValues),
      count: timeOnTaskValues.length,
    },
    taskEfficiency: {
      mean: calculateMean(efficiencyValues),
      count: efficiencyValues.length,
    },
    errorRate: {
      mean: calculateMean(errorRateValues),
      count: errorRateValues.length,
    },
    seq: {
      mean: calculateMean(seqValues),
      count: seqValues.length,
    },
  }

  // Get unique participants
  const participantIds = new Set(sessions.map(s => s.participantId))

  return {
    studyId,
    sessionCount: sessions.length,
    participantCount: participantIds.size,
    dateRange,
    metrics,
  }
}

/**
 * Compares metrics between two studies or time periods.
 * 
 * @param baselineStudyId - The baseline study ID
 * @param comparisonStudyId - The comparison study ID
 * @param baselineFilters - Optional filters for baseline
 * @param comparisonFilters - Optional filters for comparison
 * @returns Comparison result with differences and percentage changes
 * 
 * **Validates: Requirements 10.4**
 * 
 * @example
 * const comparison = compareStudyMetrics('study-1', 'study-2');
 * console.log(`Success rate improved by ${comparison.percentageChanges.taskSuccessRate}%`);
 */
export function compareStudyMetrics(
  baselineStudyId: string,
  comparisonStudyId: string,
  baselineFilters?: AnalyticsFilters,
  comparisonFilters?: AnalyticsFilters
): MetricsComparison {
  const baseline = getStudyMetrics(baselineStudyId, baselineFilters)
  const comparison = getStudyMetrics(comparisonStudyId, comparisonFilters)

  // Calculate differences
  const differences = {
    taskSuccessRate: calculateDifference(
      baseline.metrics.taskSuccessRate?.mean,
      comparison.metrics.taskSuccessRate?.mean
    ),
    timeOnTask: calculateDifference(
      baseline.metrics.timeOnTask?.median,
      comparison.metrics.timeOnTask?.median
    ),
    taskEfficiency: calculateDifference(
      baseline.metrics.taskEfficiency?.mean,
      comparison.metrics.taskEfficiency?.mean
    ),
    errorRate: calculateDifference(
      baseline.metrics.errorRate?.mean,
      comparison.metrics.errorRate?.mean
    ),
    seq: calculateDifference(
      baseline.metrics.seq?.mean,
      comparison.metrics.seq?.mean
    ),
  }

  // Calculate percentage changes
  const percentageChanges = {
    taskSuccessRate: calculatePercentageChange(
      baseline.metrics.taskSuccessRate?.mean,
      comparison.metrics.taskSuccessRate?.mean
    ),
    timeOnTask: calculatePercentageChange(
      baseline.metrics.timeOnTask?.median,
      comparison.metrics.timeOnTask?.median
    ),
    taskEfficiency: calculatePercentageChange(
      baseline.metrics.taskEfficiency?.mean,
      comparison.metrics.taskEfficiency?.mean
    ),
    errorRate: calculatePercentageChange(
      baseline.metrics.errorRate?.mean,
      comparison.metrics.errorRate?.mean
    ),
    seq: calculatePercentageChange(
      baseline.metrics.seq?.mean,
      comparison.metrics.seq?.mean
    ),
  }

  return {
    baseline,
    comparison,
    differences,
    percentageChanges,
  }
}

/**
 * Compares metrics between two time periods within the same study.
 * 
 * @param studyId - The study ID
 * @param baselinePeriod - The baseline date range
 * @param comparisonPeriod - The comparison date range
 * @returns Comparison result with differences and percentage changes
 * 
 * **Validates: Requirements 10.4**
 */
export function compareTimePeriods(
  studyId: string,
  baselinePeriod: { start: string; end: string },
  comparisonPeriod: { start: string; end: string }
): MetricsComparison {
  return compareStudyMetrics(
    studyId,
    studyId,
    { dateRange: baselinePeriod },
    { dateRange: comparisonPeriod }
  )
}

/**
 * Calculates the difference between two values.
 * 
 * @param baseline - The baseline value
 * @param comparison - The comparison value
 * @returns The difference (comparison - baseline), or null if either is null
 */
function calculateDifference(
  baseline: number | null | undefined,
  comparison: number | null | undefined
): number | null {
  if (baseline === null || baseline === undefined || 
      comparison === null || comparison === undefined) {
    return null
  }
  return comparison - baseline
}

/**
 * Calculates the percentage change between two values.
 * 
 * @param baseline - The baseline value
 * @param comparison - The comparison value
 * @returns The percentage change, or null if baseline is 0 or either is null
 */
function calculatePercentageChange(
  baseline: number | null | undefined,
  comparison: number | null | undefined
): number | null {
  if (baseline === null || baseline === undefined || 
      comparison === null || comparison === undefined) {
    return null
  }
  if (baseline === 0) {
    return comparison === 0 ? 0 : null
  }
  return ((comparison - baseline) / baseline) * 100
}

/**
 * Gets all unique task descriptions from assessment responses.
 * Useful for populating filter dropdowns.
 * 
 * @param studyId - Optional study ID to filter by
 * @returns Array of unique task descriptions
 */
export function getUniqueTaskDescriptions(studyId?: string): string[] {
  let responses: AssessmentResponse[]
  
  if (studyId) {
    const sessions = getSessionsByStudy(studyId)
    responses = []
    for (const session of sessions) {
      const sessionResponses = getAssessmentResponsesBySession(session.id)
      responses = responses.concat(sessionResponses)
    }
  } else {
    responses = getAllAssessmentResponses()
  }

  const descriptions = new Set(responses.map(r => r.taskDescription))
  return Array.from(descriptions).sort()
}

/**
 * Gets metrics summary for display.
 * Formats values for human-readable display.
 * 
 * @param metrics - The aggregated metrics
 * @returns Formatted metrics object
 */
export function formatMetricsForDisplay(metrics: AggregatedMetrics): {
  taskSuccessRate: string
  timeOnTask: string
  taskEfficiency: string
  errorRate: string
  seq: string
} {
  const formatValue = (value: number | null | undefined, suffix: string = ''): string => {
    if (value === null || value === undefined) return 'N/A'
    return `${value.toFixed(1)}${suffix}`
  }

  const formatTime = (seconds: number | null | undefined): string => {
    if (seconds === null || seconds === undefined) return 'N/A'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  return {
    taskSuccessRate: formatValue(metrics.metrics.taskSuccessRate?.mean, '%'),
    timeOnTask: formatTime(metrics.metrics.timeOnTask?.median),
    taskEfficiency: formatValue(metrics.metrics.taskEfficiency?.mean, '%'),
    errorRate: formatValue(metrics.metrics.errorRate?.mean, '%'),
    seq: formatValue(metrics.metrics.seq?.mean, '/7'),
  }
}
