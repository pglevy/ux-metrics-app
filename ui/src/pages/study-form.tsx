import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  HeadingField,
  CardLayout,
  TextField,
  ButtonWidget,
  MessageBanner,
} from '@pglevy/sailwind'
import { createStudy, getStudyById, updateStudy } from '../services/studyService'

/**
 * Study Form Page
 *
 * Allows creating new studies or editing existing ones.
 * Studies organize usability evaluations for specific products or features.
 *
 * **Validates: Requirements 1.1, 1.4**
 * - 1.1: Create a study with name and product identifier
 * - 1.4: Edit study name, product identifier, and feature identifier
 */

export default function StudyForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditMode = Boolean(id)

  // Form state
  const [name, setName] = useState('')
  const [productId, setProductId] = useState('')
  const [featureId, setFeatureId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)
  const [productIdError, setProductIdError] = useState<string | null>(null)

  // Load existing study data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true)
      try {
        const study = getStudyById(id)
        if (study) {
          setName(study.name)
          setProductId(study.productId)
          setFeatureId(study.featureId || '')
        } else {
          setError(`Study with ID "${id}" not found.`)
        }
      } catch (err) {
        console.error('Failed to load study:', err)
        setError('Failed to load study data.')
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

  // Validate product identifier field
  const validateProductId = (value: string): boolean => {
    if (!value.trim()) {
      setProductIdError('Product identifier is required.')
      return false
    }
    setProductIdError(null)
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

  // Handle product identifier change with validation
  const handleProductIdChange = (value: string) => {
    setProductId(value)
    // Clear error when user starts typing
    if (productIdError && value.trim()) {
      setProductIdError(null)
    }
  }

  // Handle feature identifier change
  const handleFeatureIdChange = (value: string) => {
    setFeatureId(value)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate required fields
    const isNameValid = validateName(name)
    const isProductIdValid = validateProductId(productId)

    if (!isNameValid || !isProductIdValid) {
      return
    }

    try {
      if (isEditMode && id) {
        // Update existing study
        const result = updateStudy(id, {
          name: name.trim(),
          productId: productId.trim(),
          featureId: featureId.trim() || null,
        })
        if (!result.success) {
          setError(result.error || 'Failed to update study.')
          return
        }
      } else {
        // Create new study
        const study = createStudy(
          name.trim(),
          productId.trim(),
          featureId.trim() || undefined
        )
        if (!study) {
          setError('Failed to create study.')
          return
        }
      }

      // Navigate back to studies list on success
      navigate('/studies')
    } catch (err) {
      console.error('Failed to save study:', err)
      setError('An unexpected error occurred.')
    }
  }

  // Handle cancel
  const handleCancel = () => {
    navigate('/studies')
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
            text={isEditMode ? 'Edit Study' : 'Create Study'}
            size="LARGE"
            headingTag="H1"
            marginBelow="NONE"
          />
          <ButtonWidget
            label="← Back to Studies"
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
                label="Study Name"
                value={name}
                onChange={handleNameChange}
                required={true}
                labelPosition="ABOVE"
                marginBelow="NONE"
                instructions="Enter a descriptive name for this study"
              />
              {nameError && (
                <p className="mt-1 text-sm text-red-700">{nameError}</p>
              )}
            </div>

            {/* Product Identifier Field */}
            <div className="mb-4">
              <TextField
                label="Product Identifier"
                value={productId}
                onChange={handleProductIdChange}
                required={true}
                labelPosition="ABOVE"
                marginBelow="NONE"
                instructions="Enter the product identifier (e.g., 'ecommerce-app', 'mobile-banking')"
              />
              {productIdError && (
                <p className="mt-1 text-sm text-red-700">{productIdError}</p>
              )}
            </div>

            {/* Feature Identifier Field (Optional) */}
            <div className="mb-6">
              <TextField
                label="Feature Identifier (Optional)"
                value={featureId}
                onChange={handleFeatureIdChange}
                required={false}
                labelPosition="ABOVE"
                marginBelow="NONE"
                instructions="Optionally specify a feature within the product (e.g., 'checkout', 'login')"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <ButtonWidget
                label={isEditMode ? 'Save Changes' : 'Create Study'}
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
              text="About Studies"
              size="SMALL"
              headingTag="H4"
              marginBelow="STANDARD"
            />
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong className="text-blue-800">Study:</strong> A collection of sessions focused on evaluating a specific product or feature.
              </p>
              <p>
                <strong className="text-green-800">Product Identifier:</strong> A unique identifier for the product being evaluated (e.g., app name, project code).
              </p>
              <p>
                <strong className="text-purple-800">Feature Identifier:</strong> An optional identifier for a specific feature within the product.
              </p>
            </div>
          </CardLayout>
        </div>
      </div>
    </div>
  )
}
