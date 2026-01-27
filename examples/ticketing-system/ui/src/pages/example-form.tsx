import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeadingField, CardLayout, TextField, ButtonWidget, MessageBanner } from '@pglevy/sailwind'
import { createEntity } from '../api'

export default function ExampleForm() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // This calls the backend API, which executes a skill
      await createEntity({ name, description })
      // Navigate back to home on success
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-8 py-8">
        <HeadingField
          text="Example Form"
          size="LARGE"
          headingTag="H1"
          marginBelow="MORE"
        />

        {error && (
          <div className="mb-6">
            <MessageBanner
              primaryText={error}
              backgroundColor="ERROR"
              icon="error"
            />
          </div>
        )}

        <CardLayout padding="MORE" showShadow={true}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              value={name}
              onChange={setName}
              required={true}
              labelPosition="ABOVE"
              marginBelow="STANDARD"
              instructions="Enter a name for your entity"
            />

            <TextField
              label="Description"
              value={description}
              onChange={setDescription}
              required={false}
              labelPosition="ABOVE"
              marginBelow="MORE"
              instructions="Optional description"
            />

            <div className="flex gap-2 justify-end">
              <ButtonWidget
                label={isSubmitting ? "Creating..." : "Create"}
                style="SOLID"
                color="ACCENT"
                submit={true}
                disabled={isSubmitting}
              />
              <ButtonWidget
                label="Cancel"
                style="OUTLINE"
                color="SECONDARY"
                onClick={() => navigate('/')}
                disabled={isSubmitting}
              />
            </div>
          </form>
        </CardLayout>

        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> This form demonstrates the integration pattern.
            When submitted, it calls <code className="bg-gray-100 px-1 rounded">createEntity()</code> in
            api.ts, which posts to your backend API. The backend then executes the appropriate
            skill and returns the result.
          </p>
        </div>
      </div>
    </div>
  )
}
