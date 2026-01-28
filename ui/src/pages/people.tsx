import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HeadingField,
  CardLayout,
  ButtonWidget,
  RichTextDisplayField,
} from '@pglevy/sailwind'
import type { Person } from '../../../api/types'
import { getAllPeople, safeDeletePerson } from '../services/personService'

/**
 * People List Page
 *
 * Displays all people (participants, facilitators, observers) in the system.
 * Allows navigation to add/edit person forms and deletion of people.
 *
 * **Validates: Requirements 2.5.2** - View list of all people
 */

export default function PeopleList() {
  const navigate = useNavigate()
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)

  // Load people on component mount
  useEffect(() => {
    loadPeople()
  }, [])

  const loadPeople = () => {
    setLoading(true)
    try {
      const allPeople = getAllPeople()
      setPeople(allPeople)
    } catch (error) {
      console.error('Failed to load people:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    const result = safeDeletePerson(id)
    if (result.success) {
      // Reload the list after successful deletion
      loadPeople()
    } else {
      console.error('Failed to delete person:', result.error)
      alert(result.error || 'Failed to delete person')
    }
  }

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'participant':
        return 'bg-blue-100 text-blue-800'
      case 'facilitator':
        return 'bg-green-100 text-green-800'
      case 'observer':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="with-sidebar min-h-screen page-animate" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <HeadingField
            text="People"
            size="LARGE"
            headingTag="H1"
            marginBelow="NONE"
          />
          <div className="flex gap-2">
            <ButtonWidget
              label="← Back to Home"
              style="OUTLINE"
              color="NEUTRAL"
              onClick={() => navigate('/')}
            />
          </div>
        </div>

        {/* Add Person Button */}
        <CardLayout padding="MORE" showShadow={true}>
          <div className="flex items-center justify-between">
            <HeadingField
              text="Manage People"
              size="MEDIUM"
              headingTag="H2"
              marginBelow="NONE"
            />
            <ButtonWidget
              label="+ Add Person"
              style="SOLID"
              color="ACCENT"
              onClick={() => navigate('/people/new')}
            />
          </div>
        </CardLayout>

        {/* People List */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <CardLayout padding="MORE" showShadow={true}>
              <RichTextDisplayField value={['Loading people...']} />
            </CardLayout>
          ) : people.length === 0 ? (
            <CardLayout padding="MORE" showShadow={true}>
              <RichTextDisplayField
                value={[
                  'No people yet. Add participants, facilitators, and observers to get started with your usability sessions.',
                ]}
              />
            </CardLayout>
          ) : (
            people.map((person) => (
              <CardLayout key={person.id} padding="MORE" showShadow={true}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <HeadingField
                        text={person.name}
                        size="MEDIUM"
                        headingTag="H3"
                        marginBelow="NONE"
                      />
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getRoleBadgeColor(person.role)}`}
                      >
                        {formatRole(person.role)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>ID:</strong> {person.id} |{' '}
                      <strong>Created:</strong>{' '}
                      {new Date(person.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <ButtonWidget
                      label="Edit"
                      style="OUTLINE"
                      color="NEUTRAL"
                      onClick={() => navigate(`/people/${person.id}/edit`)}
                    />
                    <ButtonWidget
                      label="Delete"
                      style="OUTLINE"
                      color="NEGATIVE"
                      onClick={() => handleDelete(person.id)}
                    />
                  </div>
                </div>
              </CardLayout>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
