import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, UserRole } from '../types'
import { hasPermission, canEdit, isReadOnly, type Permission } from '../utils/permissions'

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  // Permission helpers
  can: (permission: Permission) => boolean
  canEditData: () => boolean
  readOnly: () => boolean
  role: () => UserRole | undefined
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null }),
      can: (permission) => hasPermission(get().user?.role, permission),
      canEditData: () => canEdit(get().user?.role),
      readOnly: () => isReadOnly(get().user?.role),
      role: () => get().user?.role,
    }),
    { name: 'guinee-auth' }
  )
)

export default useAuthStore
