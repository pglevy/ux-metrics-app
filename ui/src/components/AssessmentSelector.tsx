import {
  HeadingField,
} from '@pglevy/sailwind'
import type { AssessmentType } from '../../../api/types'

/**
 * AssessmentSelector Component
 *
 * Allows selection of which assessment type to administer.
 * Uses ButtonArrayLayout for visual selection.
 *
 * **Validates: Requirements 9.1, 9.3**
 * - 9.1: Allow multiple assessments to be administered
 * - 9.3: Allow assessments to be completed in any order
 */

interface AssessmentSelectorProps {
  /** Available assessment types to choose from */
  assessmentTypes: AssessmentType[]
  /** Callback when an assessment type is selected */
  onSelect: (assessmentTypeId: string) => void
}

// Assessment type descriptions for better UX
const ASSESSMENT_DESCRIPTIONS: Record<string, string> = {
  task_success_rate: 'Record whether tasks were completed successfully',
  time_on_task: 'Measure how long tasks take to complete',
  task_efficiency: 'Compare actual steps to optimal steps',
  error_rate: 'Track errors during task completion',
  seq: 'Capture task difficulty ratings (1-7 scale)',
}

// Assessment type icons (using emoji for simplicity)
const ASSESSMENT_ICONS: Record<string, string> = {
  task_success_rate: '✓',
  time_on_task: '⏱',
  task_efficiency: '📊',
  error_rate: '⚠',
  seq: '📝',
}

export default function AssessmentSelector({
  assessmentTypes,
  onSelect,
}: AssessmentSelectorProps) {
  if (assessmentTypes.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        No assessment types available. Please configure assessment types first.
      </div>
    )
  }

  return (
    <div>
      <p className="text-gray-600 mb-4">
        Select an assessment type to administer. Assessments can be completed in any order.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assessmentTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">
                {ASSESSMENT_ICONS[type.type] || '📋'}
              </span>
              <HeadingField
                text={type.name}
                size="SMALL"
                headingTag="H4"
                marginBelow="NONE"
              />
            </div>
            <p className="text-sm text-gray-600">
              {ASSESSMENT_DESCRIPTIONS[type.type] || `${type.questions.length} questions`}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
