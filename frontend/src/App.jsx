import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import CuppingForm from './pages/CuppingForm'
import Results from './pages/Results'
import Standards from './pages/Standards'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-coffee-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cupping" element={<CuppingForm />} />
            <Route path="/results/:noteId" element={<Results />} />
            <Route path="/standards" element={<Standards />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
