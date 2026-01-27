import { useState, useEffect } from 'react'
import {
  HeadingField,
  CardLayout,
  DropdownField,
  ButtonWidget,
  MessageBanner,
  CheckboxField,
} from '@pglevy/sailwind'
import type { Person } from '../../../api/types'
import { createSession, getSessionById, updateSession } from '../services/sessionService'
import { getByRole, getPersonById } from '../services/personService'

/**
 * SessionForm Component
 *
 * Reusable form for creating and editing sessions.
 * Uses Sailwind DropdownField for participant and facilitator selection.
 * Uses checkboxes for multi-select observers.
 *
 * **Validates: Requirements 2.1, 2.2, 2.6**
 * - 2.1: Create a session with participant and facilitator
 * - 2.2: Optionally add observers to a session
 * - 2.6: Select participant and facilitator from people list
 */

interface SessionFormProps {
  /** The study ID this session belongs to (required) */
  studyId: string
  /** Optional session ID for edit mode */
  sessionId?: string
  /** Callback when session is saved successfully */
  onSave?: (sessionId: string) => void
  /** Callback when form is cancelled */
  onCancel?: () => void
}

export default function SessionForm({
  studyId,
  sessionId,
  onSave,
  onCancel,
}: SessionFormProps) {
  const isEditMode = Boolean(sessionId)

  // Form state
  const [participantId, setParticipantId] = useState('')
  const [facilitatorId, setFacilitatorId] = useState('')
  const [selectedObserverIds, setSelectedObserverIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [participantError, setParticipantError] = useState<string | null>(null)
  const [facilitatorError, setFacilitatorError] = useState<string | null>(null)

  // People lists for dropdowns
  const [participants, setParticipants] = useState<Person[]>([])
  const [facilitators, setFacilitators] = useState<Person[]>([])
  const [observers, setObservers] = useState<Person[]>([])

  // Load people lists on mount
  useEffect(() => {
    loadPeopleLists()
  }, [])

  // Load existing session data in edit mode
  useEffect(() => {
    if (isEditMode && sessionId) {
      loadSessionData(sessionId)
    }
  }, [sessionId, isEditMode])

  const loadPeopleLists = () => {
    try {
      setParticipants(getByRole('participant'))
      setFacilitators(getByRole('facilitator'))
      setObservers(getByRole('observer'))
    } catch (err) {
      console.error('Failed to load people lists:', err)
      setError('Failed to load people lists.')
    }
  }

  const loadSessionData = (id: string) => {
    setLoading(true)
    try {
      const session = getSessionById(id)
      if (session) {
        setParticipantId(session.participantId)
        setFacilitatorId(session.facilitatorId)
        setSelectedObserverIds(session.observerIds || [])
      } else {
        setError(`Session with ID "${id}" not found.`)
      }
    } catch (err) {
      console.error('Failed to load session:', err)
      setError('Failed to load session data.')
    } finally {
      setLoading(false)
    }
  }

  // Validate participant selection
  const validateParticipant = (value: string): boolean => {
    if (!value) {
      setParticipantError('Participant is required.')
      return false
    }
    setParticipantError(null)
    return true
  }

  // Validate facilitator selection
  const validateFacilitator = (value: string): boolean => {
    if (!value) {
      setFacilitatorError('Facilitator is required.')
      return false
    }
    setFacilitatorError(null)
    return true
  }

  // Handle participant change
  const handleParticipantChange = (value: string) => {
    setParticipantId(value)
    if (participantError && value) {
      setParticipantError(null)
    }
  }

  // Handle facilitator change
  const handleFacilitatorChange = (value: string) => {
    setFacilitatorId(value)
    if (facilitatorError && value) {
      setFacilitatorError(null)
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate required fields
    const isParticipantValid = validateParticipant(participantId)
    const isFacilitatorValid = validateFacilitator(facilitatorId)

    if (!isParticipantValid || !isFacilitatorValid) {
      return
    }

    try {
      if (isEditMode && sessionId) {
        // Update existing session
        const result = updateSession(sessionId, {
          participantId,
          facilitatorId,
          observerIds: selectedObserverIds,
        })
        if (!result.success) {
          setError(result.error || 'Failed to update session.')
          return
        }
        onSave?.(sessionId)
      } else {
        // Create new session
        const session = createSession(
          studyId,
          participantId,
          facilitatorId,
          selectedObserverIds
        )
        if (!session) {
          setError('Failed to create session.')
          return
        }
        onSave?.(session.id)
      }
    } catch (err) {
      console.error('Failed to save session:', err)
      setError('An unexpected error occurred.')
    }
  }

  // Handle cancel
  const handleCancel = () => {
    onCancel?.()
  }

  // Prepare dropdown options
  const participantLabels = participants.map((p) => p.name)
  const participantValues = participants.map((p) => p.id)
  const facilitatorLabels = facilitators.map((f) => f.name)
  const facilitatorValues = facilitators.map((f) => f.id)

  // Get person name by ID for display
  const getPersonName = (id: string): string => {
    const person = getPersonById(id)
    return person?.name || 'Unknown'
  }

  if (loading) {
    return (
      <CardLayout padding="MORE" showShadow={true}>
        <p>Loading...</p>
      </CardLayout>
    )
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

      {/* Form */}
      <CardLayout padding="MORE" showShadow={true}>
        <HeadingField
          text={isEditMode ? 'Edit Session' : 'Create Session'}
          size="MEDIUM"
          headingTag="H2"
          marginBelow="MORE"
        />

        <form onSubmit={handleSubmit}>
          {/* Participant Dropdown */}
          <div className="mb-4">
            {participants.length === 0 ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Participant <span className="text-red-500">*</span>
                </label>
                <MessageBanner
                  primaryText="No participants available. Please add participants in the People section first."
                  backgroundColor="WARNING"
                  icon="warning"
                />
              </div>
            ) : (
              <>
                <DropdownField
                  label="Participant"
                  choiceLabels={['Select a participant...', ...participantLabels]}
                  choiceValues={['', ...participantValues]}
                  value={participantId}
                  onChange={handleParticipantChange}
                  labelPosition="ABOVE"
                  marginBelow="NONE"
                  instructions="Select the participant for this session"
                />
                {participantError && (
                  <p className="mt-1 text-sm text-red-700">{participantError}</p>
                )}
              </>
            )}
          </div>

          {/* Facilitator Dropdown */}
          <div className="mb-4">
            {facilitators.length === 0 ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facilitator <span className="text-red-500">*</span>
                </label>
                <MessageBanner
                  primaryText="No facilitators available. Please add facilitators in the People section first."
                  backgroundColor="WARNING"
                  icon="warning"
                />
              </div>
            ) : (
              <>
                <DropdownField
                  label="Facilitator"
                  choiceLabels={['Select a facilitator...', ...facilitatorLabels]}
                  choiceValues={['', ...facilitatorValues]}
                  value={facilitatorId}
                  onChange={handleFacilitatorChange}
                  labelPosition="ABOVE"
                  marginBelow="NONE"
                  instructions="Select the facilitator conducting this session"
                />
                {facilitatorError && (
                  <p className="mt-1 text-sm text-red-700">{facilitatorError}</p>
                )}
              </>
            )}
          </div>

          {/* Observers Multi-Select (Checkboxes) */}
          <div className="mb-6">
            {observers.length === 0 ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observers (Optional)
                </label>
                <p className="text-sm text-gray-500 italic">
                  No observers available. You can add observers in the People section.
                </p>
              </div>
            ) : (
              <CheckboxField
                label="Observers (Optional)"
                choiceLabels={observers.map((o) => o.name)}
                choiceValues={observers.map((o) => o.id)}
                value={selectedObserverIds}
                onChange={(values) => setSelectedObserverIds(values || [])}
                labelPosition="ABOVE"
                marginBelow="NONE"
                instructions="Select team members who will observe this session"
                choiceLayout="STACKED"
              />
            )}
          </div>

          {/* Selected Summary */}
          {(participantId || facilitatorId || selectedObserverIds.length > 0) && (
            <div className="mb-6 p-3 bg-blue-50 rounded-md">
              <HeadingField
                text="Session Summary"
                size="SMALL"
                headingTag="H4"
                marginBelow="STANDARD"
              />
              <div className="text-sm space-y-1">
                {participantId && (
                  <div>
                    <strong>Participant:</strong> {getPersonName(participantId)}
                  </div>
                )}
                {facilitatorId && (
                  <div>
                    <strong>Facilitator:</strong> {getPersonName(facilitatorId)}
                  </div>
                )}
                {selectedObserverIds.length > 0 && (
                  <div>
                    <strong>Observers:</strong>{' '}
                    {selectedObserverIds.map((id) => getPersonName(id)).join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <ButtonWidget
              label={isEditMode ? 'Save Changes' : 'Create Session'}
              style="SOLID"
              color="ACCENT"
              submit={true}
            />
            {onCancel && (
              <ButtonWidget
                label="Cancel"
                style="OUTLINE"
                color="NEUTRAL"
                onClick={handleCancel}
              />
            )}
          </div>
        </form>
      </CardLayout>
    </div>
  )
}
