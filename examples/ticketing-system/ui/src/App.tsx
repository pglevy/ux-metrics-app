import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Tickets from './pages/tickets'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-blue-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tickets" element={<Tickets />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
