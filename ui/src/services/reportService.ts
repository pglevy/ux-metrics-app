/**
 * Report Service
 * 
 * Generates shareable reports with aggregated metrics, participant count,
 * and session count. Supports JSON export with optional commentary.
 * 
 * **Validates: Requirements 11.1, 11.2, 11.3, 11.5**
 * - 11.1: Generate summary reports for individual studies
 * - 11.2: Include aggregated metrics, participant count, and session count
 * - 11.3: Allow reports to be exported as JSON
 * - 11.5: Allow users to add commentary or notes to reports
 */

import type { Report, MetricsSummary } from '../../../api/types'
import { getStudyById } from './studyService'
import { getStudyMetrics, type AnalyticsFilters } from './analyticsService'
import { generateId } from './storage'

/**
 * Options for generating a report.
 */
export interface ReportOptions {
  /** Optional commentary or notes to include in the report */
  commentary?: string
  /** Optional filters to apply when calculating metrics */
  filters?: AnalyticsFilters
}

/**
 * Extended report with additional display data.
 */
export interface ReportWithDetails extends Report {
  /** Formatted metrics for display */
  formattedMetrics: {
    taskSuccessRate: string
    timeOnTask: string
    taskEfficiency: string
    errorRate: string
    seq: string
  }
  /** Date range of the data */
  dateRange: {
    start: string
    end: string
  }
}

/**
 * Generates a report for a study with aggregated metrics.
 * 
 * @param studyId - The study identifier
 * @param options - Optional report generation options
 * @returns The generated Report object, or null if study not found
 * 
 * **Validates: Requirements 11.1, 11.2**
 * 
 * @example
 * const report = generateReport('study-123', { commentary: 'Initial findings' });
 * if (report) {
 *   console.log(`Report generated: ${report.id}`);
 * }
 */
export function generateReport(studyId: string, options?: ReportOptions): Report | null {
  // Validate study exists
  const study = getStudyById(studyId)
  if (!study) {
    console.error(`generateReport: Study with id "${studyId}" not found`)
    return null
  }

  // Get aggregated metrics
  const metrics = getStudyMetrics(studyId, options?.filters)

  // Create report
  const report: Report = {
    id: generateId('report'),
    studyId,
    studyName: study.name,
    generatedAt: new Date().toISOString(),
    metrics: metrics.metrics,
    sessionCount: metrics.sessionCount,
    participantCount: metrics.participantCount,
    commentary: options?.commentary || null,
  }

  return report
}

/**
 * Generates a report with additional display details.
 * 
 * @param studyId - The study identifier
 * @param options - Optional report generation options
 * @returns The generated ReportWithDetails object, or null if study not found
 * 
 * @example
 * const report = generateReportWithDetails('study-123');
 * console.log(`Success Rate: ${report.formattedMetrics.taskSuccessRate}`);
 */
export function generateReportWithDetails(
  studyId: string, 
  options?: ReportOptions
): ReportWithDetails | null {
  const study = getStudyById(studyId)
  if (!study) {
    console.error(`generateReportWithDetails: Study with id "${studyId}" not found`)
    return null
  }

  // Get aggregated metrics
  const metrics = getStudyMetrics(studyId, options?.filters)

  // Format metrics for display
  const formattedMetrics = formatMetricsForReport(metrics.metrics)

  // Create report with details
  const report: ReportWithDetails = {
    id: generateId('report'),
    studyId,
    studyName: study.name,
    generatedAt: new Date().toISOString(),
    metrics: metrics.metrics,
    sessionCount: metrics.sessionCount,
    participantCount: metrics.participantCount,
    commentary: options?.commentary || null,
    formattedMetrics,
    dateRange: metrics.dateRange,
  }

  return report
}

/**
 * Formats metrics for display in reports.
 * 
 * @param metrics - The metrics summary to format
 * @returns Formatted metrics object with string values
 */
