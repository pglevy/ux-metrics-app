import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  HeadingField,
  CardLayout,
  ButtonWidget,
  RichTextDisplayField,
} from '@pglevy/sailwind'
import type { Study } from '../../../api/types'
import { getStudyById } from '../services/studyService'
import { getSessionsByStudy } from '../services/sessionService'
import SessionList from '../components/SessionList'
import SessionForm from '../components/SessionForm'

/**
 * Study Detail Page
 * 
 * Shows study information and its sessions.
 * Allows creating new sessions and navigating to session details.
 */
export default function StudyDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [study, setStudy] = useState<Study | null>(null)
  const [sessionCount, setSessionCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id])

  const loadData = () => {
    setLoading(true)
    setError(null)
    try {
      const studyData = getStudyById(id!)
      if (!studyData) {
        setError('Study not found')
        setLoading(false)
        return
      }
      setStudy(studyData)
      
      const sessions = getSessionsByStudy(id!)
      setSessionCount(sessions.length)
    } catch (err) {
      console.error('Failed to load study:', err)
      setError('Failed to load study data')
    } finally {
      setLoading(false)
    }
  }

  const handleSessionSaved = () => {
    setShowSessionForm(false)
    loadData()
  }

  const handleViewSession = (sessionId: string) => {
    navigate(`/sessions/${sessionId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50">
        <div className="container mx-auto px-8 py-8">
          <CardLayout padding="MORE" showShadow={true}>
            <RichTextDisplayField value={['Loading study...']} />
          </CardLayout>
        </div>
      </div>
    )
  }

  if (error || !study) {
    return (
      <div className="min-h-screen bg-blue-50">
        <div className="container mx-auto px-8 py-8">
          <CardLayout padding="MORE" showShadow={true}>
            <RichTextDisplayField value={[error || 'Study not found']} />
            <div className="mt-4">
              <ButtonWidget
                label="← Back to Studies"
                style="OUTLINE"
                color="NEUTRAL"
                onClick={() => navigate('/studies')}
              />
            </div>
          </CardLayout>
        </div>
      </div>
    )
  }

  return (
    <div className="with-sidebar min-h-screen page-animate" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <HeadingField
            text={study.name}
            size="LARGE"
            headingTag="H1"
            marginBelow="NONE"
          />
          <div className="flex gap-2">
            <ButtonWidget
              label="← Back to Studies"
              style="OUTLINE"
              color="NEUTRAL"
              onClick={() => navigate('/studies')}
            />
            <ButtonWidget
              label="Edit Study"
              style="OUTLINE"
              color="NEUTRAL"
              onClick={() => navigate(`/studies/${id}/edit`)}
            />
          </div>
        </div>

        {/* Study Info */}
        <CardLayout padding="MORE" showShadow={true}>
          <div className="flex items-center gap-3 mb-2">
            <HeadingField
              text="Study Details"
              size="MEDIUM"
              headingTag="H2"
              marginBelow="NONE"
            />
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              study.archived 
                ? 'bg-gray-100 text-gray-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {study.archived ? 'Archived' : 'Active'}
            </span>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            <p><strong>Product:</strong> {study.productId}</p>
            {study.featureId && <p><strong>Feature:</strong> {study.featureId}</p>}
            <p><strong>Created:</strong> {new Date(study.createdAt).toLocaleDateString()}</p>
            <p><strong>Sessions:</strong> {sessionCount}</p>
          </div>
        </CardLayout>

        {/* Sessions Section */}
        <div className="mt-6">
          <CardLayout padding="MORE" showShadow={true}>
            <div className="flex items-center justify-between mb-4">
              <HeadingField
                text="Sessions"
                size="MEDIUM"
                headingTag="H2"
                marginBelow="NONE"
              />
              {!study.archived && (
                <ButtonWidget
                  label={showSessionForm ? 'Cancel' : '+ New Session'}
                  style={showSessionForm ? 'OUTLINE' : 'SOLID'}
                  color={showSessionForm ? 'NEUTRAL' : 'ACCENT'}
                  onClick={() => setShowSessionForm(!showSessionForm)}
                />
              )}
            </div>

            {/* Session Form */}
            {showSessionForm && (
              <div className="mb-6">
                <SessionForm
                  studyId={id!}
                  onSave={handleSessionSaved}
                  onCancel={() => setShowSessionForm(false)}
                />
              </div>
            )}

            {/* Session List */}
            <SessionList
              studyId={id!}
              onSessionClick={handleViewSession}
            />
          </CardLayout>
        </div>
      </div>
    </div>
  )
}
