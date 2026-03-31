import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AnimatePresence } from 'framer-motion'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import FarmerDashboard from './pages/FarmerDashboard'
import CropRecommendation from './pages/CropRecommendation'
import DiseaseDetection from './pages/DiseaseDetection'
import WeatherPage from './pages/WeatherPage'
import AdminDashboard from './pages/AdminDashboard'
import CropRequirements from './pages/CropRequirements'
import SatelliteSuggestion from './pages/SatelliteSuggestion'
import PestDetection from './pages/PestDetection'
import FertilizerRecommendation from './pages/FertilizerRecommendation'
import MarketPrice from './pages/MarketPrice'
import FarmMap from './pages/FarmMap'
import Community from './pages/Community'
import VoiceAssistant from './components/VoiceAssistant'
import Navbar from './components/Navbar'
import { LanguageProvider } from './context/LanguageContext'
import ErrorBoundary from './components/ErrorBoundary'
import WhatsAppButton from './components/WhatsAppButton'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="spinner w-12 h-12" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><FarmerDashboard /></ProtectedRoute>} />
        <Route path="/crop-recommendation" element={<ProtectedRoute><CropRecommendation /></ProtectedRoute>} />
        <Route path="/disease-detection" element={<ProtectedRoute><DiseaseDetection /></ProtectedRoute>} />
        <Route path="/pest-detection" element={<ProtectedRoute><PestDetection /></ProtectedRoute>} />
        <Route path="/fertilizer" element={<ProtectedRoute><FertilizerRecommendation /></ProtectedRoute>} />
        <Route path="/market" element={<ProtectedRoute><MarketPrice /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><FarmMap /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/weather" element={<ProtectedRoute><WeatherPage /></ProtectedRoute>} />
        <Route path="/satellite" element={<ProtectedRoute><SatelliteSuggestion /></ProtectedRoute>} />
        <Route path="/crop-requirements" element={<ProtectedRoute><CropRequirements /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <VoiceAssistant />
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <div className="min-h-screen bg-[#0a2010]">
              <Navbar />
              <AppRoutes />
              <WhatsAppButton />
            </div>
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  )
}
