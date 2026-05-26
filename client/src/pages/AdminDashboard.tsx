import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Shield,
  Users,
  BarChart3,
  Activity,
  Settings,
  LogOut,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit2,
  UserX,
  UserCheck,
  Eye,
  X,
  Check,
  AlertTriangle,
  Clock,
  Briefcase,
  TrendingUp,
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { api } from '../lib/api'
import { User, AdminStats, ActivityItem, Corps, UserRole, CORPS_CONFIG } from '../types'

type Tab = 'users' | 'stats' | 'activity' | 'settings'

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrateur',
  INVESTIGATOR: 'Enquêteur',
  ANALYST: 'Analyste',
}

const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: 'bg-red-100 text-red-800',
  INVESTIGATOR: 'bg-blue-100 text-blue-800',
  ANALYST: 'bg-purple-100 text-purple-800',
}

const inp =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'

// ─── Edit User Modal ──────────────────────────────────────────────────────────

interface EditUserModalProps {
  user: User
  onClose: () => void
  onSave: (data: { role?: UserRole; corps?: Corps; active?: boolean }) => void
  loading: boolean
}

function EditUserModal({ user, onClose, onSave, loading }: EditUserModalProps) {
  const [role, setRole] = useState<UserRole>(user.role)
  const [corps, setCorps] = useState<Corps>(user.corps)

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">Modifier l'utilisateur</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="font-semibold text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
            <select
              className={inp}
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value="ADMIN">Administrateur</option>
              <option value="INVESTIGATOR">Enquêteur</option>
              <option value="ANALYST">Analyste</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Corps</label>
            <select
              className={inp}
              value={corps}
              onChange={(e) => setCorps(e.target.value as Corps)}
            >
              <option value="POLICE">Police Nationale</option>
              <option value="GENDARMERIE">Gendarmerie Nationale</option>
              <option value="DOUANE">Douane Nationale</option>
            </select>
          </div>

          {(role !== user.role || corps !== user.corps) && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                {role !== user.role && `Le rôle sera changé en ${ROLE_LABELS[role]}. `}
                {corps !== user.corps && `Le corps sera changé en ${CORPS_CONFIG[corps].label}.`}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => onSave({ role, corps })}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              'Enregistrement…'
            ) : (
              <>
                <Check className="w-4 h-4" />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string
  value: number | string
  icon: React.ElementType
  color: string
  sub?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────

function MiniBarChart({
  data,
  colors,
}: {
  data: { label: string; value: number }[]
  colors: string[]
}) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-28 flex-shrink-0 truncate">{d.label}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${colors[i % colors.length]}`}
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-gray-700 w-6 text-right">{d.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Users Tab ────────────────────────────────────────────────────────────────

function UsersTab() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('')
  const [corpsFilter, setCorpsFilter] = useState<Corps | ''>('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const limit = 20

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () =>
      api.get<{ users: User[]; total: number; page: number }>(
        `/admin/users?page=${page}&limit=${limit}`
      ),
  })

  const updateMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<User> }) =>
      api.patch<User>(`/admin/users/${userId}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      setEditingUser(null)
    },
  })

  const deactivateMutation = useMutation({
    mutationFn: (userId: string) => api.delete<{ success: boolean }>(`/admin/users/${userId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const reactivateMutation = useMutation({
    mutationFn: (userId: string) => api.patch<User>(`/admin/users/${userId}`, { active: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const users = data?.users ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / limit)

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    return (
      matchSearch &&
      (!roleFilter || u.role === roleFilter) &&
      (!corpsFilter || u.corps === corpsFilter)
    )
  })

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            placeholder="Rechercher par nom ou email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole | '')}
        >
          <option value="">Tous les rôles</option>
          <option value="ADMIN">Administrateur</option>
          <option value="INVESTIGATOR">Enquêteur</option>
          <option value="ANALYST">Analyste</option>
        </select>
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={corpsFilter}
          onChange={(e) => setCorpsFilter(e.target.value as Corps | '')}
        >
          <option value="">Tous les corps</option>
          <option value="POLICE">Police</option>
          <option value="GENDARMERIE">Gendarmerie</option>
          <option value="DOUANE">Douane</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-16 text-gray-400">Chargement…</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Utilisateur</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Rôle</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Corps</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Dernière connexion</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Affaires</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ${CORPS_CONFIG[u.corps].bg}`}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[u.role]}`}
                      >
                        {ROLE_LABELS[u.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium text-white ${CORPS_CONFIG[u.corps].bg}`}
                      >
                        {CORPS_CONFIG[u.corps].badge}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.active !== false ? (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-800">
                          Actif
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-500">
                          Inactif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {u.lastLogin
                        ? new Date(u.lastLogin).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {u._count?.cases ?? 0} membre · {u._count?.createdCases ?? 0} créées
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingUser(u)}
                          title="Modifier"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {u.active !== false ? (
                          <button
                            onClick={() => deactivateMutation.mutate(u.id)}
                            title="Désactiver"
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => reactivateMutation.mutate(u.id)}
                            title="Réactiver"
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500">
                {total} utilisateur{total !== 1 ? 's' : ''} au total
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-600 font-medium">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={(data) => updateMutation.mutate({ userId: editingUser.id, data })}
          loading={updateMutation.isPending}
        />
      )}
    </div>
  )
}

// ─── Stats Tab ────────────────────────────────────────────────────────────────

function StatsTab() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get<AdminStats>('/admin/stats'),
  })

  if (isLoading) return <div className="text-center py-16 text-gray-400">Chargement…</div>
  if (!stats) return null

  const statusOk = stats.systemStatus === 'operational'

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Utilisateurs totaux"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-100 text-blue-600"
          sub="Tous corps confondus"
        />
        <StatCard
          label="Affaires totales"
          value={stats.totalCases}
          icon={Briefcase}
          color="bg-purple-100 text-purple-600"
          sub="Toutes catégories"
        />
        <StatCard
          label="Actifs (24h)"
          value={stats.activeUsers24h}
          icon={TrendingUp}
          color="bg-green-100 text-green-600"
          sub="Connexions récentes"
        />
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">Statut système</p>
            <div
              className={`w-2.5 h-2.5 rounded-full ${statusOk ? 'bg-green-500' : 'bg-red-500'}`}
            />
          </div>
          <p className="text-2xl font-bold text-gray-900 capitalize">{stats.systemStatus}</p>
          <p className="text-xs text-gray-400 mt-1">
            {statusOk ? 'Tous les services opérationnels' : 'Vérifier les services'}
          </p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Users by role */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Utilisateurs par rôle</h3>
          <MiniBarChart
            data={[
              { label: 'Administrateur', value: stats.usersByRole.ADMIN },
              { label: 'Enquêteur', value: stats.usersByRole.INVESTIGATOR },
              { label: 'Analyste', value: stats.usersByRole.ANALYST },
            ]}
            colors={['bg-red-400', 'bg-blue-400', 'bg-purple-400']}
          />
        </div>

        {/* Users by corps */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Utilisateurs par corps</h3>
          <MiniBarChart
            data={[
              { label: 'Police Nationale', value: stats.usersByCorps.POLICE },
              { label: 'Gendarmerie', value: stats.usersByCorps.GENDARMERIE },
              { label: 'Douane', value: stats.usersByCorps.DOUANE },
            ]}
            colors={['bg-blue-500', 'bg-slate-500', 'bg-green-500']}
          />
        </div>

        {/* Cases by status */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Affaires par statut</h3>
          <MiniBarChart
            data={[
              { label: 'Ouvert', value: stats.casesByStatus.OPEN },
              { label: 'En cours', value: stats.casesByStatus.ACTIVE },
              { label: 'Clôturé', value: stats.casesByStatus.CLOSED },
              { label: 'Archivé', value: stats.casesByStatus.ARCHIVED },
            ]}
            colors={['bg-blue-400', 'bg-yellow-400', 'bg-green-400', 'bg-gray-400']}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Activity Tab ─────────────────────────────────────────────────────────────

function ActivityTab() {
  const [typeFilter, setTypeFilter] = useState<'all' | 'login' | 'case_created'>('all')

  const { data: activity = [], isLoading } = useQuery({
    queryKey: ['admin-activity'],
    queryFn: () => api.get<ActivityItem[]>('/admin/activity'),
    refetchInterval: 30_000,
  })

  const filtered =
    typeFilter === 'all' ? activity : activity.filter((a) => a.type === typeFilter)

  return (
    <div>
      <div className="flex gap-3 mb-5">
        {(['all', 'login', 'case_created'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              typeFilter === t
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t === 'all' ? 'Tout' : t === 'login' ? 'Connexions' : 'Affaires créées'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-400">Chargement…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Aucune activité récente</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-50">
          {filtered.map((item, i) => (
            <div key={i} className="flex items-start gap-4 px-5 py-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  item.type === 'login'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                {item.type === 'login' ? (
                  <UserCheck className="w-4 h-4" />
                ) : (
                  <Briefcase className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">{item.detail}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded font-medium text-white ${CORPS_CONFIG[item.corps].bg}`}
                  >
                    {CORPS_CONFIG[item.corps].badge}
                  </span>
                  {item.role && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-medium ${ROLE_COLORS[item.role]}`}
                    >
                      {ROLE_LABELS[item.role]}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                <Clock className="w-3 h-3" />
                {new Date(item.timestamp).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab() {
  const [systemOnline, setSystemOnline] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [registrationEnabled, setRegistrationEnabled] = useState(true)

  return (
    <div className="max-w-2xl space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        <ToggleSetting
          label="Statut du système"
          description="Active ou désactive l'accès à la plateforme"
          value={systemOnline}
          onChange={setSystemOnline}
          activeLabel="En ligne"
          inactiveLabel="Hors ligne"
          activeColor="bg-green-500"
        />
        <ToggleSetting
          label="Mode maintenance"
          description="Affiche un message de maintenance aux utilisateurs"
          value={maintenanceMode}
          onChange={setMaintenanceMode}
          activeLabel="Activé"
          inactiveLabel="Désactivé"
          activeColor="bg-amber-500"
        />
        <ToggleSetting
          label="Inscription des utilisateurs"
          description="Autorise les nouveaux utilisateurs à créer un compte"
          value={registrationEnabled}
          onChange={setRegistrationEnabled}
          activeLabel="Activée"
          inactiveLabel="Désactivée"
          activeColor="bg-blue-500"
        />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Ces paramètres sont gérés localement pour cette session. Une intégration backend
            complète peut être ajoutée selon les besoins opérationnels.
          </p>
        </div>
      </div>
    </div>
  )
}

function ToggleSetting({
  label,
  description,
  value,
  onChange,
  activeLabel,
  inactiveLabel,
  activeColor,
}: {
  label: string
  description: string
  value: boolean
  onChange: (v: boolean) => void
  activeLabel: string
  inactiveLabel: string
  activeColor: string
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div>
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500">{value ? activeLabel : inactiveLabel}</span>
        <button
          onClick={() => onChange(!value)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            value ? activeColor : 'bg-gray-200'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              value ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  )
}

// ─── Main AdminDashboard ──────────────────────────────────────────────────────

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()
  const [activeTab, setActiveTab] = useState<Tab>('users')

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'stats', label: 'Statistiques', icon: BarChart3 },
    { id: 'activity', label: 'Activité', icon: Activity },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-xl">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 leading-tight">Panneau d'administration</p>
              <p className="text-xs text-gray-400">Système d'Investigation — République de Guinée</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate('/cases')}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm transition-colors"
            >
              <Eye className="w-4 h-4" />
              Affaires
            </button>
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-400">
                    <span className="text-red-600 font-medium">ADMIN</span>
                    {user.grade ? ` · ${user.grade}` : ''}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm bg-red-600">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            <button
              onClick={() => {
                clearAuth()
                navigate('/login', { replace: true })
              }}
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-7xl mx-auto flex gap-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'stats' && <StatsTab />}
        {activeTab === 'activity' && <ActivityTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  )
}
