import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeadingField, CardLayout, RichTextDisplayField, ButtonWidget } from '@pglevy/sailwind'
import { loadSeedDataIfEmpty } from '../data/seedData'

/**
 * Home Page
 * 
 * Main landing page with navigation to all sections of the application.
 * Loads seed data on first visit if storage is empty.
 * 
 * **Validates: Requirements 1.3, 13.6**
 */

export default function Home() {
  const navigate = useNavigate()

  // Load seed data on first visit if storage is empty
  useEffect(() => {
    loadSeedDataIfEmpty()
  }, [])

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-8 py-8">
        <HeadingField
          text="UX Metrics"
          size="LARGE"
          headingTag="H1"
          marginBelow="STANDARD"
        />
        <RichTextDisplayField
          value={['Capture and analyze usability testing metrics for your studies.']}
          marginBelow="MORE"
        />

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Studies */}
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField
              text="Studies"
              size="MEDIUM"
              headingTag="H2"
              marginBelow="STANDARD"
            />
            <RichTextDisplayField
              value={[
                'Create and manage usability studies.',
                'Track sessions and assessments for each study.',
              ]}
              marginBelow="MORE"
            />
            <ButtonWidget
              label="View Studies"
              style="SOLID"
              color="ACCENT"
              onClick={() => navigate('/studies')}
            />
          </CardLayout>

          {/* People */}
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField
              text="People"
              size="MEDIUM"
              headingTag="H2"
              marginBelow="STANDARD"
            />
            <RichTextDisplayField
              value={[
                'Manage participants, facilitators, and observers.',
                'Assign people to sessions.',
              ]}
              marginBelow="MORE"
            />
            <ButtonWidget
              label="View People"
              style="SOLID"
              color="ACCENT"
              onClick={() => navigate('/people')}
            />
          </CardLayout>

          {/* Metrics Dashboard */}
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField
              text="Metrics"
              size="MEDIUM"
              headingTag="H2"
              marginBelow="STANDARD"
            />
            <RichTextDisplayField
              value={[
                'View aggregated metrics and trends.',
                'Filter by study, participant, or date range.',
              ]}
              marginBelow="MORE"
            />
            <ButtonWidget
              label="View Metrics"
              style="SOLID"
              color="ACCENT"
              onClick={() => navigate('/metrics')}
            />
          </CardLayout>

          {/* Reports */}
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField
              text="Reports"
              size="MEDIUM"
              headingTag="H2"
              marginBelow="STANDARD"
            />
            <RichTextDisplayField
              value={[
                'Generate shareable reports with visualizations.',
                'Export as JSON for further analysis.',
              ]}
              marginBelow="MORE"
            />
            <ButtonWidget
              label="Generate Report"
              style="SOLID"
              color="ACCENT"
              onClick={() => navigate('/reports')}
            />
          </CardLayout>

          {/* Settings */}
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField
              text="Settings"
              size="MEDIUM"
              headingTag="H2"
              marginBelow="STANDARD"
            />
            <RichTextDisplayField
              value={[
                'Backup and restore your data.',
                'Reset to demonstration data.',
              ]}
              marginBelow="MORE"
            />
            <ButtonWidget
              label="Open Settings"
              style="OUTLINE"
              color="NEUTRAL"
              onClick={() => navigate('/settings')}
            />
          </CardLayout>
        </div>

        {/* Quick Stats - could be enhanced later */}
        <div className="mt-8">
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField
              text="Getting Started"
              size="MEDIUM"
              headingTag="H2"
              marginBelow="STANDARD"
            />
            <RichTextDisplayField
              value={[
                '1. Create a Study to organize your usability testing',
                '2. Add People (participants, facilitators, observers)',
                '3. Create Sessions within your study',
                '4. Administer Assessments during each session',
                '5. View Metrics and generate Reports',
              ]}
            />
          </CardLayout>
        </div>
      </div>
    </div>
  )
}
