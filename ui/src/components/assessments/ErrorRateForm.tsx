import { useState } from 'react'
import {
  HeadingField,
  CardLayout,
  TextField,
  DropdownField,
  ButtonWidget,
  MessageBanner,
} from '@pglevy/sailwind'
import { 
  createAssessmentResponseWithMetrics,
} from '../../services/assessmentResponseService'
import { 
  calculateErrorRateFromCounts, 
  formatPercentage,
  getErrorBreakdown,
  type ErrorDetail,
} from '../../utils/calculations'

/**
 * ErrorRateForm Component
 * 
 * Form for capturing error rate data with error categorization.
 * Displays calculated error rate and breakdown by type.
 * 
 * **Validates: Requirements 7.1, 7.3, 7.5**
 * - 7.1: Record the number of errors and number of opportunities for errors
 * - 7.3: Allow categorization of error types
 * - 7.5: Display the calculated error rate and error breakdown
 */

interface ErrorRateFormProps {
  /** The session ID this assessment belongs to */
  sessionId: string
  /** The assessment type ID for error rate */
  assessmentTypeId: string
  /** Callback when assessment is saved successfully */
  onSave?: (responseId: string) => void
  /** Callback when form is cancelled */
  onCancel?: () => void
}

const ERROR_TYPES: { value: ErrorDetail['type']; label: string }[] = [
  { value: 'wrong_click', label: 'Wrong Click' },
  { value: 'invalid_submission', label: 'Invalid Submission' },
  { value: 'navigation_error', label: 'Navigation Error' },
]

