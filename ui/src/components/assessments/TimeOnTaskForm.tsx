import { useState, useEffect, useRef } from 'react'
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
  calculateDuration, 
  formatDuration,
  type TimeOnTaskData,
} from '../../utils/calculations'

/**
 * TimeOnTaskForm Component
 * 
 * Form for capturing time on task data with timer or manual entry.
 * Displays duration in human-readable format.
 * 
 * **Validates: Requirements 5.1, 5.3, 5.5**
 * - 5.1: Record start time and end time for each task
 * - 5.3: Allow manual time entry for retrospective data capture
 * - 5.5: Display duration in human-readable format (minutes and seconds)
 */

interface TimeOnTaskFormProps {
  /** The session ID this assessment belongs to */
  sessionId: string
  /** The assessment type ID for time on task */
  assessmentTypeId: string
  /** Callback when assessment is saved successfully */
  onSave?: (responseId: string) => void
  /** Callback when form is cancelled */
  onCancel?: () => void
}

export default function TimeOnTaskForm({
  sessionId,
  assessmentTypeId,
  onSave,
  onCancel,
}: TimeOnTaskFormProps) {
  // Form state
  const [taskDescription, setTaskDescription] = useState('')
  const [manualMinutes, setManualMinutes] = useState('')
  const [manualSeconds, setManualSeconds] = useState('')
  const [useManualEntry, setUseManualEntry] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [startTime, setStartTime] = useState<string | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const timerRef = useRef<number | null>(null)
  
  // Validation errors
  const [taskDescriptionError, setTaskDescriptionError] = useState<string | null>(null)
  const [durationError, setDurationError] = useState<string | null>(null)

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds(prev => prev + 1)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isTimerRunning])

  // Start timer
  const handleStartTimer = () => {
    setStartTime(new Date().toISOString())
    setElapsedSeconds(0)
    setIsTimerRunning(true)
    setUseManualEntry(false)
    setError(null)
    setSuccessMessage(null)
  }

  // Stop timer
  const handleStopTimer = () => {
    setIsTimerRunning(false)
  }

  // Reset timer
  const handleResetTimer = () => {
    setIsTimerRunning(false)
    setStartTime(null)
    setElapsedSeconds(0)
  }

  // Toggle manual entry mode
  const handleToggleManualEntry = () => {
    if (!useManualEntry) {
      // Switching to manual entry - reset timer
      handleResetTimer()
    }
    setUseManualEntry(!useManualEntry)
    setDurationError(null)
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

  const validateDuration = (): boolean => {
    if (useManualEntry) {
      const minutes = parseInt(manualMinutes) || 0
      const seconds = parseInt(manualSeconds) || 0
      
      if (minutes < 0 || seconds < 0) {
        setDurationError('Duration values cannot be negative.')
        return false
      }
      
      if (minutes === 0 && seconds === 0) {
        setDurationError('Please enter a duration greater than 0.')
        return false
      }
      
      if (seconds >= 60) {
        setDurationError('Seconds must be less than 60.')
        return false
      }
    } else {
      if (elapsedSeconds === 0 && !startTime) {
        setDurationError('Please start and stop the timer, or use manual entry.')
        return false
      }
    }
    
    setDurationError(null)
    return true
  }

  // Calculate total duration in seconds
  const getTotalDurationSeconds = (): number => {
    if (useManualEntry) {
      const minutes = parseInt(manualMinutes) || 0
      const seconds = parseInt(manualSeconds) || 0
      return minutes * 60 + seconds
    }
    return elapsedSeconds
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    // Validate all fields
    const isTaskDescriptionValid = validateTaskDescription(taskDescription)
    const isDurationValid = validateDuration()

    if (!isTaskDescriptionValid || !isDurationValid) {
      return
    }

    setLoading(true)

    try {
      const durationSeconds = getTotalDurationSeconds()
      const endTime = new Date().toISOString()

      const timeOnTaskData: TimeOnTaskData = {
        taskDescription: taskDescription.trim(),
        ...(useManualEntry 
          ? { manualDurationSeconds: durationSeconds }
          : { startTime: startTime!, endTime }
        ),
      }

      const calculatedDuration = calculateDuration(timeOnTaskData)

      const response = createAssessmentResponseWithMetrics(
        {
          sessionId,
          assessmentTypeId,
          taskDescription: taskDescription.trim(),
          responses: {
            startTime: useManualEntry ? null : startTime,
            endTime: useManualEntry ? null : endTime,
            manualDurationSeconds: useManualEntry ? durationSeconds : null,
            durationSeconds: calculatedDuration,
          },
        },
        { durationSeconds: calculatedDuration }
      )

      if (!response) {
        setError('Failed to save assessment response.')
        return
      }

      setSuccessMessage(
        `Time on task recorded: ${formatDuration(calculatedDuration)}`
      )

      // Reset form for next entry
      setTaskDescription('')
      setManualMinutes('')
      setManualSeconds('')
      handleResetTimer()

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

      {/* Form */}
      <CardLayout padding="MORE" showShadow={true}>
        <HeadingField
          text="Time on Task Assessment"
          size="MEDIUM"
          headingTag="H2"
          marginBelow="STANDARD"
        />
        
        <p className="text-gray-600 mb-6">
          Measure how long it takes the participant to complete the task.
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
              placeholder="Describe the task being timed"
              required={true}
            />
            {taskDescriptionError && (
              <p className="mt-1 text-sm text-red-700">{taskDescriptionError}</p>
            )}
          </div>

          {/* Timer Section */}
          {!useManualEntry && (
            <div className="mb-6">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <HeadingField
                  text="Timer"
                  size="SMALL"
                  headingTag="H4"
                  marginBelow="STANDARD"
                />
                
                {/* Timer Display */}
                <div className="text-center mb-4">
                  <div className="text-4xl font-mono font-bold text-gray-800">
                    {formatDuration(elapsedSeconds)}
                  </div>
                  {startTime && (
                    <div className="text-sm text-gray-500 mt-1">
                      Started: {new Date(startTime).toLocaleTimeString()}
                    </div>
                  )}
                </div>

                {/* Timer Controls */}
                <div className="flex gap-2 justify-center">
                  {!isTimerRunning && elapsedSeconds === 0 && (
                    <ButtonWidget
                      label="Start Timer"
                      style="SOLID"
                      color="POSITIVE"
                      onClick={handleStartTimer}
                    />
                  )}
                  {isTimerRunning && (
                    <ButtonWidget
                      label="Stop Timer"
                      style="SOLID"
                      color="NEGATIVE"
                      onClick={handleStopTimer}
                    />
                  )}
                  {!isTimerRunning && elapsedSeconds > 0 && (
                    <>
                      <ButtonWidget
                        label="Resume"
                        style="SOLID"
                        color="POSITIVE"
                        onClick={() => setIsTimerRunning(true)}
                      />
                      <ButtonWidget
                        label="Reset"
                        style="OUTLINE"
                        color="NEUTRAL"
                        onClick={handleResetTimer}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Manual Entry Section */}
          {useManualEntry && (
            <div className="mb-6">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <HeadingField
                  text="Manual Duration Entry"
                  size="SMALL"
                  headingTag="H4"
                  marginBelow="STANDARD"
                />
                
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <TextField
                      label="Minutes"
                      value={manualMinutes}
                      onChange={setManualMinutes}
                      labelPosition="ABOVE"
                      marginBelow="NONE"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex-1">
                    <TextField
                      label="Seconds"
                      value={manualSeconds}
                      onChange={setManualSeconds}
                      labelPosition="ABOVE"
                      marginBelow="NONE"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                {/* Preview */}
                {(manualMinutes || manualSeconds) && (
                  <div className="mt-3 text-center text-gray-600">
                    Duration: {formatDuration(getTotalDurationSeconds())}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Duration Error */}
          {durationError && (
            <div className="mb-4">
              <p className="text-sm text-red-700">{durationError}</p>
            </div>
          )}

          {/* Toggle Manual Entry */}
          <div className="mb-6">
            <ButtonWidget
              label={useManualEntry ? 'Use Timer Instead' : 'Enter Duration Manually'}
              style="LINK"
              color="ACCENT"
              onClick={handleToggleManualEntry}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <ButtonWidget
              label={loading ? 'Saving...' : 'Record Time'}
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
