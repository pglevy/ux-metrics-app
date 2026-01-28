import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HeadingField,
  CardLayout,
  ButtonWidget,
  RichTextDisplayField,
} from '@pglevy/sailwind'
import type { Study } from '../../../api/types'
import { getAllStudies, archiveStudy, unarchiveStudy } from '../services/studyService'

/**
 * Study List Page
 *
 * Displays all studies in the system with their name, product identifier,
 * feature identifier (if present), and archived status.
 * Allows navigation to add/edit study forms and study detail pages.
 *
 * **Validates: Requirements 1.3** - View list of all studies
 */

export default function StudyList() {
  const navigate = useNavigate()
  const [studies, setStudies] = useState<Study[]>([])
  const [loading, setLoading] = useState(true)

  // Load studies on component mount
  useEffect(() => {
    loadStudies()
  }, [])

  const loadStudies = () => {
    setLoading(true)
    try {
      const allStudies = getAllStudies()
      // Sort by creation date (newest first)
      const sorted = allStudies.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setStudies(sorted)
    } catch (error) {
      console.error('Failed to load studies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleArchive = (id: string) => {
    const result = archiveStudy(id)
    if (result.success) {
      loadStudies()
    } else {
      console.error('Failed to archive study:', result.error)
      alert(result.error || 'Failed to archive study')
    }
  }

  const handleUnarchive = (id: string) => {
    const result = unarchiveStudy(id)
    if (result.success) {
      loadStudies()
    } else {
      console.error('Failed to unarchive study:', result.error)
      alert(result.error || 'Failed to unarchive study')
    }
  }

  const getArchivedBadge = (archived: boolean) => {
    if (archived) {
      return (
        <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">
          Archived
        </span>
      )
    }
    return (
      <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
        Active
      </span>
    )
  }

  return (
    <div className="with-sidebar min-h-screen page-animate" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container mx-auto px-8 py-8">
        {/* Header */}
        <header className="mb-8" style={{ animation: 'fadeInDown 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <h1 className="text-3xl font-semibold" style={{
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em'
          }}>
            Studies
          </h1>
          <p className="text-base mt-2" style={{ color: 'var(--text-secondary)' }}>
            Manage and organize your usability testing studies
          </p>
        </header>

        {/* Add Study Button */}
        <div className="mb-6 card-animate" style={{ animationDelay: '0.1s' }}>
          <CardLayout padding="MORE" showShadow={true}>
            <div className="flex items-center justify-between">
              <HeadingField
                text="Manage Studies"
                size="MEDIUM"
                headingTag="H2"
                marginBelow="NONE"
              />
              <ButtonWidget
                label="+ Add Study"
                style="SOLID"
                color="ACCENT"
                onClick={() => navigate('/studies/new')}
              />
            </div>
          </CardLayout>
        </div>

        {/* Studies List */}
        <div className="space-y-4">
          {loading ? (
            <CardLayout padding="MORE" showShadow={true}>
              <RichTextDisplayField value={['Loading studies...']} />
            </CardLayout>
          ) : studies.length === 0 ? (
            <CardLayout padding="MORE" showShadow={true}>
              <RichTextDisplayField
                value={[
                  'No studies yet. Create your first study to start organizing usability evaluations.',
                ]}
              />
            </CardLayout>
          ) : (
            <>
              {/* Active Studies */}
              {studies.filter(s => !s.archived).map((study, idx) => (
                <div key={study.id} className="card-animate" style={{ animationDelay: `${0.15 + idx * 0.05}s` }}>
                  <CardLayout padding="MORE" showShadow={true}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <HeadingField
                          text={study.name}
                          size="MEDIUM"
                          headingTag="H3"
                          marginBelow="NONE"
                        />
                        {getArchivedBadge(study.archived)}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Product:</strong> {study.productId}
                        {study.featureId && (
                          <>
                            {' | '}
                            <strong>Feature:</strong> {study.featureId}
                          </>
                        )}
                        {' | '}
                        <strong>Created:</strong>{' '}
                        {new Date(study.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <ButtonWidget
                        label="View"
                        style="SOLID"
                        color="ACCENT"
                        onClick={() => navigate(`/studies/${study.id}`)}
                      />
                      <ButtonWidget
                        label="Edit"
                        style="OUTLINE"
                        color="NEUTRAL"
                        onClick={() => navigate(`/studies/${study.id}/edit`)}
                      />
                      <ButtonWidget
                        label="Archive"
                        style="OUTLINE"
                        color="NEGATIVE"
                        onClick={() => handleArchive(study.id)}
                      />
                    </div>
                  </div>
                </CardLayout>
                </div>
              ))}

              {/* Archived Studies Section */}
              {studies.filter(s => s.archived).length > 0 && (
                <>
                  <div className="mt-12 mb-6">
                    <h2 className="text-xl font-semibold" style={{
                      color: 'var(--text-secondary)',
                      letterSpacing: '-0.02em'
                    }}>
                      Archived
                    </h2>
                  </div>
                  {studies.filter(s => s.archived).map((study, idx) => (
                    <div key={study.id} className="card-animate" style={{ animationDelay: `${0.15 + idx * 0.05}s` }}>
                      <CardLayout padding="MORE" showShadow={true}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <HeadingField
                              text={study.name}
                              size="MEDIUM"
                              headingTag="H3"
                              marginBelow="NONE"
                            />
                            {getArchivedBadge(study.archived)}
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Product:</strong> {study.productId}
                            {study.featureId && (
                              <>
                                {' | '}
                                <strong>Feature:</strong> {study.featureId}
                              </>
                            )}
                            {' | '}
                            <strong>Created:</strong>{' '}
                            {new Date(study.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <ButtonWidget
                            label="View"
                            style="SOLID"
                            color="ACCENT"
                            onClick={() => navigate(`/studies/${study.id}`)}
                          />
                          <ButtonWidget
                            label="Edit"
                            style="OUTLINE"
                            color="NEUTRAL"
                            onClick={() => navigate(`/studies/${study.id}/edit`)}
                          />
                          <ButtonWidget
                            label="Unarchive"
                            style="OUTLINE"
                            color="NEUTRAL"
                            onClick={() => handleUnarchive(study.id)}
                          />
                        </div>
                      </div>
                    </CardLayout>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
