/**
 * Assessment Type Service
 * 
 * Manages assessment type definitions including the five core assessment types:
 * Task Success Rate, Time on Task, Task Efficiency, Error Rate, and SEQ.
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3**
 * - 3.1: Support creating assessment types for the five core types
 * - 3.2: Require name, type identifier, and question definitions
 * - 3.3: Allow assessment types to be reused across multiple sessions
 */

import type { 
  AssessmentType, 
  AssessmentTypeEnum, 
  Question, 
} from '../../../api/types'
import { 
  STORAGE_KEYS, 
  getAll, 
  getById, 
  update, 
  saveAll,
  generateId,
  StorageResult 
} from './storage'

/**
 * Default assessment types with pre-configured questions.
 * These represent the five core UX metrics assessment types.
 */
const DEFAULT_ASSESSMENT_TYPES: Omit<AssessmentType, 'id'>[] = [
  {
    name: 'Task Success Rate',
    type: 'task_success_rate',
    questions: [
      {
        id: 'tsr-task-description',
        text: 'Task Description',
        responseType: 'text',
        validationRules: [{ type: 'required' }],
      },
      {
        id: 'tsr-success-criteria',
        text: 'Success Criteria',
        responseType: 'text',
        validationRules: [{ type: 'required' }],
      },
      {
        id: 'tsr-task-successful',
        text: 'Was the task completed successfully?',
        responseType: 'boolean',
        validationRules: [{ type: 'required' }],
      },
    ],
  },
  {
    name: 'Time on Task',
    type: 'time_on_task',
    questions: [
      {
        id: 'tot-task-description',
        text: 'Task Description',
        responseType: 'text',
        validationRules: [{ type: 'required' }],
      },
      {
        id: 'tot-start-time',
        text: 'Start Time',
        responseType: 'text',
        validationRules: null,
      },
      {
        id: 'tot-end-time',
        text: 'End Time',
        responseType: 'text',
        validationRules: null,
      },
      {
        id: 'tot-manual-duration',
        text: 'Manual Duration (seconds)',
        responseType: 'number',
        validationRules: [{ type: 'min', value: 0 }],
      },
    ],
  },
  {
    name: 'Task Efficiency',
    type: 'task_efficiency',
    questions: [
      {
        id: 'te-task-description',
        text: 'Task Description',
        responseType: 'text',
        validationRules: [{ type: 'required' }],
      },
      {
        id: 'te-optimal-path',
        text: 'Optimal Path Definition',
        responseType: 'text',
        validationRules: [{ type: 'required' }],
      },
      {
        id: 'te-optimal-steps',
        text: 'Number of Optimal Steps',
        responseType: 'number',
        validationRules: [{ type: 'required' }, { type: 'min', value: 1 }],
      },
      {
        id: 'te-actual-steps',
        text: 'Number of Actual Steps Taken',
        responseType: 'number',
        validationRules: [{ type: 'required' }, { type: 'min', value: 1 }],
      },
    ],
  },
  {
    name: 'Error Rate',
    type: 'error_rate',
    questions: [
      {
        id: 'er-task-description',
        text: 'Task Description',
        responseType: 'text',
        validationRules: [{ type: 'required' }],
      },
      {
        id: 'er-error-count',
        text: 'Number of Errors',
        responseType: 'number',
        validationRules: [{ type: 'required' }, { type: 'min', value: 0 }],
      },
      {
        id: 'er-opportunities',
        text: 'Number of Opportunities for Errors',
        responseType: 'number',
        validationRules: [{ type: 'required' }, { type: 'min', value: 1 }],
      },
      {
        id: 'er-error-types',
        text: 'Error Types (comma-separated: wrong_click, invalid_submission, navigation_error)',
        responseType: 'text',
        validationRules: null,
      },
      {
        id: 'er-error-descriptions',
        text: 'Error Descriptions',
        responseType: 'text',
        validationRules: null,
      },
    ],
  },
  {
    name: 'Single Ease Question (SEQ)',
    type: 'seq',
    questions: [
      {
        id: 'seq-task-description',
        text: 'Task Description',
        responseType: 'text',
        validationRules: [{ type: 'required' }],
      },
      {
        id: 'seq-rating',
        text: 'How easy was this task? (1 = Very Difficult, 7 = Very Easy)',
        responseType: 'rating',
        validationRules: [
          { type: 'required' },
          { type: 'min', value: 1 },
          { type: 'max', value: 7 },
        ],
      },
    ],
  },
]

