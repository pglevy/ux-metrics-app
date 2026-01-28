import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeadingField, CardLayout, RichTextDisplayField, ButtonWidget } from '@pglevy/sailwind'
import { loadSeedDataIfEmpty } from '../data/seedData'
import { getAllStudies } from '../services/studyService'
import { getByRole } from '../services/personService'
import StatCard from '../components/StatCard'

/**
 * Home Page
 *
 * Main landing page with navigation to all sections of the application.
 * Displays key statistics and quick actions.
 *
 * **Validates: Requirements 1.3, 13.6**
 */

export default function Home() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    activeStudies: 0,
    completedSessions: 0,
    participants: 0,
    reports: 0
  })

  useEffect(() => {
    loadSeedDataIfEmpty()

    // Calculate stats
    const studies = getAllStudies()
    const activeStudies = studies.filter(s => !s.archived).length
    const participants = getByRole('participant').length

    setStats({
      activeStudies,
      completedSessions: 0, // Would come from session service
      participants,
      reports: 0 // Would come from report service
    })
  }, [])

  return (
    <div className="with-sidebar min-h-screen page-animate">
      <div className="container mx-auto px-8 py-8">
        {/* Header */}
        <header className="mb-8" style={{ animation: 'fadeInDown 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <h1 className="text-3xl font-semibold mb-2" style={{
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em'
          }}>
            Welcome back
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Track and analyze usability testing metrics for your research studies
          </p>
        </header>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="border rounded-lg" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)', padding: '24px', boxShadow: 'var(--shadow-md)', transition: 'all var(--transition-base)' }}>
            <StatCard
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="4" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
              }
              label="Active Studies"
              value={stats.activeStudies}
              subtitle="Currently running"
              variant="blue"
            />
          </div>

          <div className="border rounded-lg" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)', padding: '24px', boxShadow: 'var(--shadow-md)', transition: 'all var(--transition-base)' }}>
            <StatCard
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 18L9 13L13 16L20 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="4" cy="18" r="2" fill="currentColor"/>
                  <circle cx="9" cy="13" r="2" fill="currentColor"/>
                  <circle cx="13" cy="16" r="2" fill="currentColor"/>
                  <circle cx="20" cy="9" r="2" fill="currentColor"/>
                </svg>
              }
              label="Sessions Completed"
              value={stats.completedSessions}
              subtitle="Total sessions"
              variant="green"
            />
          </div>

          <div className="border rounded-lg" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)', padding: '24px', boxShadow: 'var(--shadow-md)', transition: 'all var(--transition-base)' }}>
            <StatCard
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="9" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M4 21C4 16.5 7.5 15 12 15C16.5 15 20 16.5 20 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              }
              label="Participants"
              value={stats.participants}
              subtitle="Total enrolled"
              variant="purple"
            />
          </div>

          <div className="border rounded-lg" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)', padding: '24px', boxShadow: 'var(--shadow-md)', transition: 'all var(--transition-base)' }}>
            <StatCard
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="9" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="9" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="9" y1="17" x2="12" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              }
              label="Reports Generated"
              value={stats.reports}
              subtitle="All time"
              variant="orange"
            />
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Navigation Cards */}
          <div className="space-y-4 card-animate" style={{ animationDelay: '0.25s' }}>
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
          </div>

          {/* Quick Actions */}
          <div className="space-y-4 card-animate" style={{ animationDelay: '0.3s' }}>
            <CardLayout padding="MORE" showShadow={true}>
              <HeadingField
                text="Quick Actions"
                size="MEDIUM"
                headingTag="H2"
                marginBelow="STANDARD"
              />
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/studies/new')}
                  className="action-item w-full flex items-center gap-4 p-4 rounded-lg"
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div className="icon-gradient-blue w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                      Create New Study
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Set up a new usability testing study
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/people/new')}
                  className="action-item w-full flex items-center gap-4 p-4 rounded-lg"
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div className="icon-gradient-green w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M4 17C4 14 6.5 13 10 13C13.5 13 16 14 16 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                      Add Participant
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Register a new participant for testing
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/reports')}
                  className="action-item w-full flex items-center gap-4 p-4 rounded-lg"
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div className="icon-gradient-purple w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="4" y="3" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                      <line x1="7" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="7" y1="10" x2="13" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                      Generate Report
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Create a summary report with visualizations
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/metrics')}
                  className="action-item w-full flex items-center gap-4 p-4 rounded-lg"
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div className="icon-gradient-orange w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M3 14L7 10L11 13L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="3" cy="14" r="1.5" fill="currentColor"/>
                      <circle cx="7" cy="10" r="1.5" fill="currentColor"/>
                      <circle cx="11" cy="13" r="1.5" fill="currentColor"/>
                      <circle cx="17" cy="7" r="1.5" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                      View Metrics Dashboard
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Explore aggregated metrics and trends
                    </div>
                  </div>
                </button>
              </div>
            </CardLayout>
          </div>
        </div>

        {/* Getting Started Guide */}
        <section className="card-animate" style={{ animationDelay: '0.35s' }}>
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField
              text="Getting Started"
              size="MEDIUM"
              headingTag="H2"
              marginBelow="STANDARD"
            />
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Follow these steps to begin tracking usability metrics
            </p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { num: 1, title: 'Create a Study', desc: 'Define your research goals' },
                { num: 2, title: 'Add People', desc: 'Register participants' },
                { num: 3, title: 'Create Sessions', desc: 'Schedule testing sessions' },
                { num: 4, title: 'Administer Assessments', desc: 'Capture metrics' },
                { num: 5, title: 'Analyze & Report', desc: 'View aggregated data' },
              ].map((step) => (
                <div key={step.num} className="text-center">
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-bold font-mono"
                    style={{
                      background: 'linear-gradient(135deg, #EDEEFA, #F5F5FC)',
                      color: '#152B99'
                    }}
                  >
                    {step.num}
                  </div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                    {step.title}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </CardLayout>
        </section>
      </div>
    </div>
  )
}
