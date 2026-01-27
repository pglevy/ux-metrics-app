import { useState } from 'react'
import {
  HeadingField,
  CardLayout,
  TextField,
  ButtonWidget,
  MessageBanner,
} from '@pglevy/sailwind'
import { 
  createAssessmentResponseWithMetrics,
} from '../../services/assessmentResponseService'
import { 
  calculateEfficiency, 
  formatPercentage,
  type TaskEfficiencyData,
} from '../../utils/calculations'

/**
 * TaskEfficiencyForm Component
 * 
 * Form for capturing task efficiency data (optimal vs actual steps).
 * Displays calculated efficiency percentage.
 * 
 * **Validates: Requirements 6.1, 6.5**
 * - 6.1: Record the number of optimal steps and actual steps taken
 * - 6.5: Display the calculated efficiency percentage
 */

interface TaskEfficiencyFormProps {
  /** The session ID this assessment belongs to */
  sessionId: string
  /** The assessment type ID for task efficiency */
  assessmentTypeId: string
  /** Callback when assessment is saved successfully */
  onSave?: (responseId: string) => void
  /** Callback when form is cancelled */
  onCancel?: () => void
}

export default function TaskEfficiencyForm({
  sessionId,
  assessmentTypeId,
  onSave,
  onCancel,
}: TaskEfficiencyFormProps) {
  // Form state
  const [taskDescription, setTaskDescription] = useState('')
  const [optimalPathDefinition, setOptimalPathDefinition] = useState('')
  const [optimalSteps, setOptimalSteps] = useState('')
  const [actualSteps, setActualSteps] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Validation errors
  const [taskDescriptionError, setTaskDescriptionError] = useState<string | null>(null)
  const [optimalPathError, setOptimalPathError] = useState<string | null>(null)
  const [optimalStepsError, setOptimalStepsError] = useState<string | null>(null)
  const [actualStepsError, setActualStepsError] = useState<string | null>(null)

  // Calculate live efficiency preview
  const getEfficiencyPreview = (): number | null => {
    const optimal = parseInt(optimalSteps)
    const actual = parseInt(actualSteps)
    
    if (isNaN(optimal) || isNaN(actual) || optimal <= 0 || actual <= 0) {
      return null
    }
    
    return calculateEfficiency({
      taskDescription: '',
      optimalSteps: optimal,
      actualSteps: actual,
    })
  }

  // Validation functions
  const validateTaskDescription = (value: string): boolean => {
    if (!value.trim()) {
      setTaskDescriptionError('Task description is required.')
      return false
    }
    setTaskDescriptionError(null)
    return true
  }

  const validateOptimalPath = (value: string): boolean => {
    if (!value.trim()) {
      setOptimalPathError('Optimal path definition is required.')
      return false
    }
    setOptimalPathError(null)
    return true
  }

  const validateOptimalSteps = (value: string): boolean => {
    const num = parseInt(value)
    if (isNaN(num) || num < 1) {
      setOptimalStepsError('Optimal steps must be at least 1.')
      return false
    }
    setOptimalStepsError(null)
    return true
  }

  const validateActualSteps = (value: string): boolean => {
    const num = parseInt(value)
    if (isNaN(num) || num < 1) {
      setActualStepsError('Actual steps must be at least 1.')
      return false
    }
    setActualStepsError(null)
    return true
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    // Validate all fields
    const isTaskDescriptionValid = validateTaskDescription(taskDescription)
    const isOptimalPathValid = validateOptimalPath(optimalPathDefinition)
    const isOptimalStepsValid = validateOptimalSteps(optimalSteps)
    const isActualStepsValid = validateActualSteps(actualSteps)

    if (!isTaskDescriptionValid || !isOptimalPathValid || !isOptimalStepsValid || !isActualStepsValid) {
      return
    }

    setLoading(true)

    try {
      const efficiencyData: TaskEfficiencyData = {
        taskDescription: taskDescription.trim(),
        optimalSteps: parseInt(optimalSteps),
        actualSteps: parseInt(actualSteps),
      }

      const efficiency = calculateEfficiency(efficiencyData)

      const response = createAssessmentResponseWithMetrics(
        {
          sessionId,
          assessmentTypeId,
          taskDescription: taskDescription.trim(),
          responses: {
            optimalPathDefinition: optimalPathDefinition.trim(),
            optimalSteps: parseInt(optimalSteps),
            actualSteps: parseInt(actualSteps),
          },
        },
        { efficiency }
      )

      if (!response) {
        setError('Failed to save assessment response.')
        return
      }

      setSuccessMessage(
        `Task efficiency recorded: ${formatPercentage(efficiency)} ` +
        `(${optimalSteps} optimal steps / ${actualSteps} actual steps)`
      )

      // Reset form for next entry
      setTaskDescription('')
      setOptimalPathDefinition('')
      setOptimalSteps('')
      setActualSteps('')

      onSave?.(response.id)
    } catch (err) {
      console.error('Failed to save assessment:', err)
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const efficiencyPreview = getEfficiencyPreview()

  return (
    <div>
      {/* Error Banner */}
      {error && (
        <div className="mb-6">
          <MessageBanner
            primaryText={error}
            backgroundColor="NEGATIVE"
            icon="error"
          />
        </div>
      )}

      {/* Success Banner */}
      {successMessage && (
        <div className="mb-6">
          <MessageBanner
            primaryText={successMessage}
            backgroundColor="POSITIVE"
            icon="success"
          />
        </div>
      )}

      {/* Form */}
      <CardLayout padding="MORE" showShadow={true}>
        <HeadingField
          text="Task Efficiency Assessment"
          size="MEDIUM"
          headingTag="H2"
          marginBelow="STANDARD"
        />
        
        <p className="text-gray-600 mb-6">
          Compare the optimal path to the actual path taken by the participant.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Task Description */}
          <div className="mb-4">
            <TextField
              label="Task Description"
              value={taskDescription}
              onChange={setTaskDescription}
              labelPosition="ABOVE"
              marginBelow="NONE"
              placeholder="Describe the task being measured"
              required={true}
            />
            {taskDescriptionError && (
              <p className="mt-1 text-sm text-red-700">{taskDescriptionError}</p>
            )}
          </div>

          {/* Optimal Path Definition */}
          <div className="mb-4">
            <TextField
              label="Optimal Path Definition"
              value={optimalPathDefinition}
              onChange={setOptimalPathDefinition}
              labelPosition="ABOVE"
              marginBelow="NONE"
              placeholder="Describe the ideal steps to complete the task"
              required={true}
            />
            {optimalPathError && (
              <p className="mt-1 text-sm text-red-700">{optimalPathError}</p>
            )}
          </div>

          {/* Steps Input */}
          <div className="mb-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <HeadingField
                text="Step Counts"
                size="SMALL"
                headingTag="H4"
                marginBelow="STANDARD"
              />
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <TextField
                    label="Optimal Steps"
                    value={optimalSteps}
                    onChange={setOptimalSteps}
                    labelPosition="ABOVE"
                    marginBelow="NONE"
                    placeholder="e.g., 5"
                  />
                  {optimalStepsError && (
                    <p className="mt-1 text-sm text-red-700">{optimalStepsError}</p>
                  )}
                </div>
                <div className="flex-1">
                  <TextField
                    label="Actual Steps"
                    value={actualSteps}
                    onChange={setActualSteps}
                    labelPosition="ABOVE"
                    marginBelow="NONE"
                    placeholder="e.g., 8"
                  />
                  {actualStepsError && (
                    <p className="mt-1 text-sm text-red-700">{actualStepsError}</p>
                  )}
                </div>
              </div>

              {/* Efficiency Preview */}
              {efficiencyPreview !== null && (
                <div className="mt-4 p-3 bg-white rounded-md border border-gray-200">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Calculated Efficiency</div>
                    <div className={`text-2xl font-bold ${
                      efficiencyPreview >= 100 ? 'text-green-600' :
                      efficiencyPreview >= 75 ? 'text-blue-600' :
                      efficiencyPreview >= 50 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {formatPercentage(efficiencyPreview)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {efficiencyPreview >= 100 
                        ? 'Participant matched or exceeded optimal path!'
                        : efficiencyPreview >= 75
                        ? 'Good efficiency'
                        : efficiencyPreview >= 50
                        ? 'Moderate efficiency - room for improvement'
                        : 'Low efficiency - significant deviation from optimal path'
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <ButtonWidget
              label={loading ? 'Saving...' : 'Record Efficiency'}
              style="SOLID"
              color="ACCENT"
              submit={true}
            />
            {onCancel && (
              <ButtonWidget
                label="Cancel"
                style="OUTLINE"
                color="NEUTRAL"
                onClick={onCancel}
              />
            )}
          </div>
        </form>
      </CardLayout>
    </div>
  )
}