/**
 * Initializes the default assessment types in storage if they don't exist.
 * Should be called on application startup.
 * 
 * @returns StorageResult indicating success or failure
 * 
 * **Validates: Requirements 3.1** - Support the five core assessment types
 * 
 * @example
 * const result = initializeAssessmentTypes();
 * if (result.success) {
 *   console.log('Assessment types initialized');
 * }
 */
export function initializeAssessmentTypes(): StorageResult {
  try {
    const existingTypes = getAll<AssessmentType>(STORAGE_KEYS.ASSESSMENT_TYPES)
    
    // Only initialize if no assessment types exist
    if (existingTypes.length === 0) {
      const typesWithIds: AssessmentType[] = DEFAULT_ASSESSMENT_TYPES.map((type) => ({
        ...type,
        id: generateId('assessment-type'),
      }))
      
      return saveAll<AssessmentType>(STORAGE_KEYS.ASSESSMENT_TYPES, typesWithIds)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Failed to initialize assessment types:', error)
    return {
      success: false,
      error: 'Failed to initialize assessment types.',
    }
  }
}

/**
 * Retrieves all assessment types from storage.
 * 
 * @returns Array of all AssessmentType objects
 * 
 * **Validates: Requirements 3.5** - View assessment type definitions
 * 
 * @example
 * const types = getAllAssessmentTypes();
 * console.log(`Total assessment types: ${types.length}`);
 */
export function getAllAssessmentTypes(): AssessmentType[] {
  return getAll<AssessmentType>(STORAGE_KEYS.ASSESSMENT_TYPES)
}

/**
 * Retrieves a single assessment type by its ID.
 * 
 * @param id - The unique identifier of the assessment type
 * @returns The AssessmentType object if found, undefined otherwise
 * 
 * @example
 * const type = getAssessmentTypeById('assessment-type-123');
 * if (type) {
 *   console.log(`Found: ${type.name}`);
 * }
 */
export function getAssessmentTypeById(id: string): AssessmentType | undefined {
  return getById<AssessmentType>(STORAGE_KEYS.ASSESSMENT_TYPES, id)
}

/**
 * Retrieves an assessment type by its type enum value.
 * 
 * @param type - The assessment type enum value
 * @returns The AssessmentType object if found, undefined otherwise
 * 
 * @example
 * const seqType = getAssessmentTypeByType('seq');
 * if (seqType) {
 *   console.log(`SEQ has ${seqType.questions.length} questions`);
 * }
 */
export function getAssessmentTypeByType(type: AssessmentTypeEnum): AssessmentType | undefined {
  const allTypes = getAllAssessmentTypes()
  return allTypes.find((t) => t.type === type)
}

/**
 * Updates an existing assessment type's details.
 * Only the provided fields will be updated; others remain unchanged.
 * 
 * @param id - The unique identifier of the assessment type to update
 * @param updates - Partial AssessmentType object with fields to update
 * @returns StorageResult indicating success or failure
 * 
 * **Validates: Requirements 3.4, 3.5** - Store and edit question definitions
 * 
 * @example
 * const result = updateAssessmentType('assessment-type-123', { 
 *   name: 'Updated Name',
 *   questions: [...updatedQuestions]
 * });
 * if (result.success) {
 *   console.log('Assessment type updated successfully');
 * }
 */
export function updateAssessmentType(
  id: string, 
  updates: Partial<Omit<AssessmentType, 'id' | 'type'>>
): StorageResult {
  const existingType = getAssessmentTypeById(id)
  
  if (!existingType) {
    return {
      success: false,
      error: `Assessment type with id "${id}" not found.`,
    }
  }

  // Merge updates with existing type, preserving id and type
  const updatedType: AssessmentType = {
    ...existingType,
    ...updates,
    id: existingType.id, // Ensure ID cannot be changed
    type: existingType.type, // Ensure type cannot be changed
  }

  // Trim name if it was updated
  if (updates.name !== undefined) {
    updatedType.name = updatedType.name.trim()
  }

  return update<AssessmentType>(STORAGE_KEYS.ASSESSMENT_TYPES, id, updatedType)
}

/**
 * Updates a specific question within an assessment type.
 * 
 * @param assessmentTypeId - The ID of the assessment type containing the question
 * @param questionId - The ID of the question to update
 * @param updates - Partial Question object with fields to update
 * @returns StorageResult indicating success or failure
 * 
 * **Validates: Requirements 3.4** - Store question definitions including text and validation rules
 * 
 * @example
 * const result = updateQuestion('assessment-type-123', 'question-456', {
 *   text: 'Updated question text',
 *   validationRules: [{ type: 'required' }]
 * });
 */
export function updateQuestion(
  assessmentTypeId: string,
  questionId: string,
  updates: Partial<Omit<Question, 'id'>>
): StorageResult {
  const assessmentType = getAssessmentTypeById(assessmentTypeId)
  
  if (!assessmentType) {
    return {
      success: false,
      error: `Assessment type with id "${assessmentTypeId}" not found.`,
    }
  }

  const questionIndex = assessmentType.questions.findIndex((q) => q.id === questionId)
  
  if (questionIndex === -1) {
    return {
      success: false,
      error: `Question with id "${questionId}" not found in assessment type.`,
    }
  }

  // Update the question
  const updatedQuestions = [...assessmentType.questions]
  updatedQuestions[questionIndex] = {
    ...updatedQuestions[questionIndex],
    ...updates,
    id: questionId, // Ensure ID cannot be changed
  }

  return updateAssessmentType(assessmentTypeId, { questions: updatedQuestions })
}

/**
 * Adds a new question to an assessment type.
 * 
 * @param assessmentTypeId - The ID of the assessment type to add the question to
 * @param question - The question to add (without id, which will be generated)
 * @returns StorageResult with the new question ID in data field
 * 
 * @example
 * const result = addQuestion('assessment-type-123', {
 *   text: 'New question',
 *   responseType: 'text',
 *   validationRules: [{ type: 'required' }]
 * });
 */
export function addQuestion(
  assessmentTypeId: string,
  question: Omit<Question, 'id'>
): StorageResult<string> {
  const assessmentType = getAssessmentTypeById(assessmentTypeId)
  
  if (!assessmentType) {
    return {
      success: false,
      error: `Assessment type with id "${assessmentTypeId}" not found.`,
    }
  }

  const newQuestion: Question = {
    ...question,
    id: generateId('question'),
  }

  const updatedQuestions = [...assessmentType.questions, newQuestion]
  const result = updateAssessmentType(assessmentTypeId, { questions: updatedQuestions })

  if (result.success) {
    return { success: true, data: newQuestion.id }
  }

  return { success: false, error: result.error }
}

/**
 * Removes a question from an assessment type.
 * 
 * @param assessmentTypeId - The ID of the assessment type containing the question
 * @param questionId - The ID of the question to remove
 * @returns StorageResult indicating success or failure
 * 
 * @example
 * const result = removeQuestion('assessment-type-123', 'question-456');
 */
export function removeQuestion(
  assessmentTypeId: string,
  questionId: string
): StorageResult {
  const assessmentType = getAssessmentTypeById(assessmentTypeId)
  
  if (!assessmentType) {
    return {
      success: false,
      error: `Assessment type with id "${assessmentTypeId}" not found.`,
    }
  }

  const questionIndex = assessmentType.questions.findIndex((q) => q.id === questionId)
  
  if (questionIndex === -1) {
    return {
      success: false,
      error: `Question with id "${questionId}" not found in assessment type.`,
    }
  }

  const updatedQuestions = assessmentType.questions.filter((q) => q.id !== questionId)
  return updateAssessmentType(assessmentTypeId, { questions: updatedQuestions })
}

/**
 * Gets assessment types formatted for dropdown selection.
 * 
 * @returns Array of objects with id and label properties
 * 
 * @example
 * const options = getAssessmentTypesForDropdown();
 * // Returns: [{ id: 'assessment-type-123', label: 'Task Success Rate' }, ...]
 */
export function getAssessmentTypesForDropdown(): Array<{ id: string; label: string }> {
  const types = getAllAssessmentTypes()
  return types.map((type) => ({
    id: type.id,
    label: type.name,
  }))
}

/**
 * Resets assessment types to default values.
 * Useful for testing or restoring defaults.
 * 
 * @returns StorageResult indicating success or failure
 * 
 * @example
 * const result = resetAssessmentTypesToDefaults();
 */
export function resetAssessmentTypesToDefaults(): StorageResult {
  try {
    const typesWithIds: AssessmentType[] = DEFAULT_ASSESSMENT_TYPES.map((type) => ({
      ...type,
      id: generateId('assessment-type'),
    }))
    
    return saveAll<AssessmentType>(STORAGE_KEYS.ASSESSMENT_TYPES, typesWithIds)
  } catch (error) {
    console.error('Failed to reset assessment types:', error)
    return {
      success: false,
      error: 'Failed to reset assessment types.',
    }
  }
}
