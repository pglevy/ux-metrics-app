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
import SuccessRateChart from '../components/charts/SuccessRateChart'
import TimeOnTaskChart from '../components/charts/TimeOnTaskChart'

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
            text="Metrics Dashboard"
            size="LARGE"
            headingTag="H1"
            marginBelow="NONE"
          />
          <div className="flex gap-2">
            <ButtonWidget
              label="Generate Report"
              style="SOLID"
              color="ACCENT"
              onClick={() => navigate(`/reports${selectedStudyId ? `?studyId=${selectedStudyId}` : ''}`)}
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
              value={['No studies available. Create a study first to view metrics.']}
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

        {/* Filter Controls */}
        {selectedStudyId && (
          <div className="mt-6">
            <CardLayout padding="MORE" showShadow={true}>
              <div className="flex items-center justify-between mb-4">
                <HeadingField
                  text="Filters"
                  size="MEDIUM"
                  headingTag="H2"
                  marginBelow="NONE"
                />
                {hasActiveFilters && (
                  <ButtonWidget
                    label="Clear Filters"
                    style="OUTLINE"
                    color="NEUTRAL"
                    onClick={handleClearFilters}
                  />
                )}
              </div>
              
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
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {/* Session & Participant Count */}
                  <CardLayout padding="MORE" showShadow={true}>
                    <HeadingField
                      text="Overview"
                      size="SMALL"
                      headingTag="H3"
                      marginBelow="STANDARD"
                    />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sessions:</span>
                        <span className="font-semibold">{metrics.sessionCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Participants:</span>
                        <span className="font-semibold">{metrics.participantCount}</span>
                      </div>
                      {metrics.dateRange.start && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date Range:</span>
                          <span className="font-semibold text-sm">
                            {new Date(metrics.dateRange.start).toLocaleDateString()} - {new Date(metrics.dateRange.end).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardLayout>

                  {/* Task Success Rate */}
                  <CardLayout padding="MORE" showShadow={true}>
                    <HeadingField
                      text="Task Success Rate"
                      size="SMALL"
                      headingTag="H3"
                      marginBelow="STANDARD"
                    />
                    <div className="text-3xl font-bold text-green-600">
                      {formattedMetrics?.taskSuccessRate}
                    </div>
                    <div className="text-sm text-gray-500">
                      {metrics.metrics.taskSuccessRate?.count || 0} measurements
                    </div>
                  </CardLayout>

                  {/* Time on Task */}
                  <CardLayout padding="MORE" showShadow={true}>
                    <HeadingField
                      text="Time on Task (Median)"
                      size="SMALL"
                      headingTag="H3"
                      marginBelow="STANDARD"
                    />
                    <div className="text-3xl font-bold text-blue-600">
                      {formattedMetrics?.timeOnTask}
                    </div>
                    <div className="text-sm text-gray-500">
                      {metrics.metrics.timeOnTask?.count || 0} measurements
                    </div>
                  </CardLayout>

                  {/* Task Efficiency */}
                  <CardLayout padding="MORE" showShadow={true}>
                    <HeadingField
                      text="Task Efficiency"
                      size="SMALL"
                      headingTag="H3"
                      marginBelow="STANDARD"
                    />
                    <div className="text-3xl font-bold text-purple-600">
                      {formattedMetrics?.taskEfficiency}
                    </div>
                    <div className="text-sm text-gray-500">
                      {metrics.metrics.taskEfficiency?.count || 0} measurements
                    </div>
                  </CardLayout>

                  {/* Error Rate */}
                  <CardLayout padding="MORE" showShadow={true}>
                    <HeadingField
                      text="Error Rate"
                      size="SMALL"
                      headingTag="H3"
                      marginBelow="STANDARD"
                    />
                    <div className="text-3xl font-bold text-red-600">
                      {formattedMetrics?.errorRate}
                    </div>
                    <div className="text-sm text-gray-500">
                      {metrics.metrics.errorRate?.count || 0} measurements
                    </div>
                  </CardLayout>

                  {/* SEQ Score */}
                  <CardLayout padding="MORE" showShadow={true}>
                    <HeadingField
                      text="SEQ Score"
                      size="SMALL"
                      headingTag="H3"
                      marginBelow="STANDARD"
                    />
                    <div className="text-3xl font-bold text-orange-600">
                      {formattedMetrics?.seq}
                    </div>
                    <div className="text-sm text-gray-500">
                      {metrics.metrics.seq?.count || 0} measurements
                    </div>
                  </CardLayout>
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
