import { useState, useEffect } from 'react'
import {
  HeadingField,
  CardLayout,
  ButtonWidget,
  RichTextDisplayField,
} from '@pglevy/sailwind'
import type { AssessmentType } from '../../../api/types'
import { getAllAssessmentTypes, initializeAssessmentTypes } from '../services/assessmentTypeService'

/**
 * AssessmentTypeList Component
 *
 * Displays available assessment types using Sailwind CardLayout.
 * Shows type name and question count for each assessment type.
 *
 * **Validates: Requirements 3.5** - View assessment type definitions
 */

interface AssessmentTypeListProps {
  /** Optional callback when an assessment type is clicked for editing */
  onEditClick?: (assessmentTypeId: string) => void
  /** Optional callback when an assessment type is selected */
  onSelectClick?: (assessmentTypeId: string) => void
  /** Whether to show the edit button */
  showEditButton?: boolean
  /** Whether to show the select button */
  showSelectButton?: boolean
  /** Label for the select button */
  selectButtonLabel?: string
}

export default function AssessmentTypeList({
  onEditClick,
  onSelectClick,
  showEditButton = true,
  showSelectButton = false,
  selectButtonLabel = 'Select',
}: AssessmentTypeListProps) {
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([])
  const [loading, setLoading] = useState(true)

  // Load assessment types on component mount
  useEffect(() => {
    loadAssessmentTypes()
  }, [])

  const loadAssessmentTypes = () => {
    setLoading(true)
    try {
      // Initialize default types if needed
      initializeAssessmentTypes()
      
      const types = getAllAssessmentTypes()
      setAssessmentTypes(types)
    } catch (error) {
      console.error('Failed to load assessment types:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: string) => {
    if (onEditClick) {
      onEditClick(id)
    }
  }

  const handleSelect = (id: string) => {
    if (onSelectClick) {
      onSelectClick(id)
    }
  }

  /**
   * Get a description for each assessment type
   */
  const getTypeDescription = (type: string): string => {
    switch (type) {
      case 'task_success_rate':
        return 'Measures the percentage of users who complete a task correctly.'
      case 'time_on_task':
        return 'Measures how long it takes users to complete a specific task.'
      case 'task_efficiency':
        return 'Compares actual user paths to optimal paths for task completion.'
      case 'error_rate':
        return 'Tracks the number and types of errors during task completion.'
      case 'seq':
        return 'Single Ease Question - a 1-7 rating of perceived task difficulty.'
      default:
        return 'Custom assessment type.'
    }
  }

  /**
   * Get a color class for each assessment type badge
   */
  const getTypeBadgeColor = (type: string): string => {
    switch (type) {
      case 'task_success_rate':
        return 'bg-green-100 text-green-800'
      case 'time_on_task':
        return 'bg-blue-100 text-blue-800'
      case 'task_efficiency':
        return 'bg-purple-100 text-purple-800'
      case 'error_rate':
        return 'bg-red-100 text-red-800'
      case 'seq':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  /**
   * Format the type enum for display
   */
  const formatType = (type: string): string => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  if (loading) {
    return (
      <CardLayout padding="MORE" showShadow={true}>
        <RichTextDisplayField value={['Loading assessment types...']} />
      </CardLayout>
    )
  }

  if (assessmentTypes.length === 0) {
    return (
      <CardLayout padding="MORE" showShadow={true}>
        <RichTextDisplayField
          value={[
            'No assessment types available. Assessment types should be initialized automatically.',
          ]}
        />
      </CardLayout>
    )
  }

  return (
    <div className="space-y-4">
      {assessmentTypes.map((assessmentType) => (
        <CardLayout key={assessmentType.id} padding="MORE" showShadow={true}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Assessment Type Header */}
              <div className="flex items-center gap-3 mb-2">
                <HeadingField
                  text={assessmentType.name}
                  size="MEDIUM"
                  headingTag="H3"
                  marginBelow="NONE"
                />
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${getTypeBadgeColor(assessmentType.type)}`}
                >
                  {formatType(assessmentType.type)}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-2">
                {getTypeDescription(assessmentType.type)}
              </p>

              {/* Question Count */}
              <div className="text-sm text-gray-500">
                <strong>Questions:</strong> {assessmentType.questions.length}
              </div>

              {/* Question Preview */}
              {assessmentType.questions.length > 0 && (
                <div className="mt-2 text-xs text-gray-400">
                  <span className="font-medium">Sample questions: </span>
                  {assessmentType.questions
                    .slice(0, 2)
                    .map((q) => q.text)
                    .join(', ')}
                  {assessmentType.questions.length > 2 && '...'}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {showSelectButton && onSelectClick && (
                <ButtonWidget
                  label={selectButtonLabel}
                  style="SOLID"
                  color="ACCENT"
                  onClick={() => handleSelect(assessmentType.id)}
                />
              )}
              {showEditButton && onEditClick && (
                <ButtonWidget
                  label="Edit"
                  style="OUTLINE"
                  color="NEUTRAL"
                  onClick={() => handleEdit(assessmentType.id)}
                />
              )}
            </div>
          </div>
        </CardLayout>
      ))}
    </div>
  )
}
