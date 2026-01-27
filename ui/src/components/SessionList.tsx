import { useState, useEffect } from 'react'
import {
  HeadingField,
  CardLayout,
  ButtonWidget,
  RichTextDisplayField,
} from '@pglevy/sailwind'
import type { Session } from '../../../api/types'
import { getSessionsByStudy, deleteSession, filterSessions, completeSession, type SessionFilters } from '../services/sessionService'
import { getPersonById } from '../services/personService'

/**
 * SessionList Component
 *
 * Displays sessions within a study using Sailwind CardLayout.
 * Shows participant, facilitator, status, and date for each session.
 * Includes empty state message when no sessions exist.
 * Supports filtering by participant, facilitator, and date range.
 *
 * **Validates: Requirements 2.4, 2.5, 9.5** - View list of sessions within a study, filter sessions, complete sessions
 */

interface SessionListProps {
  /** The study ID to display sessions for (required) */
  studyId: string
  /** Optional callback when a session is clicked */
  onSessionClick?: (sessionId: string) => void
  /** Optional filters to apply to the session list */
  filters?: SessionFilters
}

interface SessionWithPeople extends Session {
  participantName: string
  facilitatorName: string
}

export default function SessionList({ studyId, onSessionClick, filters }: SessionListProps) {
  const [sessions, setSessions] = useState<SessionWithPeople[]>([])
  const [loading, setLoading] = useState(true)

  // Load sessions on component mount or when studyId/filters change
  useEffect(() => {
    loadSessions()
  }, [studyId, filters?.participantId, filters?.facilitatorId, filters?.dateFrom, filters?.dateTo])

  const loadSessions = async () => {
    setLoading(true)
    try {
      // Use filterSessions if filters are provided, otherwise get all sessions for study
      const studySessions = filters
        ? filterSessions({ ...filters, studyId })
        : getSessionsByStudy(studyId)
      
      // Enrich sessions with participant and facilitator names
      const enrichedSessions: SessionWithPeople[] = studySessions.map((session) => {
        const participant = getPersonById(session.participantId)
        const facilitator = getPersonById(session.facilitatorId)
        
        return {
          ...session,
          participantName: participant?.name || 'Unknown Participant',
          facilitatorName: facilitator?.name || 'Unknown Facilitator',
        }
      })
      
      // Sort by creation date, newest first
      enrichedSessions.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      
      setSessions(enrichedSessions)
    } catch (error) {
      console.error('Failed to load sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: string, event: React.MouseEvent) => {
    // Prevent triggering onSessionClick when deleting
    event.stopPropagation()
    
    const result = deleteSession(id)
    if (result.success) {
      // Reload the list after successful deletion
      loadSessions()
    } else {
      console.error('Failed to delete session:', result.error)
      alert(result.error || 'Failed to delete session')
    }
  }

  const handleComplete = (id: string, event: React.MouseEvent) => {
    // Prevent triggering onSessionClick when completing
    event.stopPropagation()
    
    const result = completeSession(id)
    if (result.success) {
      // Reload the list after successful completion
      loadSessions()
    } else {
      console.error('Failed to complete session:', result.error)
      alert(result.error || 'Failed to complete session')
    }
  }

  const handleView = (id: string) => {
    if (onSessionClick) {
      onSessionClick(id)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress'
      case 'completed':
        return 'Completed'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <CardLayout padding="MORE" showShadow={true}>
        <RichTextDisplayField value={['Loading sessions...']} />
      </CardLayout>
    )
  }

  if (sessions.length === 0) {
    return (
      <CardLayout padding="MORE" showShadow={true}>
        <RichTextDisplayField
          value={[
            'No sessions in this study. Create a session to begin capturing participant data.',
          ]}
        />
      </CardLayout>
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <CardLayout key={session.id} padding="MORE" showShadow={true}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Session Header with Status Badge */}
              <div className="flex items-center gap-3 mb-2">
                <HeadingField
                  text={`Session: ${session.id.slice(-8)}`}
                  size="MEDIUM"
                  headingTag="H3"
                  marginBelow="NONE"
                />
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeColor(session.status)}`}
                >
                  {formatStatus(session.status)}
                </span>
              </div>
              
              {/* Session Details */}
              <div className="text-sm text-gray-600 space-y-1">
                <div>
                  <strong>Participant:</strong> {session.participantName}
                </div>
                <div>
                  <strong>Facilitator:</strong> {session.facilitatorName}
                </div>
                <div>
                  <strong>Created:</strong> {formatDate(session.createdAt)}
                </div>
                {session.completedAt && (
                  <div>
                    <strong>Completed:</strong> {formatDate(session.completedAt)}
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <ButtonWidget
                label="View"
                style="OUTLINE"
                color="NEUTRAL"
                onClick={() => handleView(session.id)}
              />
              {session.status === 'in_progress' && (
                <ButtonWidget
                  label="Complete"
                  style="SOLID"
                  color="ACCENT"
                  onClick={(e) => handleComplete(session.id, e as React.MouseEvent)}
                />
              )}
              <ButtonWidget
                label="Delete"
                style="OUTLINE"
                color="NEGATIVE"
                onClick={(e) => handleDelete(session.id, e as React.MouseEvent)}
              />
            </div>
          </div>
        </CardLayout>
      ))}
    </div>
  )
}
