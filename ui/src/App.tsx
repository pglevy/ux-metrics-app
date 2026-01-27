import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import ExampleForm from './pages/example-form'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-blue-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/example-form" element={<ExampleForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
