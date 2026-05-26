import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import CasesPage from './pages/CasesPage'
import CanvasPage from './pages/CanvasPage'
import AboutPage from './pages/AboutPage'
import ProductPage from './pages/ProductPage'
import ContactPage from './pages/ContactPage'
import FAQPage from './pages/FAQPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'

export default function App() {
  const token = useAuthStore((s) => s.token)
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/product" element={<ProductPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FAQPage />} />

      {/* Auth */}
      <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/cases" replace />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected app */}
      <Route path="/cases" element={token ? <CasesPage /> : <Navigate to="/login" replace />} />
      <Route path="/cases/:caseId" element={token ? <CanvasPage /> : <Navigate to="/login" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
