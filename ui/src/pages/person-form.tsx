import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  HeadingField,
  CardLayout,
  TextField,
  DropdownField,
  ButtonWidget,
  MessageBanner,
} from '@pglevy/sailwind'
import type { PersonRole } from '../../../api/types'
import { createPerson, getPersonById, updatePerson } from '../services/personService'

/**
 * Person Form Page
 *
 * Allows creating new people or editing existing ones.
 * Supports participants, facilitators, and observers.
 *
 * **Validates: Requirements 2.5.1, 2.5.3**
 * - 2.5.1: Create people with name and role
 * - 2.5.3: Edit person name and role
 */

export default function PersonForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditMode = Boolean(id)

  // Form state
  const [name, setName] = useState('')
  const [role, setRole] = useState<PersonRole>('participant')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)

  // Role options for dropdown
  const roleLabels = ['Participant', 'Facilitator', 'Observer']
  const roleValues: PersonRole[] = ['participant', 'facilitator', 'observer']

  // Load existing person data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true)
      try {
        const person = getPersonById(id)
        if (person) {
          setName(person.name)
          setRole(person.role)
        } else {
          setError(`Person with ID "${id}" not found.`)
        }
      } catch (err) {
        console.error('Failed to load person:', err)
        setError('Failed to load person data.')
      } finally {
        setLoading(false)
      }
    }
  }, [id, isEditMode])

  // Validate name field
  const validateName = (value: string): boolean => {
    if (!value.trim()) {
      setNameError('Name is required.')
      return false
    }
    setNameError(null)
    return true
  }

  // Handle name change with validation
  const handleNameChange = (value: string) => {
    setName(value)
    // Clear error when user starts typing
    if (nameError && value.trim()) {
      setNameError(null)
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate required fields
    if (!validateName(name)) {
      return
    }

    try {
      if (isEditMode && id) {
        // Update existing person
        const result = updatePerson(id, { name: name.trim(), role })
        if (!result.success) {
          setError(result.error || 'Failed to update person.')
          return
        }
      } else {
        // Create new person
        const person = createPerson(name.trim(), role)
        if (!person) {
          setError('Failed to create person.')
          return
        }
      }

      // Navigate back to people list on success
      navigate('/people')
    } catch (err) {
      console.error('Failed to save person:', err)
      setError('An unexpected error occurred.')
    }
  }

  // Handle cancel
  const handleCancel = () => {
    navigate('/people')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50">
        <div className="container mx-auto px-8 py-8">
          <CardLayout padding="MORE" showShadow={true}>
            <p>Loading...</p>
          </CardLayout>
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
            text={isEditMode ? 'Edit Person' : 'Add Person'}
            size="LARGE"
            headingTag="H1"
            marginBelow="NONE"
          />
          <ButtonWidget
            label="← Back to People"
            style="OUTLINE"
            color="NEUTRAL"
            onClick={handleCancel}
          />
        </div>

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
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-4">
              <TextField
                label="Name"
                value={name}
                onChange={handleNameChange}
                required={true}
                labelPosition="ABOVE"
                marginBelow="NONE"
                instructions="Enter the person's full name"
              />
              {nameError && (
                <p className="mt-1 text-sm text-red-700">{nameError}</p>
              )}
            </div>

            {/* Role Dropdown */}
            <DropdownField
              label="Role"
              choiceLabels={roleLabels}
              choiceValues={roleValues}
              value={role}
              onChange={(value) => setRole(value as PersonRole)}
              labelPosition="ABOVE"
              marginBelow="MORE"
              instructions="Select the person's role in usability sessions"
            />

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <ButtonWidget
                label={isEditMode ? 'Save Changes' : 'Create Person'}
                style="SOLID"
                color="ACCENT"
                submit={true}
              />
              <ButtonWidget
                label="Cancel"
                style="OUTLINE"
                color="NEUTRAL"
                onClick={handleCancel}
              />
            </div>
          </form>
        </CardLayout>

        {/* Help Text */}
        <div className="mt-6">
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField
              text="About Roles"
              size="SMALL"
              headingTag="H4"
              marginBelow="STANDARD"
            />
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong className="text-blue-800">Participant:</strong> A user being evaluated during a usability session.
              </p>
              <p>
                <strong className="text-green-800">Facilitator:</strong> A team member conducting a moderated session.
              </p>
              <p>
                <strong className="text-purple-800">Observer:</strong> A team member watching a session without direct participation.
              </p>
            </div>
          </CardLayout>
        </div>
      </div>
    </div>
  )
}
