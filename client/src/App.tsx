import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CasesPage from './pages/CasesPage'
import CanvasPage from './pages/CanvasPage'
import AdminDashboard from './pages/AdminDashboard'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'ADMIN'

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={!token ? <LoginPage /> : <Navigate to="/dashboard" replace />}
      />

      {/* Protected */}
      <Route
        path="/dashboard"
        element={token ? <DashboardPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/cases"
        element={token ? <CasesPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/cases/:caseId"
        element={token ? <CanvasPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/admin"
        element={token && isAdmin ? <AdminDashboard /> : <Navigate to={token ? '/dashboard' : '/login'} replace />}
      />
      <Route
        path="/settings"
        element={token ? <SettingsPage /> : <Navigate to="/login" replace />}
      />

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to={token ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  )
}
