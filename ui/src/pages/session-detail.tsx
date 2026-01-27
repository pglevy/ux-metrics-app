import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  HeadingField,
  CardLayout,
  ButtonWidget,
  RichTextDisplayField,
  MessageBanner,
} from '@pglevy/sailwind'
import type { Session, Person, Study, AssessmentResponse, AssessmentType } from '../../../api/types'
import { getSessionById, completeSession } from '../services/sessionService'
import { getPersonById } from '../services/personService'
import { getStudyById } from '../services/studyService'
import { getAssessmentResponsesBySession } from '../services/assessmentResponseService'
import { getAllAssessmentTypes, getAssessmentTypeById } from '../services/assessmentTypeService'
import AssessmentSelector from '../components/AssessmentSelector'
import TaskSuccessRateForm from '../components/assessments/TaskSuccessRateForm'
import TimeOnTaskForm from '../components/assessments/TimeOnTaskForm'
import TaskEfficiencyForm from '../components/assessments/TaskEfficiencyForm'
import ErrorRateForm from '../components/assessments/ErrorRateForm'
import SEQForm from '../components/assessments/SEQForm'

/**
 * Session Detail Page
 *
 * Displays session information and allows administering assessments.
 * Lists completed assessments for the session.
 *
 * **Validates: Requirements 9.1** - Allow multiple assessments to be administered
 */

