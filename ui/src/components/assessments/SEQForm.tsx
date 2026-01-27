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
  hasSEQRatingForTask,
} from '../../services/assessmentResponseService'
import { 
  validateSEQRating, 
  getSEQRatingLabel,
} from '../../utils/calculations'

/**
 * SEQForm Component
 * 
 * Form for capturing Single Ease Question (SEQ) ratings.
 * Validates rating range and prevents duplicate ratings for same task/session.
 * 
 * **Validates: Requirements 8.1, 8.2, 8.4, 8.5**
 * - 8.1: Present a 1-7 rating scale
 * - 8.2: Require a rating value between 1 and 7
 * - 8.4: Display the rating immediately after capture
 * - 8.5: Allow one SEQ rating per task per session
 */

interface SEQFormProps {
  /** The session ID this assessment belongs to */
  sessionId: string
  /** The assessment type ID for SEQ */
  assessmentTypeId: string
  /** Callback when assessment is saved successfully */
  onSave?: (responseId: string) => void
  /** Callback when form is cancelled */
  onCancel?: () => void
}

const SEQ_RATINGS = [
  { value: '1', label: '1 - Very Difficult' },
  { value: '2', label: '2 - Difficult' },
  { value: '3', label: '3 - Somewhat Difficult' },
  { value: '4', label: '4 - Neutral' },
  { value: '5', label: '5 - Somewhat Easy' },
  { value: '6', label: '6 - Easy' },
  { value: '7', label: '7 - Very Easy' },
]

export default function SEQForm({
  sessionId,
  assessmentTypeId,
  onSave,
  onCancel,
}: SEQFormProps) {
  // Form state
  const [taskDescription, setTaskDescription] = useState('')
  const [rating, setRating] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Validation errors
  const [taskDescriptionError, setTaskDescriptionError] = useState<string | null>(null)
  const [ratingError, setRatingError] = useState<string | null>(null)
  
  // Duplicate check state
  const [isDuplicate, setIsDuplicate] = useState(false)

  // Check for duplicate when task description changes
  useEffect(() => {
    if (taskDescription.trim()) {
      const exists = hasSEQRatingForTask(sessionId, taskDescription.trim(), assessmentTypeId)
      setIsDuplicate(exists)
    } else {
      setIsDuplicate(false)
    }
  }, [taskDescription, sessionId, assessmentTypeId])

  // Validation functions
  const validateTaskDescription = (value: string): boolean => {
    if (!value.trim()) {
      setTaskDescriptionError('Task description is required.')
      return false
    }
    
    // Check for duplicate
    if (hasSEQRatingForTask(sessionId, value.trim(), assessmentTypeId)) {
      setTaskDescriptionError('An SEQ rating already exists for this task in this session.')
      return false
    }
    
    setTaskDescriptionError(null)
    return true
  }

  const validateRatingValue = (value: string): boolean => {
    if (!value) {
      setRatingError('Please select a rating.')
      return false
    }
    
    const numValue = parseInt(value)
    if (!validateSEQRating(numValue)) {
      setRatingError('Rating must be between 1 and 7.')
      return false
    }
    
    setRatingError(null)
    return true
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    // Validate all fields
    const isTaskDescriptionValid = validateTaskDescription(taskDescription)
    const isRatingValid = validateRatingValue(rating)

    if (!isTaskDescriptionValid || !isRatingValid) {
      return
    }

    setLoading(true)

    try {
      const ratingValue = parseInt(rating)

      const response = createAssessmentResponseWithMetrics(
        {
          sessionId,
          assessmentTypeId,
          taskDescription: taskDescription.trim(),
          responses: {
            rating: ratingValue,
            ratingLabel: getSEQRatingLabel(ratingValue),
          },
        },
        { seqRating: ratingValue }
      )

      if (!response) {
        setError('Failed to save assessment response.')
        return
      }

      setSuccessMessage(
        `SEQ rating recorded: ${ratingValue} - ${getSEQRatingLabel(ratingValue)}`
      )

      // Reset form for next entry
      setTaskDescription('')
      setRating('')

      onSave?.(response.id)
    } catch (err) {
      console.error('Failed to save assessment:', err)
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  // Get color class based on rating
  const getRatingColorClass = (value: number): string => {
    if (value <= 2) return 'text-red-600'
    if (value <= 4) return 'text-yellow-600'
    return 'text-green-600'
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

      {/* Duplicate Warning */}
      {isDuplicate && (
        <div className="mb-6">
          <MessageBanner
            primaryText="An SEQ rating already exists for this task in this session. Please use a different task description."
            backgroundColor="WARNING"
            icon="warning"
          />
        </div>
      )}

      {/* Form */}
      <CardLayout padding="MORE" showShadow={true}>
        <HeadingField
          text="Single Ease Question (SEQ)"
          size="MEDIUM"
          headingTag="H2"
          marginBelow="STANDARD"
        />
        
        <p className="text-gray-600 mb-6">
          Ask the participant to rate how easy or difficult the task was to complete.
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
              placeholder="Describe the task being rated"
              required={true}
            />
            {taskDescriptionError && (
              <p className="mt-1 text-sm text-red-700">{taskDescriptionError}</p>
            )}
          </div>

          {/* Rating Scale */}
          <div className="mb-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <HeadingField
                text="How easy was this task?"
                size="SMALL"
                headingTag="H4"
                marginBelow="STANDARD"
              />
              
              <div className="flex justify-between text-xs text-gray-500 mb-2 px-2">
                <span>Very Difficult</span>
                <span>Very Easy</span>
              </div>
              
              <RadioButtonField
                label="Rating"
                choiceLabels={SEQ_RATINGS.map(r => r.label)}
                choiceValues={SEQ_RATINGS.map(r => r.value)}
                value={rating}
                onChange={setRating}
                labelPosition="ABOVE"
                marginBelow="NONE"
                choiceLayout="STACKED"
              />
              
              {ratingError && (
                <p className="mt-2 text-sm text-red-700">{ratingError}</p>
              )}

              {/* Rating Preview */}
              {rating && (
                <div className="mt-4 p-3 bg-white rounded-md border border-gray-200">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Selected Rating</div>
                    <div className={`text-4xl font-bold ${getRatingColorClass(parseInt(rating))}`}>
                      {rating}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {getSEQRatingLabel(parseInt(rating))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SEQ Scale Reference */}
          <div className="mb-6">
            <details className="text-sm">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                About the SEQ Scale
              </summary>
              <div className="mt-2 p-3 bg-gray-50 rounded-md text-gray-600">
                <p className="mb-2">
                  The Single Ease Question (SEQ) is a 7-point rating scale used to assess 
                  how difficult users find a task. It is administered immediately after 
                  a user attempts a task.
                </p>
                <p className="mb-2">
                  <strong>Interpretation:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>1-2:</strong> Very difficult - significant usability issues</li>
                  <li><strong>3-4:</strong> Moderate difficulty - some improvements needed</li>
                  <li><strong>5-7:</strong> Easy - good usability</li>
                </ul>
                <p className="mt-2">
                  <strong>Benchmark:</strong> An average SEQ score of 5.5 or higher is 
                  generally considered good usability.
                </p>
              </div>
            </details>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <ButtonWidget
              label={loading ? 'Saving...' : 'Record Rating'}
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