export default function ErrorRateForm({
  sessionId,
  assessmentTypeId,
  onSave,
  onCancel,
}: ErrorRateFormProps) {
  // Form state
  const [taskDescription, setTaskDescription] = useState('')
  const [opportunities, setOpportunities] = useState('')
  const [errors, setErrors] = useState<ErrorDetail[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // New error input state
  const [newErrorType, setNewErrorType] = useState<string>('')
  const [newErrorDescription, setNewErrorDescription] = useState('')
  
  // Validation errors
  const [taskDescriptionError, setTaskDescriptionError] = useState<string | null>(null)
  const [opportunitiesError, setOpportunitiesError] = useState<string | null>(null)

  // Calculate live error rate preview
  const getErrorRatePreview = (): number | null => {
    const opps = parseInt(opportunities)
    
    if (isNaN(opps) || opps <= 0) {
      return null
    }
    
    return calculateErrorRateFromCounts(errors.length, opps)
  }

  // Add a new error
  const handleAddError = () => {
    if (!newErrorType) {
      return
    }
    
    const newError: ErrorDetail = {
      type: newErrorType as ErrorDetail['type'],
      description: newErrorDescription.trim() || `${ERROR_TYPES.find(t => t.value === newErrorType)?.label} error`,
    }
    
    setErrors([...errors, newError])
    setNewErrorType('')
    setNewErrorDescription('')
  }

  // Remove an error
  const handleRemoveError = (index: number) => {
    setErrors(errors.filter((_, i) => i !== index))
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

  const validateOpportunities = (value: string): boolean => {
    const num = parseInt(value)
    if (isNaN(num) || num < 1) {
      setOpportunitiesError('Opportunities must be at least 1.')
      return false
    }
    setOpportunitiesError(null)
    return true
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    // Validate all fields
    const isTaskDescriptionValid = validateTaskDescription(taskDescription)
    const isOpportunitiesValid = validateOpportunities(opportunities)

    if (!isTaskDescriptionValid || !isOpportunitiesValid) {
      return
    }

    setLoading(true)

    try {
      const opps = parseInt(opportunities)
      const errorRate = calculateErrorRateFromCounts(errors.length, opps)
      const breakdown = getErrorBreakdown(errors)

      const response = createAssessmentResponseWithMetrics(
        {
          sessionId,
          assessmentTypeId,
          taskDescription: taskDescription.trim(),
          responses: {
            errorCount: errors.length,
            opportunities: opps,
            errors: errors,
            errorBreakdown: breakdown,
          },
        },
        { 
          errorRate,
          errorCount: errors.length,
          opportunities: opps,
        }
      )

      if (!response) {
        setError('Failed to save assessment response.')
        return
      }

      setSuccessMessage(
        `Error rate recorded: ${formatPercentage(errorRate)} ` +
        `(${errors.length} errors / ${opps} opportunities)`
      )

      // Reset form for next entry
      setTaskDescription('')
      setOpportunities('')
      setErrors([])

      onSave?.(response.id)
    } catch (err) {
      console.error('Failed to save assessment:', err)
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const errorRatePreview = getErrorRatePreview()
  const breakdown = getErrorBreakdown(errors)

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
          text="Error Rate Assessment"
          size="MEDIUM"
          headingTag="H2"
          marginBelow="STANDARD"
        />
        
        <p className="text-gray-600 mb-6">
          Track errors made during task completion to identify usability problems.
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
              placeholder="Describe the task being evaluated"
              required={true}
            />
            {taskDescriptionError && (
              <p className="mt-1 text-sm text-red-700">{taskDescriptionError}</p>
            )}
          </div>

          {/* Opportunities */}
          <div className="mb-4">
            <TextField
              label="Number of Opportunities for Errors"
              value={opportunities}
              onChange={setOpportunities}
              labelPosition="ABOVE"
              marginBelow="NONE"
              placeholder="e.g., 10"
              instructions="Total number of points where an error could occur"
            />
            {opportunitiesError && (
              <p className="mt-1 text-sm text-red-700">{opportunitiesError}</p>
            )}
          </div>

          {/* Error List */}
          <div className="mb-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <HeadingField
                text={`Errors Recorded (${errors.length})`}
                size="SMALL"
                headingTag="H4"
                marginBelow="STANDARD"
              />
              
              {/* Add Error Form */}
              <div className="mb-4 p-3 bg-white rounded-md border border-gray-200">
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <DropdownField
                      label="Error Type"
                      choiceLabels={['Select type...', ...ERROR_TYPES.map(t => t.label)]}
                      choiceValues={['', ...ERROR_TYPES.map(t => t.value)]}
                      value={newErrorType}
                      onChange={setNewErrorType}
                      labelPosition="ABOVE"
                      marginBelow="NONE"
                    />
                  </div>
                  <div className="flex-1">
                    <TextField
                      label="Description (optional)"
                      value={newErrorDescription}
                      onChange={setNewErrorDescription}
                      labelPosition="ABOVE"
                      marginBelow="NONE"
                      placeholder="Describe the error"
                    />
                  </div>
                  <div>
                    <ButtonWidget
                      label="Add Error"
                      style="SOLID"
                      color="ACCENT"
                      onClick={handleAddError}
                    />
                  </div>
                </div>
              </div>

              {/* Error List */}
              {errors.length === 0 ? (
                <p className="text-sm text-gray-500 italic">
                  No errors recorded yet. Add errors using the form above.
                </p>
              ) : (
                <div className="space-y-2">
                  {errors.map((err, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
                    >
                      <div>
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800 mr-2">
                          {ERROR_TYPES.find(t => t.value === err.type)?.label || err.type}
                        </span>
                        <span className="text-sm text-gray-600">{err.description}</span>
                      </div>
                      <ButtonWidget
                        label="Remove"
                        style="LINK"
                        color="NEGATIVE"
                        onClick={() => handleRemoveError(index)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Error Breakdown */}
              {errors.length > 0 && (
                <div className="mt-4 p-3 bg-white rounded-md border border-gray-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">Error Breakdown</div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-bold text-red-600">{breakdown.wrong_click}</div>
                      <div className="text-xs text-gray-500">Wrong Clicks</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-bold text-red-600">{breakdown.invalid_submission}</div>
                      <div className="text-xs text-gray-500">Invalid Submissions</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-bold text-red-600">{breakdown.navigation_error}</div>
                      <div className="text-xs text-gray-500">Navigation Errors</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Rate Preview */}
              {errorRatePreview !== null && (
                <div className="mt-4 p-3 bg-white rounded-md border border-gray-200">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Calculated Error Rate</div>
                    <div className={`text-2xl font-bold ${
                      errorRatePreview === 0 ? 'text-green-600' :
                      errorRatePreview <= 10 ? 'text-blue-600' :
                      errorRatePreview <= 25 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {formatPercentage(errorRatePreview)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {errorRatePreview === 0 
                        ? 'No errors - excellent!'
                        : errorRatePreview <= 10
                        ? 'Low error rate - good usability'
                        : errorRatePreview <= 25
                        ? 'Moderate error rate - some issues to address'
                        : 'High error rate - significant usability problems'
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
              label={loading ? 'Saving...' : 'Record Error Rate'}
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
