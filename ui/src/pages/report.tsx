import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  HeadingField,
  CardLayout,
  ButtonWidget,
  RichTextDisplayField,
  DropdownField,
  TextField,
} from '@pglevy/sailwind'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import type { Study } from '../../../api/types'
import { getAllStudies, getStudyById } from '../services/studyService'
import { 
  generateReportWithDetails, 
  downloadReportAsJSON, 
  updateReportCommentary,
  type ReportWithDetails 
} from '../services/reportService'
import { getSessionsByStudy } from '../services/sessionService'
import { getAssessmentResponsesBySession } from '../services/assessmentResponseService'
import { getAssessmentTypeByType } from '../services/assessmentTypeService'

/**
 * Report Generator Page
 *
 * Generates and displays shareable reports with visualizations.
 * Supports JSON export and commentary features.
 *
 * **Validates: Requirements 11.1, 11.3, 11.4, 11.5**
 * - 11.1: Generate summary reports for individual studies
 * - 11.3: Allow reports to be exported as JSON
 * - 11.4: Include chart visualizations of key metrics
 * - 11.5: Allow users to add commentary or notes to reports
 */

export default function ReportGenerator() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // State
  const [studies, setStudies] = useState<Study[]>([])
  const [selectedStudyId, setSelectedStudyId] = useState<string>('')
  const [, setSelectedStudy] = useState<Study | null>(null)
  const [report, setReport] = useState<ReportWithDetails | null>(null)
  const [commentary, setCommentary] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  // Load studies on mount
  useEffect(() => {
    const allStudies = getAllStudies().filter(s => !s.archived)
    setStudies(allStudies)
    
    // Check for studyId in URL params
    const studyIdParam = searchParams.get('studyId')
    if (studyIdParam) {
      setSelectedStudyId(studyIdParam)
    } else if (allStudies.length > 0) {
      setSelectedStudyId(allStudies[0].id)
    }
    
    setLoading(false)
  }, [searchParams])

  // Generate report when study changes
  useEffect(() => {
    if (selectedStudyId) {
      handleGenerateReport()
      
      // Load study details
      const study = getStudyById(selectedStudyId)
      setSelectedStudy(study || null)
    } else {
      setReport(null)
      setSelectedStudy(null)
    }
  }, [selectedStudyId])

  const handleStudyChange = (value: string) => {
    setSelectedStudyId(value)
    setCommentary('')
    // Update URL params
    if (value) {
      setSearchParams({ studyId: value })
    } else {
      setSearchParams({})
    }
  }

  const handleGenerateReport = () => {
    if (!selectedStudyId) return
    
    setGenerating(true)
    try {
      const newReport = generateReportWithDetails(selectedStudyId, {
        commentary: commentary || undefined,
      })
      setReport(newReport)
    } catch (error) {
      console.error('Failed to generate report:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleCommentaryChange = (value: string) => {
    setCommentary(value)
    if (report) {
      setReport({
        ...report,
        commentary: value || null,
      })
    }
  }

  const handleExportJSON = () => {
    if (!report) return
    
    // Update report with latest commentary before export
    const reportToExport = updateReportCommentary(report, commentary)
    downloadReportAsJSON(reportToExport)
  }

  // Prepare chart data
  const metricsChartData = report ? [
    { 
      name: 'Success Rate', 
      value: report.metrics.taskSuccessRate?.mean || 0,
      fill: '#22c55e',
    },
    { 
      name: 'Efficiency', 
      value: report.metrics.taskEfficiency?.mean || 0,
      fill: '#3b82f6',
    },
    { 
      name: 'Error Rate', 
      value: report.metrics.errorRate?.mean || 0,
      fill: '#ef4444',
    },
  ].filter(d => d.value > 0) : []

  // SEQ distribution data
  const seqDistributionData = useSEQDistribution(selectedStudyId)

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50">
        <div className="container mx-auto px-8 py-8">
          <CardLayout padding="MORE" showShadow={true}>
            <RichTextDisplayField value={['Loading...']} />
          </CardLayout>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <HeadingField
            text="Report Generator"
            size="LARGE"
            headingTag="H1"
            marginBelow="NONE"
          />
          <div className="flex gap-2">
            <ButtonWidget
              label="View Metrics"
              style="OUTLINE"
              color="ACCENT"
              onClick={() => navigate(`/metrics${selectedStudyId ? `?studyId=${selectedStudyId}` : ''}`)}
            />
            <ButtonWidget
              label="← Back to Home"
              style="OUTLINE"
              color="NEUTRAL"
              onClick={() => navigate('/')}
            />
          </div>
        </div>

        {/* Study Selector */}
        <CardLayout padding="MORE" showShadow={true}>
          <HeadingField
            text="Select Study"
            size="MEDIUM"
            headingTag="H2"
            marginBelow="STANDARD"
          />
          {studies.length === 0 ? (
            <RichTextDisplayField
              value={['No studies available. Create a study first to generate reports.']}
            />
          ) : (
            <div className="max-w-md">
              <DropdownField
                key={`study-dropdown-${studies.length}`}
                label="Study"
                labelPosition="ABOVE"
                choiceLabels={['Select a study...', ...studies.map(s => s.name)]}
                choiceValues={['', ...studies.map(s => s.id)]}
                value={selectedStudyId}
                onChange={handleStudyChange}
              />
            </div>
          )}
        </CardLayout>

        {/* Report Preview */}
        {selectedStudyId && report && (
          <div className="mt-6 space-y-6">
            {/* Report Header */}
            <CardLayout padding="MORE" showShadow={true}>
              <div className="flex items-center justify-between mb-4">
                <HeadingField
                  text="Report Preview"
                  size="MEDIUM"
                  headingTag="H2"
                  marginBelow="NONE"
                />
                <ButtonWidget
                  label="Download JSON"
                  style="SOLID"
                  color="ACCENT"
                  onClick={handleExportJSON}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Study:</strong> {report.studyName || report.studyId}
                </div>
                <div>
                  <strong>Generated:</strong> {new Date(report.generatedAt).toLocaleString()}
                </div>
                <div>
                  <strong>Sessions:</strong> {report.sessionCount}
                </div>
                <div>
                  <strong>Participants:</strong> {report.participantCount}
                </div>
                {report.dateRange.start && (
                  <div className="md:col-span-2">
                    <strong>Date Range:</strong>{' '}
                    {new Date(report.dateRange.start).toLocaleDateString()} - {new Date(report.dateRange.end).toLocaleDateString()}
                  </div>
                )}
              </div>
            </CardLayout>

            {/* Metrics Summary */}
            <CardLayout padding="MORE" showShadow={true}>
              <HeadingField
                text="Metrics Summary"
                size="MEDIUM"
                headingTag="H2"
                marginBelow="STANDARD"
              />
              
              {report.sessionCount === 0 ? (
                <RichTextDisplayField
                  value={['No metrics data available. Complete sessions with assessments to generate a report.']}
                />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {report.formattedMetrics.taskSuccessRate}
                    </div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {report.formattedMetrics.timeOnTask}
                    </div>
                    <div className="text-sm text-gray-600">Time on Task</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {report.formattedMetrics.taskEfficiency}
                    </div>
                    <div className="text-sm text-gray-600">Efficiency</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {report.formattedMetrics.errorRate}
                    </div>
                    <div className="text-sm text-gray-600">Error Rate</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {report.formattedMetrics.seq}
                    </div>
                    <div className="text-sm text-gray-600">SEQ Score</div>
                  </div>
                </div>
              )}
            </CardLayout>

            {/* Charts */}
            {report.sessionCount > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Metrics Comparison Chart */}
                {metricsChartData.length > 0 && (
                  <CardLayout padding="MORE" showShadow={true}>
                    <HeadingField
                      text="Metrics Comparison"
                      size="MEDIUM"
                      headingTag="H3"
                      marginBelow="STANDARD"
                    />
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metricsChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} unit="%" />
                          <Tooltip formatter={(value: number | undefined) => value !== undefined ? [`${value.toFixed(1)}%`, 'Value'] : ['N/A', 'Value']} />
                          <Bar dataKey="value">
                            {metricsChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardLayout>
                )}

                {/* SEQ Distribution Chart */}
                {seqDistributionData.length > 0 && (
                  <CardLayout padding="MORE" showShadow={true}>
                    <HeadingField
                      text="SEQ Score Distribution"
                      size="MEDIUM"
                      headingTag="H3"
                      marginBelow="STANDARD"
                    />
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={seqDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {seqDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardLayout>
                )}
              </div>
            )}

            {/* Commentary Section */}
            <CardLayout padding="MORE" showShadow={true}>
              <HeadingField
                text="Commentary & Notes"
                size="MEDIUM"
                headingTag="H2"
                marginBelow="STANDARD"
              />
              <TextField
                label="Add your observations, findings, and recommendations"
                labelPosition="ABOVE"
                value={commentary}
                onChange={handleCommentaryChange}
              />
              <div className="mt-2 text-sm text-gray-500">
                Commentary will be included in the JSON export.
              </div>
            </CardLayout>

            {/* Export Actions */}
            <CardLayout padding="MORE" showShadow={true}>
              <div className="flex items-center justify-between">
                <div>
                  <HeadingField
                    text="Export Report"
                    size="MEDIUM"
                    headingTag="H2"
                    marginBelow="NONE"
                  />
                  <div className="text-sm text-gray-600 mt-1">
                    Download the complete report with all metrics and commentary.
                  </div>
                </div>
                <ButtonWidget
                  label="Download as JSON"
                  style="SOLID"
                  color="ACCENT"
                  onClick={handleExportJSON}
                />
              </div>
            </CardLayout>
          </div>
        )}

        {/* Empty State */}
        {selectedStudyId && !report && !generating && (
          <div className="mt-6">
            <CardLayout padding="MORE" showShadow={true}>
              <RichTextDisplayField
                value={['Unable to generate report. Please try selecting a different study.']}
              />
            </CardLayout>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Custom hook to get SEQ distribution data for charts.
 */
function useSEQDistribution(studyId: string): Array<{ name: string; value: number; fill: string }> {
  if (!studyId) return []

  const sessions = getSessionsByStudy(studyId)
  const assessmentType = getAssessmentTypeByType('seq')
  if (!assessmentType) return []

  // Count SEQ ratings
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 }
  
  for (const session of sessions) {
    const responses = getAssessmentResponsesBySession(session.id)
    const seqResponses = responses.filter(r => r.assessmentTypeId === assessmentType.id)
    
    for (const response of seqResponses) {
      const rating = response.calculatedMetrics.seqRating || (response.responses.rating as number)
      if (rating >= 1 && rating <= 7) {
        distribution[Math.round(rating)]++
      }
    }
  }

  // Convert to chart data
  const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4']
  
  return Object.entries(distribution)
    .filter(([_, count]) => count > 0)
    .map(([rating, count]) => ({
      name: `Rating ${rating}`,
      value: count,
      fill: colors[parseInt(rating) - 1],
    }))
}
