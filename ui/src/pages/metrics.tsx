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
import type { Study, Person, AggregatedMetrics } from '../../../api/types'
import { getAllStudies, getStudyById } from '../services/studyService'
import { getByRole } from '../services/personService'
import { getStudyMetrics, formatMetricsForDisplay, getUniqueTaskDescriptions, type AnalyticsFilters } from '../services/analyticsService'
import SuccessRateChart from '../components/charts/SuccessRateChart.tsx'
import TimeOnTaskChart from '../components/charts/TimeOnTaskChart.tsx'
import MetricCard from '../components/MetricCard'

/**
 * Metrics Dashboard Page
 *
 * Displays aggregated metrics for a study with filtering capabilities.
 * Shows charts for success rate comparison and time on task trends.
 *
 * **Validates: Requirements 10.1, 10.2, 10.3**
 * - 10.1: Calculate median values for Time_on_Task across all sessions
 * - 10.2: Calculate mean values for Task_Success_Rate, Task_Efficiency, Error_Rate, and SEQ
 * - 10.3: Allow filtering of aggregated data by date range, participant, or task
 */

export default function MetricsDashboard() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // State
  const [studies, setStudies] = useState<Study[]>([])
  const [selectedStudyId, setSelectedStudyId] = useState<string>('')
  const [, setSelectedStudy] = useState<Study | null>(null)
  const [metrics, setMetrics] = useState<AggregatedMetrics | null>(null)
  const [participants, setParticipants] = useState<Person[]>([])
  const [taskDescriptions, setTaskDescriptions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filter state
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>('')
  const [selectedTask, setSelectedTask] = useState<string>('')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [filtersExpanded, setFiltersExpanded] = useState(true)

  // Load studies on mount
  useEffect(() => {
    const allStudies = getAllStudies().filter(s => !s.archived)
    setStudies(allStudies)
    
    // Load participants for filter dropdown
    const allParticipants = getByRole('participant')
    setParticipants(allParticipants)
    
    // Check for studyId in URL params
    const studyIdParam = searchParams.get('studyId')
    if (studyIdParam) {
      setSelectedStudyId(studyIdParam)
    } else if (allStudies.length > 0) {
      setSelectedStudyId(allStudies[0].id)
    }
    
    setLoading(false)
  }, [searchParams])

  // Load metrics when study or filters change
  useEffect(() => {
    if (selectedStudyId) {
      loadMetrics()
      
      // Load task descriptions for the selected study
      const tasks = getUniqueTaskDescriptions(selectedStudyId)
      setTaskDescriptions(tasks)
      
      // Load study details
      const study = getStudyById(selectedStudyId)
      setSelectedStudy(study || null)
    } else {
      setMetrics(null)
      setSelectedStudy(null)
      setTaskDescriptions([])
    }
  }, [selectedStudyId, selectedParticipantId, selectedTask, dateFrom, dateTo])

  const loadMetrics = () => {
    const filters: AnalyticsFilters = {}
    
    if (selectedParticipantId) {
      filters.participantId = selectedParticipantId
    }
    
    if (selectedTask) {
      filters.taskDescription = selectedTask
    }
    
    if (dateFrom || dateTo) {
      filters.dateRange = {
        start: dateFrom || '1970-01-01',
        end: dateTo || new Date().toISOString().split('T')[0],
      }
    }
    
    const studyMetrics = getStudyMetrics(selectedStudyId, filters)
    setMetrics(studyMetrics)
  }

  const handleStudyChange = (value: string) => {
    setSelectedStudyId(value)
    // Update URL params
    if (value) {
      setSearchParams({ studyId: value })
    } else {
      setSearchParams({})
    }
    // Reset filters when study changes
    setSelectedParticipantId('')
    setSelectedTask('')
    setDateFrom('')
    setDateTo('')
  }

  const handleClearFilters = () => {
    setSelectedParticipantId('')
    setSelectedTask('')
    setDateFrom('')
    setDateTo('')
  }

  const hasActiveFilters = selectedParticipantId || selectedTask || dateFrom || dateTo

  // Prepare dropdown options
  const participantOptions = [
    { id: '', label: 'All Participants' },
    ...participants.map(p => ({ id: p.id, label: p.name }))
  ]
  const taskOptions = [
    { id: '', label: 'All Tasks' },
    ...taskDescriptions.map(t => ({ id: t, label: t }))
  ]

  const formattedMetrics = metrics ? formatMetricsForDisplay(metrics) : null

  if (loading) {
    return (
      <div className="with-sidebar min-h-screen page-animate" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container mx-auto px-8 py-8">
          <CardLayout padding="MORE" showShadow={true}>
            <RichTextDisplayField value={['Loading...']} />
          </CardLayout>
        </div>
      </div>
    )
  }

  return (
    <div className="with-sidebar min-h-screen page-animate" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container mx-auto px-8 py-8">
        {/* Header */}
        <header className="mb-8" style={{ animation: 'fadeInDown 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-semibold mb-2" style={{
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em'
              }}>
                Metrics Dashboard
              </h1>
              <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                Analyze aggregated usability testing metrics and trends
              </p>
            </div>
            <div className="flex gap-3 items-start">
              {/* Study Selector */}
              {studies.length > 0 && (
                <div style={{ minWidth: '300px' }}>
                  <DropdownField
                    key={`study-dropdown-${studies.length}`}
                    label="Study"
                    labelPosition="ABOVE"
                    choiceLabels={['Select a study...', ...studies.map(s => s.name)]}
                    choiceValues={['', ...studies.map(s => s.id)]}
                    value={selectedStudyId}
                    onChange={handleStudyChange}
                    marginBelow="NONE"
                  />
                </div>
              )}
              <div style={{ marginTop: '30px' }}>
                <ButtonWidget
                  label="Generate Report"
                  style="SOLID"
                  color="ACCENT"
                  onClick={() => navigate(`/reports${selectedStudyId ? `?studyId=${selectedStudyId}` : ''}`)}
                  className="mb-0"
                />
              </div>
            </div>
          </div>
        </header>

        {/* No studies message */}
        {studies.length === 0 && (
          <CardLayout padding="MORE" showShadow={true}>
            <RichTextDisplayField
              value={['No studies available. Create a study first to view metrics.']}
            />
          </CardLayout>
        )}

        {/* Filter Controls */}
        {selectedStudyId && (
          <div className="mb-6">
            <CardLayout padding="MORE" showShadow={true}>
              <div className="flex items-center justify-between mb-0">
                <button
                  onClick={() => setFiltersExpanded(!filtersExpanded)}
                  className="flex items-center gap-2"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <HeadingField
                    text="Filters"
                    size="MEDIUM"
                    headingTag="H2"
                    marginBelow="NONE"
                  />
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    style={{
                      transform: filtersExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform var(--transition-base)'
                    }}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {hasActiveFilters && (
                  <ButtonWidget
                    label="Clear Filters"
                    style="OUTLINE"
                    color="NEUTRAL"
                    onClick={handleClearFilters}
                  />
                )}
              </div>

              {filtersExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Participant Filter */}
                  <DropdownField
                    label="Participant"
                    labelPosition="ABOVE"
                    choiceLabels={participantOptions.map(o => o.label)}
                    choiceValues={participantOptions.map(o => o.id)}
                    value={selectedParticipantId}
                    onChange={(value) => {
                      setSelectedParticipantId(value)
                    }}
                  />

                  {/* Task Filter */}
                  <DropdownField
                    label="Task"
                    labelPosition="ABOVE"
                    choiceLabels={taskOptions.map(o => o.label)}
                    choiceValues={taskOptions.map(o => o.id)}
                    value={selectedTask}
                    onChange={(value) => {
                      setSelectedTask(value)
                    }}
                  />

                  {/* Date From */}
                  <TextField
                    label="Date From"
                    labelPosition="ABOVE"
                    placeholder="YYYY-MM-DD"
                    value={dateFrom}
                    onChange={(value) => setDateFrom(value)}
                  />

                  {/* Date To */}
                  <TextField
                    label="Date To"
                    labelPosition="ABOVE"
                    placeholder="YYYY-MM-DD"
                    value={dateTo}
                    onChange={(value) => setDateTo(value)}
                  />
                </div>
              )}
            </CardLayout>
          </div>
        )}

        {/* Metrics Display */}
        {selectedStudyId && (
          <div className="mt-6">
            {!metrics || (metrics.sessionCount === 0) ? (
              <CardLayout padding="MORE" showShadow={true}>
                <RichTextDisplayField
                  value={['No metrics data available. Complete sessions with assessments to see aggregated results.']}
                />
              </CardLayout>
            ) : (
              <>
                {/* Primary Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                  <MetricCard
                    label="Task Success Rate"
                    value={formattedMetrics?.taskSuccessRate || 'N/A'}
                    subtitle={`Mean across ${metrics.metrics.taskSuccessRate?.count || 0} sessions`}
                    icon={
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    }
                    variant="success"
                    size="large"
                  />

                  <MetricCard
                    label="Time on Task (Median)"
                    value={formattedMetrics?.timeOnTask || 'N/A'}
                    subtitle={`Median across ${metrics.metrics.timeOnTask?.count || 0} sessions`}
                    icon={
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    }
                    variant="primary"
                    size="large"
                  />
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

                  <MetricCard
                    label="Sessions"
                    value={metrics.sessionCount}
                    subtitle={`${metrics.participantCount} participants`}
                    variant="neutral"
                  />

                  <MetricCard
                    label="Task Efficiency"
                    value={formattedMetrics?.taskEfficiency || 'N/A'}
                    subtitle={`Mean across ${metrics.metrics.taskEfficiency?.count || 0} sessions`}
                    variant="info"
                  />

                  <MetricCard
                    label="Error Rate"
                    value={formattedMetrics?.errorRate || 'N/A'}
                    subtitle={`Mean across ${metrics.metrics.errorRate?.count || 0} sessions`}
                    variant="warning"
                  />

                  <MetricCard
                    label="SEQ Score"
                    value={formattedMetrics?.seq || 'N/A'}
                    subtitle={`Mean across ${metrics.metrics.seq?.count || 0} sessions`}
                    variant="purple"
                  />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Success Rate Chart */}
                  <CardLayout padding="MORE" showShadow={true}>
                    <HeadingField
                      text="Success Rate by Task"
                      size="MEDIUM"
                      headingTag="H3"
                      marginBelow="STANDARD"
                    />
                    <SuccessRateChart studyId={selectedStudyId} />
                  </CardLayout>

                  {/* Time on Task Chart */}
                  <CardLayout padding="MORE" showShadow={true}>
                    <HeadingField
                      text="Time on Task Trends"
                      size="MEDIUM"
                      headingTag="H3"
                      marginBelow="STANDARD"
                    />
                    <TimeOnTaskChart studyId={selectedStudyId} />
                  </CardLayout>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
