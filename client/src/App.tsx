import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import LoginPage from './pages/LoginPage'
import CasesPage from './pages/CasesPage'
import CanvasPage from './pages/CanvasPage'

export default function App() {
  const token = useAuthStore((s) => s.token)
  return (
    <Routes>
      <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/cases" replace />} />
      <Route path="/cases" element={token ? <CasesPage /> : <Navigate to="/login" replace />} />
      <Route path="/cases/:caseId" element={token ? <CanvasPage /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={token ? '/cases' : '/login'} replace />} />
    </Routes>
  )
}
