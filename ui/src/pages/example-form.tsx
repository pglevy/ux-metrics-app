import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeadingField, CardLayout, TextField, ButtonWidget, MessageBanner } from '@pglevy/sailwind'

/**
 * Example Form Page
 *
 * This demonstrates the form pattern using Sailwind components.
 * Wire up your API client (see src/api.ts) once you have your schema defined.
 */
export default function ExampleForm() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Replace with actual API call once schema is defined
    // Example:
    // await createEntity({ name, description })

    console.log('Form submitted:', { name, description })
    setSubmitted(true)
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

        {submitted && (
          <div className="mb-6">
            <MessageBanner
              primaryText="Form submitted! (Demo only - wire up your API in src/api.ts)"
              backgroundColor="POSITIVE"
              icon="success"
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
                label="Create"
                style="SOLID"
                color="ACCENT"
                submit={true}
              />
              <ButtonWidget
                label="Cancel"
                style="OUTLINE"
                color="SECONDARY"
                onClick={() => navigate('/')}
              />
            </div>
          </form>
        </CardLayout>

        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> This form demonstrates the UI pattern.
            To make it functional, define your schema and wire up the API client in
            <code className="bg-gray-100 px-1 rounded mx-1">src/api.ts</code>.
          </p>
        </div>
      </div>
    </div>
  )
}
