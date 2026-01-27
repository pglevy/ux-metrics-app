import { useState, useEffect } from 'react'
import {
  HeadingField,
  CardLayout,
  TextField,
  DropdownField,
  ButtonWidget,
  MessageBanner,
} from '@pglevy/sailwind'
import type { AssessmentType, Question, ValidationRule, ResponseType, ValidationRuleType } from '../../../api/types'
import { 
  getAssessmentTypeById, 
  updateAssessmentType,
} from '../services/assessmentTypeService'
import { generateId } from '../services/storage'

/**
 * AssessmentTypeForm Component
 *
 * Form for editing assessment type questions and validation rules.
 * Uses Sailwind TextField for editing question text and validation rules.
 *
 * **Validates: Requirements 3.4, 3.5**
 * - 3.4: Store question definitions including question text, response type, and validation rules
 * - 3.5: Allow users to view and edit assessment type definitions
 */

interface AssessmentTypeFormProps {
  /** The assessment type ID to edit */
  assessmentTypeId: string
  /** Callback when save is successful */
  onSave?: () => void
  /** Callback when form is cancelled */
  onCancel?: () => void
}

interface EditableQuestion extends Question {
  isEditing: boolean
}

export default function AssessmentTypeForm({
  assessmentTypeId,
  onSave,
  onCancel,
}: AssessmentTypeFormProps) {
  const [assessmentType, setAssessmentType] = useState<AssessmentType | null>(null)
  const [editableName, setEditableName] = useState('')
  const [editableQuestions, setEditableQuestions] = useState<EditableQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Load assessment type on mount
  useEffect(() => {
    loadAssessmentType()
  }, [assessmentTypeId])

  const loadAssessmentType = () => {
    setLoading(true)
    setError(null)
    try {
      const type = getAssessmentTypeById(assessmentTypeId)
      if (type) {
        setAssessmentType(type)
        setEditableName(type.name)
        setEditableQuestions(
          type.questions.map((q) => ({ ...q, isEditing: false }))
        )
      } else {
        setError(`Assessment type with ID "${assessmentTypeId}" not found.`)
      }
    } catch (err) {
      console.error('Failed to load assessment type:', err)
      setError('Failed to load assessment type.')
    } finally {
      setLoading(false)
    }
  }

  // Handle name change
  const handleNameChange = (value: string) => {
    setEditableName(value)
  }

  // Handle question text change
  const handleQuestionTextChange = (questionId: string, text: string) => {
    setEditableQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, text } : q))
    )
  }

  // Handle question response type change
  const handleResponseTypeChange = (questionId: string, responseType: string) => {
    setEditableQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, responseType: responseType as ResponseType } : q
      )
    )
  }

  // Handle validation rule changes
  const handleValidationRuleChange = (
    questionId: string,
    ruleType: ValidationRuleType,
    enabled: boolean,
    value?: number | string
  ) => {
    setEditableQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q

        let rules = q.validationRules ? [...q.validationRules] : []

        if (enabled) {
          // Add or update the rule
          const existingIndex = rules.findIndex((r) => r.type === ruleType)
          const newRule: ValidationRule = { type: ruleType }
          if (value !== undefined) {
            newRule.value = value
          }
          if (existingIndex >= 0) {
            rules[existingIndex] = newRule
          } else {
            rules.push(newRule)
          }
        } else {
          // Remove the rule
          rules = rules.filter((r) => r.type !== ruleType)
        }

        return { ...q, validationRules: rules.length > 0 ? rules : null }
      })
    )
  }

  // Check if a validation rule is enabled
  const hasValidationRule = (question: EditableQuestion, ruleType: ValidationRuleType): boolean => {
    return question.validationRules?.some((r) => r.type === ruleType) ?? false
  }

  // Get validation rule value
  const getValidationRuleValue = (
    question: EditableQuestion,
    ruleType: ValidationRuleType
  ): number | string | undefined => {
    return question.validationRules?.find((r) => r.type === ruleType)?.value
  }

  // Toggle question editing mode
  const toggleQuestionEditing = (questionId: string) => {
    setEditableQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, isEditing: !q.isEditing } : q
      )
    )
  }

  // Add a new question
  const handleAddQuestion = () => {
    const newQuestion: EditableQuestion = {
      id: generateId('question'),
      text: 'New Question',
      responseType: 'text',
      validationRules: null,
      isEditing: true,
    }
    setEditableQuestions((prev) => [...prev, newQuestion])
  }

  // Remove a question
  const handleRemoveQuestion = (questionId: string) => {
    setEditableQuestions((prev) => prev.filter((q) => q.id !== questionId))
  }

  // Save all changes
  const handleSave = () => {
    setError(null)
    setSuccessMessage(null)

    if (!editableName.trim()) {
      setError('Assessment type name is required.')
      return
    }

    if (editableQuestions.length === 0) {
      setError('At least one question is required.')
      return
    }

    // Validate all questions have text
    const emptyQuestions = editableQuestions.filter((q) => !q.text.trim())
    if (emptyQuestions.length > 0) {
      setError('All questions must have text.')
      return
    }

    try {
      // Prepare questions without the isEditing flag
      const questionsToSave: Question[] = editableQuestions.map(
        ({ isEditing, ...q }) => q
      )

      const result = updateAssessmentType(assessmentTypeId, {
        name: editableName.trim(),
        questions: questionsToSave,
      })

      if (result.success) {
        setSuccessMessage('Assessment type saved successfully.')
        // Reload to get fresh data
        loadAssessmentType()
        onSave?.()
      } else {
        setError(result.error || 'Failed to save assessment type.')
      }
    } catch (err) {
      console.error('Failed to save assessment type:', err)
      setError('An unexpected error occurred.')
    }
  }

  // Response type options
  const responseTypeLabels = ['Text', 'Number', 'Boolean', 'Rating']
  const responseTypeValues = ['text', 'number', 'boolean', 'rating']

  if (loading) {
    return (
      <CardLayout padding="MORE" showShadow={true}>
        <p>Loading...</p>
      </CardLayout>
    )
  }

  if (!assessmentType) {
    return (
      <CardLayout padding="MORE" showShadow={true}>
        <MessageBanner
          primaryText={error || 'Assessment type not found.'}
          backgroundColor="NEGATIVE"
          icon="error"
        />
      </CardLayout>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <MessageBanner
          primaryText={error}
          backgroundColor="NEGATIVE"
          icon="error"
        />
      )}

      {/* Success Banner */}
      {successMessage && (
        <MessageBanner
          primaryText={successMessage}
          backgroundColor="POSITIVE"
          icon="success"
        />
      )}

      {/* Assessment Type Info */}
      <CardLayout padding="MORE" showShadow={true}>
        <HeadingField
          text="Edit Assessment Type"
          size="MEDIUM"
          headingTag="H2"
          marginBelow="MORE"
        />

        {/* Name Field */}
        <div className="mb-4">
          <TextField
            label="Assessment Type Name"
            value={editableName}
            onChange={handleNameChange}
            required={true}
            labelPosition="ABOVE"
            marginBelow="NONE"
          />
        </div>

        {/* Type Badge (read-only) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type (Read-only)
          </label>
          <span className="px-3 py-1 rounded bg-gray-100 text-gray-800 text-sm">
            {assessmentType.type}
          </span>
        </div>
      </CardLayout>

      {/* Questions Section */}
      <CardLayout padding="MORE" showShadow={true}>
        <div className="flex items-center justify-between mb-4">
          <HeadingField
            text="Questions"
            size="SMALL"
            headingTag="H3"
            marginBelow="NONE"
          />
          <ButtonWidget
            label="+ Add Question"
            style="OUTLINE"
            color="ACCENT"
            onClick={handleAddQuestion}
          />
        </div>

        {editableQuestions.length === 0 ? (
          <p className="text-gray-500 italic">
            No questions defined. Click "Add Question" to create one.
          </p>
        ) : (
          <div className="space-y-4">
            {editableQuestions.map((question, index) => (
              <div
                key={question.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-gray-500">
                    Question {index + 1}
                  </span>
                  <div className="flex gap-2">
                    <ButtonWidget
                      label={question.isEditing ? 'Collapse' : 'Expand'}
                      style="OUTLINE"
                      color="NEUTRAL"
                      onClick={() => toggleQuestionEditing(question.id)}
                    />
                    <ButtonWidget
                      label="Remove"
                      style="OUTLINE"
                      color="NEGATIVE"
                      onClick={() => handleRemoveQuestion(question.id)}
                    />
                  </div>
                </div>

                {/* Question Text */}
                <div className="mb-3">
                  <TextField
                    label="Question Text"
                    value={question.text}
                    onChange={(value) =>
                      handleQuestionTextChange(question.id, value)
                    }
                    required={true}
                    labelPosition="ABOVE"
                    marginBelow="NONE"
                  />
                </div>

                {question.isEditing && (
                  <>
                    {/* Response Type */}
                    <div className="mb-3">
                      <DropdownField
                        label="Response Type"
                        choiceLabels={responseTypeLabels}
                        choiceValues={responseTypeValues}
                        value={question.responseType}
                        onChange={(value) =>
                          handleResponseTypeChange(question.id, value)
                        }
                        labelPosition="ABOVE"
                        marginBelow="NONE"
                      />
                    </div>

                    {/* Validation Rules */}
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Validation Rules
                      </label>

                      {/* Required */}
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          id={`${question.id}-required`}
                          checked={hasValidationRule(question, 'required')}
                          onChange={(e) =>
                            handleValidationRuleChange(
                              question.id,
                              'required',
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label
                          htmlFor={`${question.id}-required`}
                          className="text-sm text-gray-700"
                        >
                          Required
                        </label>
                      </div>

                      {/* Min Value (for number/rating) */}
                      {(question.responseType === 'number' ||
                        question.responseType === 'rating') && (
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="checkbox"
                            id={`${question.id}-min`}
                            checked={hasValidationRule(question, 'min')}
                            onChange={(e) =>
                              handleValidationRuleChange(
                                question.id,
                                'min',
                                e.target.checked,
                                e.target.checked ? 0 : undefined
                              )
                            }
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          <label
                            htmlFor={`${question.id}-min`}
                            className="text-sm text-gray-700"
                          >
                            Minimum Value:
                          </label>
                          {hasValidationRule(question, 'min') && (
                            <input
                              type="number"
                              value={getValidationRuleValue(question, 'min') ?? 0}
                              onChange={(e) =>
                                handleValidationRuleChange(
                                  question.id,
                                  'min',
                                  true,
                                  Number(e.target.value)
                                )
                              }
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          )}
                        </div>
                      )}

                      {/* Max Value (for number/rating) */}
                      {(question.responseType === 'number' ||
                        question.responseType === 'rating') && (
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="checkbox"
                            id={`${question.id}-max`}
                            checked={hasValidationRule(question, 'max')}
                            onChange={(e) =>
                              handleValidationRuleChange(
                                question.id,
                                'max',
                                e.target.checked,
                                e.target.checked ? 100 : undefined
                              )
                            }
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          <label
                            htmlFor={`${question.id}-max`}
                            className="text-sm text-gray-700"
                          >
                            Maximum Value:
                          </label>
                          {hasValidationRule(question, 'max') && (
                            <input
                              type="number"
                              value={getValidationRuleValue(question, 'max') ?? 100}
                              onChange={(e) =>
                                handleValidationRuleChange(
                                  question.id,
                                  'max',
                                  true,
                                  Number(e.target.value)
                                )
                              }
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          )}
                        </div>
                      )}

                      {/* Min Length (for text) */}
                      {question.responseType === 'text' && (
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="checkbox"
                            id={`${question.id}-minLength`}
                            checked={hasValidationRule(question, 'minLength')}
                            onChange={(e) =>
                              handleValidationRuleChange(
                                question.id,
                                'minLength',
                                e.target.checked,
                                e.target.checked ? 1 : undefined
                              )
                            }
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          <label
                            htmlFor={`${question.id}-minLength`}
                            className="text-sm text-gray-700"
                          >
                            Minimum Length:
                          </label>
                          {hasValidationRule(question, 'minLength') && (
                            <input
                              type="number"
                              value={
                                getValidationRuleValue(question, 'minLength') ?? 1
                              }
                              onChange={(e) =>
                                handleValidationRuleChange(
                                  question.id,
                                  'minLength',
                                  true,
                                  Number(e.target.value)
                                )
                              }
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          )}
                        </div>
                      )}

                      {/* Max Length (for text) */}
                      {question.responseType === 'text' && (
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="checkbox"
                            id={`${question.id}-maxLength`}
                            checked={hasValidationRule(question, 'maxLength')}
                            onChange={(e) =>
                              handleValidationRuleChange(
                                question.id,
                                'maxLength',
                                e.target.checked,
                                e.target.checked ? 500 : undefined
                              )
                            }
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          <label
                            htmlFor={`${question.id}-maxLength`}
                            className="text-sm text-gray-700"
                          >
                            Maximum Length:
                          </label>
                          {hasValidationRule(question, 'maxLength') && (
                            <input
                              type="number"
                              value={
                                getValidationRuleValue(question, 'maxLength') ?? 500
                              }
                              onChange={(e) =>
                                handleValidationRuleChange(
                                  question.id,
                                  'maxLength',
                                  true,
                                  Number(e.target.value)
                                )
                              }
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardLayout>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        <ButtonWidget
          label="Save Changes"
          style="SOLID"
          color="ACCENT"
          onClick={handleSave}
        />
        {onCancel && (
          <ButtonWidget
            label="Cancel"
            style="OUTLINE"
            color="NEUTRAL"
            onClick={onCancel}
          />
        )}
      </div>
    </div>
  )
}
