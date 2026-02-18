import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { EventsProvider } from './context/EventsContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CalendarPage from './pages/CalendarPage'
import EventDetailPage from './pages/EventDetailPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <EventsProvider>
          <div className="min-h-screen flex flex-col bg-charcoal-950">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/event/:id" element={<EventDetailPage />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </EventsProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md bg-paper border-4 border-charcoal-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-10 transform rotate-1 relative">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none mix-blend-multiply"></div>
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-tape-yellow/90 border border-charcoal-900/10 transform -rotate-1 shadow-sm z-20"></div>
        <h1 className="font-heading text-6xl font-bold text-charcoal-900 mb-2 relative z-10">404</h1>
        <p className="font-typewriter text-charcoal-600 mb-6 relative z-10">This flyer blew away. Nothing here!</p>
        <Link
          to="/"
          className="btn-sticker relative z-10"
        >
          Back to Board
        </Link>
      </div>
    </div>
  )
}
