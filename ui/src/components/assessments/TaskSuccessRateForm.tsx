import { useState, useEffect } from 'react'
import {
  HeadingField,
  CardLayout,
  TextField,
  RadioButtonField,
  ButtonWidget,
  MessageBanner,
} from '@pglevy/sailwind'
import { 
  createAssessmentResponseWithMetrics,
  getAssessmentResponsesBySession,
} from '../../services/assessmentResponseService'
import { getAssessmentTypeByType } from '../../services/assessmentTypeService'
import { 
  calculateSingleSuccessRate, 
  calculateSuccessRate,
  formatPercentage,
  type TaskSuccessRateData,
} from '../../utils/calculations'

/**
 * TaskSuccessRateForm Component
 * 
 * Form for capturing task success/failure data.
 * Displays calculated success rate after submission.
 * 
 * **Validates: Requirements 4.1, 4.3, 4.5**
 * - 4.1: Record whether each task attempt was successful or unsuccessful
 * - 4.3: Allow multiple task attempts to be recorded within a single session
 * - 4.5: Display the calculated success rate immediately after data entry
 */

interface TaskSuccessRateFormProps {
  /** The session ID this assessment belongs to */
  sessionId: string
  /** The assessment type ID for task success rate */
  assessmentTypeId: string
  /** Callback when assessment is saved successfully */
  onSave?: (responseId: string) => void
  /** Callback when form is cancelled */
  onCancel?: () => void
}

export default function TaskSuccessRateForm({
  sessionId,
  assessmentTypeId,
  onSave,
  onCancel,
}: TaskSuccessRateFormProps) {
  // Form state
  const [taskDescription, setTaskDescription] = useState('')
  const [successCriteria, setSuccessCriteria] = useState('')
  const [successful, setSuccessful] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Validation errors
  const [taskDescriptionError, setTaskDescriptionError] = useState<string | null>(null)
  const [successCriteriaError, setSuccessCriteriaError] = useState<string | null>(null)
  const [successfulError, setSuccessfulError] = useState<string | null>(null)

  // Session success rate (calculated from all responses in session)
  const [sessionSuccessRate, setSessionSuccessRate] = useState<number | null>(null)
  const [sessionAttemptCount, setSessionAttemptCount] = useState(0)

  // Load existing session data to calculate cumulative success rate
  useEffect(() => {
    loadSessionData()
  }, [sessionId, assessmentTypeId])

  const loadSessionData = () => {
    try {
      const assessmentType = getAssessmentTypeByType('task_success_rate')
      if (!assessmentType) return

      const responses = getAssessmentResponsesBySession(sessionId)
      const taskSuccessResponses = responses.filter(
        r => r.assessmentTypeId === assessmentTypeId || r.assessmentTypeId === assessmentType.id
      )

      if (taskSuccessResponses.length > 0) {
        const successData: TaskSuccessRateData[] = taskSuccessResponses.map(r => ({
          taskDescription: r.taskDescription,
          successful: r.responses.successful === true,
        }))
        setSessionSuccessRate(calculateSuccessRate(successData))
        setSessionAttemptCount(taskSuccessResponses.length)
      }
    } catch (err) {
      console.error('Failed to load session data:', err)
    }
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

  const validateSuccessCriteria = (value: string): boolean => {
    if (!value.trim()) {
      setSuccessCriteriaError('Success criteria is required.')
      return false
    }
    setSuccessCriteriaError(null)
    return true
  }

  const validateSuccessful = (value: string): boolean => {
    if (!value) {
      setSuccessfulError('Please select whether the task was successful.')
      return false
    }
    setSuccessfulError(null)
    return true
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    // Validate all fields
    const isTaskDescriptionValid = validateTaskDescription(taskDescription)
    const isSuccessCriteriaValid = validateSuccessCriteria(successCriteria)
    const isSuccessfulValid = validateSuccessful(successful)

    if (!isTaskDescriptionValid || !isSuccessCriteriaValid || !isSuccessfulValid) {
      return
    }

    setLoading(true)

    try {
      const isSuccessful = successful === 'yes'
      const successRate = calculateSingleSuccessRate(isSuccessful)

      const response = createAssessmentResponseWithMetrics(
        {
          sessionId,
          assessmentTypeId,
          taskDescription: taskDescription.trim(),
          responses: {
            successful: isSuccessful,
            successCriteria: successCriteria.trim(),
          },
        },
        { successRate }
      )

      if (!response) {
        setError('Failed to save assessment response.')
        return
      }

      // Update session success rate
      loadSessionData()

      setSuccessMessage(
        `Task recorded as ${isSuccessful ? 'successful' : 'unsuccessful'}. ` +
        `Success rate for this task: ${formatPercentage(successRate)}`
      )

      // Reset form for next entry
      setTaskDescription('')
      setSuccessCriteria('')
      setSuccessful('')

      onSave?.(response.id)
    } catch (err) {
      console.error('Failed to save assessment:', err)
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

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

      {/* Session Summary */}
      {sessionAttemptCount > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <HeadingField
            text="Session Summary"
            size="SMALL"
            headingTag="H4"
            marginBelow="STANDARD"
          />
          <div className="text-sm space-y-1">
            <div>
              <strong>Total Attempts:</strong> {sessionAttemptCount}
            </div>
            {sessionSuccessRate !== null && (
              <div>
                <strong>Session Success Rate:</strong> {formatPercentage(sessionSuccessRate)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Form */}
      <CardLayout padding="MORE" showShadow={true}>
        <HeadingField
          text="Task Success Rate Assessment"
          size="MEDIUM"
          headingTag="H2"
          marginBelow="STANDARD"
        />
        
        <p className="text-gray-600 mb-6">
          Record whether the participant successfully completed the task.
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
              placeholder="Describe the task the participant attempted"
              required={true}
            />
            {taskDescriptionError && (
              <p className="mt-1 text-sm text-red-700">{taskDescriptionError}</p>
            )}
          </div>

          {/* Success Criteria */}
          <div className="mb-4">
            <TextField
              label="Success Criteria"
              value={successCriteria}
              onChange={setSuccessCriteria}
              labelPosition="ABOVE"
              marginBelow="NONE"
              placeholder="Define what constitutes successful completion"
              required={true}
            />
            {successCriteriaError && (
              <p className="mt-1 text-sm text-red-700">{successCriteriaError}</p>
            )}
          </div>

          {/* Success/Failure Selection */}
          <div className="mb-6">
            <RadioButtonField
              label="Was the task completed successfully?"
              choiceLabels={['Yes - Task completed successfully', 'No - Task was not completed successfully']}
              choiceValues={['yes', 'no']}
              value={successful}
              onChange={setSuccessful}
              labelPosition="ABOVE"
              marginBelow="NONE"
              choiceLayout="STACKED"
            />
            {successfulError && (
              <p className="mt-1 text-sm text-red-700">{successfulError}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <ButtonWidget
              label={loading ? 'Saving...' : 'Record Task Attempt'}
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
