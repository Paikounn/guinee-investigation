import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, LogOut, Shield, Users, Network, ChevronRight, FolderOpen } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { api } from '../lib/api'
import { Case, CaseStatus, CORPS_CONFIG, STATUS_CONFIG } from '../types'

export default function CasesPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { user, clearAuth } = useAuthStore()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<CaseStatus | ''>('')
  const [showModal, setShowModal] = useState(false)

  const { data: cases = [], isLoading } = useQuery({
    queryKey: ['cases'],
    queryFn: () => api.get<Case[]>('/cases'),
  })

  const createMutation = useMutation({
    mutationFn: (data: { title: string; description: string; reference: string }) =>
      api.post<Case>('/cases', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cases'] })
      setShowModal(false)
    },
  })

  const filtered = cases.filter((c) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q || c.title.toLowerCase().includes(q) || c.reference.toLowerCase().includes(q)
    return matchSearch && (!statusFilter || c.status === statusFilter)
  })

  const corpsConfig = user ? CORPS_CONFIG[user.corps] : null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 leading-tight">Système d'Investigation</p>
              <p className="text-xs text-gray-400">République de Guinée</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-400">
                    {user.grade ? `${user.grade} · ` : ''}
                    {corpsConfig?.label}
                  </p>
                </div>
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${corpsConfig?.bg ?? 'bg-gray-500'}`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            <button
              onClick={() => { clearAuth(); navigate('/login', { replace: true }) }}
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Affaires</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {cases.length} affaire{cases.length !== 1 ? 's' : ''} dans votre corps
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nouvelle affaire
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Rechercher par titre ou référence…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CaseStatus | '')}
          >
            <option value="">Tous les statuts</option>
            {(Object.keys(STATUS_CONFIG) as CaseStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">Aucune affaire trouvée</p>
            <p className="text-gray-400 text-sm mt-1">
              {search || statusFilter
                ? 'Essayez de modifier vos filtres'
                : 'Créez votre première affaire'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <CaseCard key={c.id} case_={c} onClick={() => navigate(`/cases/${c.id}`)} />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <NewCaseModal
          onClose={() => setShowModal(false)}
          onSubmit={createMutation.mutate}
          loading={createMutation.isPending}
          error={createMutation.error?.message}
        />
      )}
    </div>
  )
}

function CaseCard({ case_: c, onClick }: { case_: Case; onClick: () => void }) {
  const cfg = CORPS_CONFIG[c.corps]
  const sCfg = STATUS_CONFIG[c.status]

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:shadow-md hover:border-blue-200 transition-all group w-full"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-xs text-gray-400 font-mono tracking-wide">{c.reference}</p>
          <h3 className="font-semibold text-gray-900 mt-0.5 line-clamp-2 leading-snug">
            {c.title}
          </h3>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 flex-shrink-0 mt-1 transition-colors" />
      </div>

      {c.description && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{c.description}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap mt-2">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sCfg.color}`}>
          {sCfg.label}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium text-white ${cfg.bg}`}>
          {cfg.badge}
        </span>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Network className="w-3.5 h-3.5" />
          {c._count?.nodes ?? 0} nœuds
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {c._count?.members ?? 0} membre{(c._count?.members ?? 0) !== 1 ? 's' : ''}
        </span>
        <span className="ml-auto">
          {new Date(c.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      </div>
    </button>
  )
}

interface NewCaseModalProps {
  onClose: () => void
  onSubmit: (data: { title: string; description: string; reference: string }) => void
  loading: boolean
  error?: string
}

function NewCaseModal({ onClose, onSubmit, loading, error }: NewCaseModalProps) {
  const [form, setForm] = useState({ title: '', description: '', reference: '' })

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-5">Nouvelle affaire</h3>
        <form
          onSubmit={(e) => { e.preventDefault(); onSubmit(form) }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Référence <span className="text-red-500">*</span>
            </label>
            <input
              className={inp}
              required
              value={form.reference}
              onChange={set('reference')}
              placeholder="AFF-2026-001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              className={inp}
              required
              value={form.title}
              onChange={set('title')}
              placeholder="Intitulé de l'affaire"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className={inp + ' resize-none'}
              rows={3}
              value={form.description}
              onChange={set('description')}
              placeholder="Description de l'affaire…"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? 'Création…' : 'Créer l\'affaire'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const inp =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
