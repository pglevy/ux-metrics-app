import { useNavigate } from 'react-router-dom'
import { HeadingField, CardLayout, RichTextDisplayField, ButtonWidget } from '@pglevy/sailwind'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-8 py-8">
        <HeadingField
          text="Schema-First Starter"
          size="LARGE"
          headingTag="H1"
          marginBelow="MORE"
        />

        <CardLayout padding="MORE" showShadow={true}>
          <HeadingField
            text="Welcome"
            size="MEDIUM"
            headingTag="H2"
            marginBelow="STANDARD"
          />

          <RichTextDisplayField
            value={[
              "This is a clean starter template for Schema-First prototyping.",
              "",
              "Build your prototype while AI maintains your API contract and concept model automatically.",
              "Uses Sailwind components with Aurora color palette."
            ]}
            marginBelow="MORE"
          />

          <HeadingField
            text="Getting Started"
            size="MEDIUM"
            headingTag="H3"
            marginBelow="STANDARD"
          />

          <RichTextDisplayField
            value={[
              "1. Define your schema in schema/api-contract.yaml",
              "2. Create pages for your domain",
              "3. Generate types from your schema",
              "4. Build your prototype using those types",
              "",
              "See examples/ticketing-system/ for a complete working example!"
            ]}
            marginBelow="MORE"
          />

          <ButtonWidget
            label="View Example Form"
            style="OUTLINE"
            color="ACCENT"
            onClick={() => navigate('/example-form')}
          />
        </CardLayout>

        <div className="mt-6">
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField
              text="Next Steps"
              size="MEDIUM"
              headingTag="H3"
              marginBelow="STANDARD"
            />

            <RichTextDisplayField
              value={[
                "1. Explore examples/ticketing-system/ to see the workflow",
                "2. Define your initial schema in schema/api-contract.yaml",
                "3. Generate types from your schema",
                "4. Create pages for your domain",
                "5. Use /schema-evolution, /concept-sync, /contract-validator skills as you build"
              ]}
            />
          </CardLayout>
        </div>
      </div>
    </div>
  )
}
