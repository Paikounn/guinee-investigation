import { useState } from 'react'
import { useNavigate, Link } { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, Search, LogOut, Shield, Users, Network,
  ChevronRight, FolderOpen, X, AlertCircle, Clock,
} from 'lucide-react'
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
    const matchSearch = !q || c.title.toLowerCase().includes(q) || c.reference.toLowerCase().includes(q)
    return matchSearch && (!statusFilter || c.status === statusFilter)
  })

  const corpsConfig = user ? CORPS_CONFIG[user.corps] : null

  // Stats
  const open = cases.filter((c) => c.status === 'OPEN').length
  const active = cases.filter((c) => c.status === 'ACTIVE').length

  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col">
      {/* Header */}
      <header className="bg-[#0b1020] border-b border-slate-800/60 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="font-bold text-white leading-tight tracking-tight text-sm">
                Guinée Investigation
              </p>
              <p className="text-xs text-slate-500">République de Guinée — Sécurité Nationale</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-lg">
              Affaires
            </span>
          </nav>

          <div className="flex items-center gap-5">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-white leading-tight">{user.name}</p>
                  <p className="text-xs text-slate-500">
                    {user.grade ? `${user.grade} · ` : ''}{corpsConfig?.label}
                  </p>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs border ${corpsConfig?.border ?? 'border-slate-600'} bg-slate-800`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            <a
              href="/faq"
              className="flex items-center gap-1.5 text-slate-500 hover:text-yellow-400 text-sm transition-colors mr-2"
              title="Guide d'utilisation"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
              <span className="hidden sm:inline">Guide</span>
            </a>
            <button
              onClick={() => { clearAuth(); navigate('/login', { replace: true }) }}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Top row */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Affaires</h1>
            <p className="text-slate-500 text-sm mt-1">
              {cases.length} affaire{cases.length !== 1 ? 's' : ''} dans votre corps
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            Nouvelle affaire
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total affaires', value: cases.length, color: 'text-white' },
            { label: 'Ouvertes', value: open, color: 'text-cyan-400' },
            { label: 'En cours', value: active, color: 'text-amber-400' },
            { label: 'Clôturées', value: cases.filter((c) => c.status === 'CLOSED').length, color: 'text-emerald-400' },
          ].map((s) => (
            <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-colors"
              placeholder="Rechercher par titre ou référence…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-colors"
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
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-slate-700 border-t-cyan-400 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-7 h-7 text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium">Aucune affaire trouvée</p>
            <p className="text-slate-600 text-sm mt-1">
              {search || statusFilter ? 'Modifiez vos filtres' : 'Créez votre première affaire'}
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
      className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 text-left transition-all hover:shadow-xl hover:shadow-black/40 w-full"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="text-xs text-slate-600 font-mono tracking-widest uppercase mb-1">{c.reference}</p>
          <h3 className="font-semibold text-white leading-snug line-clamp-2 group-hover:text-cyan-300 transition-colors">
            {c.title}
          </h3>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-cyan-400 flex-shrink-0 mt-1 transition-colors" />
      </div>

      {c.description && (
        <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">{c.description}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium ${sCfg.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sCfg.dot} flex-shrink-0`} />
          {sCfg.label}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${cfg.bg}`}>
          {cfg.badge}
        </span>
      </div>

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-800 text-xs text-slate-600">
        <span className="flex items-center gap-1.5">
          <Network className="w-3.5 h-3.5" />
          {c._count?.nodes ?? 0} nœuds
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          {c._count?.members ?? 0} membre{(c._count?.members ?? 0) !== 1 ? 's' : ''}
        </span>
        <span className="ml-auto flex items-center gap-1">
          <Clock className="w-3 h-3" />
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
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0d1223] border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Nouvelle affaire</h3>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
          <ModalField label="Référence *">
            <input className={minp} required value={form.reference} onChange={set('reference')} placeholder="AFF-2026-001" />
          </ModalField>
          <ModalField label="Titre *">
            <input className={minp} required value={form.title} onChange={set('title')} placeholder="Intitulé de l'affaire" />
          </ModalField>
          <ModalField label="Description">
            <textarea className={minp + ' resize-none'} rows={3} value={form.description} onChange={set('description')} placeholder="Description de l'affaire…" />
          </ModalField>

          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-900 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />Création…</>
              ) : "Créer l'affaire"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ModalField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const minp =
  'w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-colors'
