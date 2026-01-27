import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import ExampleForm from './pages/example-form'
import PeopleList from './pages/people'
import PersonForm from './pages/person-form'
import StudyList from './pages/studies'
import StudyForm from './pages/study-form'
import StudyDetail from './pages/study-detail'
import SessionDetail from './pages/session-detail'
import MetricsDashboard from './pages/metrics'
import ReportGenerator from './pages/report'
import Settings from './pages/settings'

/**
 * Main Application Component
 * 
 * Sets up routing for all pages in the UX Metrics application.
 * 
 * **Validates: Requirements 1.3, 2.4**
 */
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-blue-50">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />
          
          {/* People Management */}
          <Route path="/people" element={<PeopleList />} />
          <Route path="/people/new" element={<PersonForm />} />
          <Route path="/people/:id/edit" element={<PersonForm />} />
          
          {/* Study Management */}
          <Route path="/studies" element={<StudyList />} />
          <Route path="/studies/new" element={<StudyForm />} />
          <Route path="/studies/:id" element={<StudyDetail />} />
          <Route path="/studies/:id/edit" element={<StudyForm />} />
          
          {/* Session Management */}
          <Route path="/sessions/:id" element={<SessionDetail />} />
          
          {/* Metrics and Reports */}
          <Route path="/metrics" element={<MetricsDashboard />} />
          <Route path="/reports" element={<ReportGenerator />} />
          
          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
          
          {/* Legacy/Example Routes */}
          <Route path="/example-form" element={<ExampleForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
