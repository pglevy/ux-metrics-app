import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import ExampleForm from './pages/example-form'
import PeopleList from './pages/people'
import PersonForm from './pages/person-form'
import StudyList from './pages/studies'
import StudyForm from './pages/study-form'
import SessionDetail from './pages/session-detail'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-blue-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/example-form" element={<ExampleForm />} />
          <Route path="/people" element={<PeopleList />} />
          <Route path="/people/new" element={<PersonForm />} />
          <Route path="/people/:id/edit" element={<PersonForm />} />
          <Route path="/studies" element={<StudyList />} />
          <Route path="/studies/new" element={<StudyForm />} />
          <Route path="/studies/:id/edit" element={<StudyForm />} />
          {/* Placeholder route for study detail - to be implemented in later tasks */}
          <Route path="/studies/:id" element={<div className="p-8">Study Detail - Coming Soon</div>} />
          {/* Session detail route */}
          <Route path="/sessions/:id" element={<SessionDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