function formatMetricsForReport(metrics: MetricsSummary): {
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
    taskSuccessRate: formatValue(metrics.taskSuccessRate?.mean, '%'),
    timeOnTask: formatTime(metrics.timeOnTask?.median),
    taskEfficiency: formatValue(metrics.taskEfficiency?.mean, '%'),
    errorRate: formatValue(metrics.errorRate?.mean, '%'),
    seq: formatValue(metrics.seq?.mean, '/7'),
  }
}

/**
 * Exports a report as a JSON string.
 * 
 * @param report - The report to export
 * @returns JSON string representation of the report
 * 
 * **Validates: Requirements 11.3**
 * 
 * @example
 * const report = generateReport('study-123');
 * const json = exportReportAsJSON(report);
 * console.log(json);
 */
export function exportReportAsJSON(report: Report): string {
  return JSON.stringify(report, null, 2)
}

/**
 * Downloads a report as a JSON file.
 * Creates a blob and triggers a download in the browser.
 * 
 * @param report - The report to download
 * @param filename - Optional custom filename (defaults to report-{studyId}-{date}.json)
 * 
 * **Validates: Requirements 11.3**
 * 
 * @example
 * const report = generateReport('study-123');
 * downloadReportAsJSON(report);
 */
export function downloadReportAsJSON(report: Report, filename?: string): void {
  const json = exportReportAsJSON(report)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const date = new Date().toISOString().split('T')[0]
  const defaultFilename = `report-${report.studyId}-${date}.json`
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename || defaultFilename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

/**
 * Updates the commentary on a report.
 * 
 * @param report - The report to update
 * @param commentary - The new commentary text
 * @returns Updated report with new commentary
 * 
 * **Validates: Requirements 11.5**
 * 
 * @example
 * let report = generateReport('study-123');
 * report = updateReportCommentary(report, 'Updated findings after review');
 */
export function updateReportCommentary(report: Report, commentary: string): Report {
  return {
    ...report,
    commentary: commentary || null,
  }
}

/**
 * Validates that a report has all required fields.
 * 
 * @param report - The report to validate
 * @returns true if valid, false otherwise
 * 
 * @example
 * const report = generateReport('study-123');
 * if (isValidReport(report)) {
 *   downloadReportAsJSON(report);
 * }
 */
export function isValidReport(report: Report | null): report is Report {
  if (!report) return false
  
  return (
    typeof report.id === 'string' &&
    typeof report.studyId === 'string' &&
    typeof report.generatedAt === 'string' &&
    typeof report.sessionCount === 'number' &&
    typeof report.participantCount === 'number' &&
    report.metrics !== undefined
  )
}

/**
 * Creates a summary text for a report.
 * Useful for displaying a quick overview.
 * 
 * @param report - The report to summarize
 * @returns Summary text string
 * 
 * @example
 * const report = generateReport('study-123');
 * const summary = getReportSummary(report);
 * console.log(summary);
 */
export function getReportSummary(report: Report): string {
  const lines = [
    `Study: ${report.studyName || report.studyId}`,
    `Generated: ${new Date(report.generatedAt).toLocaleString()}`,
    `Sessions: ${report.sessionCount}`,
    `Participants: ${report.participantCount}`,
  ]

  if (report.metrics.taskSuccessRate?.mean !== null && report.metrics.taskSuccessRate?.mean !== undefined) {
    lines.push(`Task Success Rate: ${report.metrics.taskSuccessRate.mean.toFixed(1)}%`)
  }

  if (report.metrics.timeOnTask?.median !== null && report.metrics.timeOnTask?.median !== undefined) {
    const mins = Math.floor(report.metrics.timeOnTask.median / 60)
    const secs = Math.round(report.metrics.timeOnTask.median % 60)
    lines.push(`Time on Task (Median): ${mins}m ${secs}s`)
  }

  if (report.metrics.seq?.mean !== null && report.metrics.seq?.mean !== undefined) {
    lines.push(`SEQ Score: ${report.metrics.seq.mean.toFixed(1)}/7`)
  }

  if (report.commentary) {
    lines.push(`\nCommentary: ${report.commentary}`)
  }

  return lines.join('\n')
}
