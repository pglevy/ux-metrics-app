import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { getSessionsByStudy } from '../../services/sessionService'
import { getAssessmentResponsesBySession } from '../../services/assessmentResponseService'
import { getAssessmentTypeByType } from '../../services/assessmentTypeService'

/**
 * Success Rate Chart Component
 *
 * Displays a bar chart comparing success rates across different tasks.
 * Uses Recharts for visualization.
 *
 * **Validates: Requirements 11.4** - Include chart visualizations of key metrics
 */

interface SuccessRateChartProps {
  studyId: string
}

interface ChartData {
  task: string
  successRate: number
  count: number
}

export default function SuccessRateChart({ studyId }: SuccessRateChartProps) {
  const chartData = useMemo(() => {
    // Get all sessions for the study
    const sessions = getSessionsByStudy(studyId)
    
    // Get the task success rate assessment type
    const assessmentType = getAssessmentTypeByType('task_success_rate')
    if (!assessmentType) return []

    // Collect all task success rate responses
    const taskData: Record<string, { successful: number; total: number }> = {}
    
    for (const session of sessions) {
      const responses = getAssessmentResponsesBySession(session.id)
      const successRateResponses = responses.filter(
        r => r.assessmentTypeId === assessmentType.id
      )
      
      for (const response of successRateResponses) {
        const task = response.taskDescription
        if (!taskData[task]) {
          taskData[task] = { successful: 0, total: 0 }
        }
        
        taskData[task].total++
        if (response.responses.successful === true || response.calculatedMetrics.successRate === 100) {
          taskData[task].successful++
        }
      }
    }

    // Convert to chart data format
    const data: ChartData[] = Object.entries(taskData).map(([task, stats]) => ({
      task: task.length > 20 ? task.substring(0, 20) + '...' : task,
      successRate: stats.total > 0 ? (stats.successful / stats.total) * 100 : 0,
      count: stats.total,
    }))

    // Sort by success rate descending
    return data.sort((a, b) => b.successRate - a.successRate)
  }, [studyId])

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No task success rate data available
      </div>
    )
  }

  // Color based on success rate
  const getBarColor = (successRate: number) => {
    if (successRate >= 80) return '#22c55e' // green-500
    if (successRate >= 60) return '#eab308' // yellow-500
    return '#ef4444' // red-500
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} unit="%" />
          <YAxis 
            type="category" 
            dataKey="task" 
            width={100}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number | undefined) => value !== undefined ? [`${value.toFixed(1)}%`, 'Success Rate'] : ['N/A', 'Success Rate']}
            labelFormatter={(label) => `Task: ${label}`}
          />
          <Bar dataKey="successRate" name="Success Rate">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.successRate)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