export default function SessionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  // State
  const [session, setSession] = useState<Session | null>(null)
  const [study, setStudy] = useState<Study | null>(null)
  const [participant, setParticipant] = useState<Person | null>(null)
  const [facilitator, setFacilitator] = useState<Person | null>(null)
  const [observers, setObservers] = useState<Person[]>([])
  const [assessmentResponses, setAssessmentResponses] = useState<AssessmentResponse[]>([])
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Selected assessment type for administering
  const [selectedAssessmentTypeId, setSelectedAssessmentTypeId] = useState<string | null>(null)

  // Load session data on mount
  useEffect(() => {
    if (id) {
      loadSessionData()
    }
  }, [id])

  const loadSessionData = () => {
    setLoading(true)
    setError(null)
    
    try {
      // Load session
      const sessionData = getSessionById(id!)
      if (!sessionData) {
        setError('Session not found.')
        setLoading(false)
        return
      }
      setSession(sessionData)

      // Load study
      const studyData = getStudyById(sessionData.studyId)
      setStudy(studyData || null)

      // Load participant
      const participantData = getPersonById(sessionData.participantId)
      setParticipant(participantData || null)

      // Load facilitator
      const facilitatorData = getPersonById(sessionData.facilitatorId)
      setFacilitator(facilitatorData || null)

      // Load observers
      const observerData = sessionData.observerIds
        .map(obsId => getPersonById(obsId))
        .filter((p): p is Person => p !== undefined)
      setObservers(observerData)

      // Load assessment responses
      const responses = getAssessmentResponsesBySession(id!)
      setAssessmentResponses(responses)

      // Load assessment types
      const types = getAllAssessmentTypes()
      setAssessmentTypes(types)
    } catch (err) {
      console.error('Failed to load session data:', err)
      setError('Failed to load session data.')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteSession = () => {
    if (!session) return
    
    const result = completeSession(session.id)
    if (result.success) {
      setSuccessMessage('Session marked as completed.')
      loadSessionData()
    } else {
      setError(result.error || 'Failed to complete session.')
    }
  }

  const handleAssessmentSaved = () => {
    // Reload assessment responses after saving
    if (id) {
      const responses = getAssessmentResponsesBySession(id)
      setAssessmentResponses(responses)
    }
    setSuccessMessage('Assessment saved successfully.')
    // Clear the selected assessment type to show the selector again
    setSelectedAssessmentTypeId(null)
  }

  const handleCancelAssessment = () => {
    setSelectedAssessmentTypeId(null)
  }

  const getAssessmentTypeName = (assessmentTypeId: string): string => {
    const type = getAssessmentTypeById(assessmentTypeId)
    return type?.name || 'Unknown Assessment'
  }

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return (
        <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
          Completed
        </span>
      )
    }
    return (
      <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">
        In Progress
      </span>
    )
  }

  const renderAssessmentForm = () => {
    if (!selectedAssessmentTypeId || !session) return null

    const assessmentType = getAssessmentTypeById(selectedAssessmentTypeId)
    if (!assessmentType) return null

    const commonProps = {
      sessionId: session.id,
      assessmentTypeId: selectedAssessmentTypeId,
      onSave: handleAssessmentSaved,
      onCancel: handleCancelAssessment,
    }

    switch (assessmentType.type) {
      case 'task_success_rate':
        return <TaskSuccessRateForm {...commonProps} />
      case 'time_on_task':
        return <TimeOnTaskForm {...commonProps} />
      case 'task_efficiency':
        return <TaskEfficiencyForm {...commonProps} />
      case 'error_rate':
        return <ErrorRateForm {...commonProps} />
      case 'seq':
        return <SEQForm {...commonProps} />
      default:
        return (
          <CardLayout padding="MORE" showShadow={true}>
            <RichTextDisplayField value={['Unknown assessment type.']} />
          </CardLayout>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50">
        <div className="container mx-auto px-8 py-8">
          <CardLayout padding="MORE" showShadow={true}>
            <RichTextDisplayField value={['Loading session...']} />
          </CardLayout>
        </div>
      </div>
    )
  }

  if (error && !session) {
    return (
      <div className="min-h-screen bg-blue-50">
        <div className="container mx-auto px-8 py-8">
          <MessageBanner
            primaryText={error}
            backgroundColor="NEGATIVE"
            icon="error"
          />
          <div className="mt-4">
            <ButtonWidget
              label="← Back to Studies"
              style="OUTLINE"
              color="NEUTRAL"
              onClick={() => navigate('/studies')}
            />
          </div>
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
            text="Session Detail"
            size="LARGE"
            headingTag="H1"
            marginBelow="NONE"
          />
          <div className="flex gap-2">
            {study && (
              <ButtonWidget
                label="← Back to Study"
                style="OUTLINE"
                color="NEUTRAL"
                onClick={() => navigate(`/studies/${study.id}`)}
              />
            )}
            <ButtonWidget
              label="← Back to Studies"
              style="OUTLINE"
              color="NEUTRAL"
              onClick={() => navigate('/studies')}
            />
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6">
            <MessageBanner
              primaryText={error}
              backgroundColor="NEGATIVE"
              icon="error"
            />
          </div>
        )}
        {successMessage && (
          <div className="mb-6">
            <MessageBanner
              primaryText={successMessage}
              backgroundColor="POSITIVE"
              icon="success"
            />
          </div>
        )}

        {/* Session Info Card */}
        {session && (
          <CardLayout padding="MORE" showShadow={true}>
            <div className="flex items-center justify-between mb-4">
              <HeadingField
                text="Session Information"
                size="MEDIUM"
                headingTag="H2"
                marginBelow="NONE"
              />
              {getStatusBadge(session.status)}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Study:</strong> {study?.name || session.studyId}
              </div>
              <div>
                <strong>Participant:</strong> {participant?.name || session.participantId}
              </div>
              <div>
                <strong>Facilitator:</strong> {facilitator?.name || session.facilitatorId}
              </div>
              <div>
                <strong>Observers:</strong>{' '}
                {observers.length > 0
                  ? observers.map(o => o.name).join(', ')
                  : 'None'}
              </div>
              <div>
                <strong>Created:</strong>{' '}
                {new Date(session.createdAt).toLocaleString()}
              </div>
              {session.completedAt && (
                <div>
                  <strong>Completed:</strong>{' '}
                  {new Date(session.completedAt).toLocaleString()}
                </div>
              )}
            </div>

            {/* Complete Session Button */}
            {session.status === 'in_progress' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <ButtonWidget
                  label="Mark Session as Complete"
                  style="SOLID"
                  color="POSITIVE"
                  onClick={handleCompleteSession}
                />
              </div>
            )}
          </CardLayout>
        )}

        {/* Assessment Administration Section */}
        {session && session.status === 'in_progress' && (
          <div className="mt-6">
            <CardLayout padding="MORE" showShadow={true}>
              <HeadingField
                text="Administer Assessment"
                size="MEDIUM"
                headingTag="H2"
                marginBelow="STANDARD"
              />
              
              {selectedAssessmentTypeId ? (
                renderAssessmentForm()
              ) : (
                <AssessmentSelector
                  assessmentTypes={assessmentTypes}
                  onSelect={setSelectedAssessmentTypeId}
                />
              )}
            </CardLayout>
          </div>
        )}

        {/* Completed Assessments List */}
        <div className="mt-6">
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField
              text="Completed Assessments"
              size="MEDIUM"
              headingTag="H2"
              marginBelow="STANDARD"
            />
            
            {assessmentResponses.length === 0 ? (
              <RichTextDisplayField
                value={['No assessments recorded yet. Select an assessment type above to begin.']}
              />
            ) : (
              <div className="space-y-3">
                {assessmentResponses.map((response) => (
                  <div
                    key={response.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">
                        {getAssessmentTypeName(response.assessmentTypeId)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(response.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Task:</strong> {response.taskDescription}
                    </div>
                    {Object.keys(response.calculatedMetrics).length > 0 && (
                      <div className="mt-2 text-sm">
                        <strong>Metrics:</strong>{' '}
                        {Object.entries(response.calculatedMetrics)
                          .map(([key, value]) => `${key}: ${typeof value === 'number' ? value.toFixed(1) : value}`)
                          .join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardLayout>
        </div>
      </div>
    </div>
  )
}
