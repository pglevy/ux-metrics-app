import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { getSessionsByStudy } from '../../services/sessionService'
import { getAssessmentResponsesBySession } from '../../services/assessmentResponseService'
import { getAssessmentTypeByType } from '../../services/assessmentTypeService'

/**
 * Time on Task Chart Component
 *
 * Displays a line chart showing time on task trends over sessions.
 * Uses Recharts for visualization.
 *
 * **Validates: Requirements 11.4** - Include chart visualizations of key metrics
 */

interface TimeOnTaskChartProps {
  studyId: string
}

interface ChartData {
  session: string
  date: string
  duration: number
  task: string
}

export default function TimeOnTaskChart({ studyId }: TimeOnTaskChartProps) {
  const chartData = useMemo(() => {
    // Get all sessions for the study, sorted by date
    const sessions = getSessionsByStudy(studyId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    
    // Get the time on task assessment type
    const assessmentType = getAssessmentTypeByType('time_on_task')
    if (!assessmentType) return []

    // Collect all time on task responses
    const data: ChartData[] = []
    
    for (let i = 0; i < sessions.length; i++) {
      const session = sessions[i]
      const responses = getAssessmentResponsesBySession(session.id)
      const timeResponses = responses.filter(
        r => r.assessmentTypeId === assessmentType.id
      )
      
      for (const response of timeResponses) {
        const duration = response.calculatedMetrics.durationSeconds || 
                        (response.responses.manualDurationSeconds as number) || 0
        
        if (duration > 0) {
          data.push({
            session: `Session ${i + 1}`,
            date: new Date(session.createdAt).toLocaleDateString(),
            duration: Math.round(duration),
            task: response.taskDescription,
          })
        }
      }
    }

    return data
  }, [studyId])

  // Group data by task for multiple lines
  const groupedData = useMemo(() => {
    const sessions = [...new Set(chartData.map(d => d.session))]
    const uniqueTasks = [...new Set(chartData.map(d => d.task))]
    
    return sessions.map(session => {
      const sessionData: Record<string, string | number> = { session }
      const sessionItems = chartData.filter(d => d.session === session)
      
      for (const item of sessionItems) {
        // Use index-based key to ensure uniqueness
        const taskIndex = uniqueTasks.indexOf(item.task)
        const taskKey = `task-${taskIndex}`
        sessionData[taskKey] = item.duration
      }
      
      // Add date for tooltip
      const firstItem = sessionItems[0]
      if (firstItem) {
        sessionData.date = firstItem.date
      }
      
      return sessionData
    })
  }, [chartData])

  // Get unique task names for lines (with display names and unique keys)
  const tasks = useMemo(() => {
    const uniqueTasks = [...new Set(chartData.map(d => d.task))]
    return uniqueTasks.map((task, index) => ({
      key: `task-${index}`,
      fullName: task,
      displayName: task.length > 15 ? task.substring(0, 15) + '...' : task,
    }))
  }, [chartData])

  // Colors for different tasks
  const colors = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#ec4899']

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No time on task data available
      </div>
    )
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={groupedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="session" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={(value) => `${Math.round(value)}s`}
            label={{ value: 'Duration (s)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value: number | undefined) => value !== undefined ? [formatDuration(value), 'Duration'] : ['N/A', 'Duration']}
            labelFormatter={(label, payload) => {
              const item = payload?.[0]?.payload
              return item?.date ? `${label} (${item.date})` : String(label)
            }}
          />
          <Legend />
          {tasks.map((task, index) => (
            <Line
              key={task.key}
              type="monotone"
              dataKey={task.key}
              name={task.displayName}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
