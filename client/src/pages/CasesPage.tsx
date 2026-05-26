import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus,
  Search,
  ChevronRight,
  FolderOpen,
  Network,
  Users,
  SlidersHorizontal,
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { api } from '../lib/api'
import { Case, CaseStatus, CORPS_CONFIG, STATUS_CONFIG } from '../types'
import Layout from '../components/Layout'

export default function CasesPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { t } = useLanguage()

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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Page header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t.cases.title}</h1>
            <p className="text-sm text-slate-500 mt-1">
              {cases.length}{' '}
              {cases.length !== 1 ? t.cases.subtitlePlural : t.cases.subtitle}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #CE1126, #A50D1E)' }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t.cases.newCase}</span>
            <span className="sm:hidden">+</span>
          </button>
        </div>

        {/* Filters bar */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 transition-colors"
              style={{ '--tw-ring-color': '#CE1126' } as React.CSSProperties}
              placeholder={t.cases.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none bg-white text-slate-700 cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as CaseStatus | '')}
            >
              <option value="">{t.cases.allStatuses}</option>
              {(Object.keys(STATUS_CONFIG) as CaseStatus[]).map((s) => (
                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cases grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
                <div className="h-3 bg-slate-100 rounded w-1/3 mb-3" />
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-full mb-4" />
                <div className="flex gap-2">
                  <div className="h-5 bg-slate-100 rounded-full w-16" />
                  <div className="h-5 bg-slate-100 rounded-full w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-600 font-semibold text-lg">{t.cases.noResults}</p>
            <p className="text-slate-400 text-sm mt-1">
              {search || statusFilter ? t.cases.noResultsHint : t.cases.noResultsEmpty}
            </p>
            {!search && !statusFilter && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-5 inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #CE1126, #A50D1E)' }}
              >
                <Plus className="w-4 h-4" />
                {t.cases.newCase}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <CaseCard key={c.id} case_={c} onClick={() => navigate(`/cases/${c.id}`)} t={t} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <NewCaseModal
          onClose={() => setShowModal(false)}
          onSubmit={createMutation.mutate}
          loading={createMutation.isPending}
          error={createMutation.error?.message}
          t={t}
        />
      )}
    </Layout>
  )
}

// ─── Case Card ────────────────────────────────────────────────────────────────

interface CaseCardProps {
  case_: Case
  onClick: () => void
  t: any
}

function CaseCard({ case_: c, onClick, t }: CaseCardProps) {
  const cfg = CORPS_CONFIG[c.corps]
  const sCfg = STATUS_CONFIG[c.status]

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 p-5 text-left hover:shadow-md hover:border-slate-300 transition-all group w-full"
    >
      {/* Top accent bar */}
      <div className="h-0.5 rounded-full mb-4 -mx-5 -mt-5 rounded-t-xl"
        style={{ background: `linear-gradient(90deg, ${cfg.bg === 'bg-blue-700' ? '#1D4ED8' : cfg.bg === 'bg-slate-700' ? '#334155' : '#007A5E'}, transparent)` }}
      />

      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-xs text-slate-400 font-mono tracking-wide">{c.reference}</p>
          <h3 className="font-semibold text-slate-900 mt-0.5 line-clamp-2 leading-snug text-sm">
            {c.title}
          </h3>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-guinea-red flex-shrink-0 mt-1 transition-colors" />
      </div>

      {c.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">{c.description}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap mt-2">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sCfg.color}`}>
          {sCfg.label}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium text-white ${cfg.bg}`}>
          {cfg.badge}
        </span>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Network className="w-3.5 h-3.5" />
          {c._count?.nodes ?? 0} {t.cases.nodes}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {c._count?.members ?? 0}{' '}
          {(c._count?.members ?? 0) !== 1 ? t.cases.membersPlural : t.cases.members}
        </span>
        <span className="ml-auto">
          {new Date(c.updatedAt).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>
    </button>
  )
}

// ─── New Case Modal ───────────────────────────────────────────────────────────

interface NewCaseModalProps {
  onClose: () => void
  onSubmit: (data: { title: string; description: string; reference: string }) => void
  loading: boolean
  error?: string
  t: any
}

function NewCaseModal({ onClose, onSubmit, loading, error, t }: NewCaseModalProps) {
  const [form, setForm] = useState({ title: '', description: '', reference: '' })

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #CE1126, #A50D1E)' }}>
            <Plus className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">{t.cases.newCaseTitle}</h3>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); onSubmit(form) }}
          className="space-y-4"
        >
          <div>
            <label className="label">
              {t.cases.reference} <span className="text-red-500">*</span>
            </label>
            <input
              className="input"
              required
              value={form.reference}
              onChange={set('reference')}
              placeholder={t.cases.referencePlaceholder}
            />
          </div>
          <div>
            <label className="label">
              {t.cases.caseTitle} <span className="text-red-500">*</span>
            </label>
            <input
              className="input"
              required
              value={form.title}
              onChange={set('title')}
              placeholder={t.cases.caseTitlePlaceholder}
            />
          </div>
          <div>
            <label className="label">{t.cases.description}</label>
            <textarea
              className="input resize-none"
              rows={3}
              value={form.description}
              onChange={set('description')}
              placeholder={t.cases.descriptionPlaceholder}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-300 text-slate-700 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              {t.cases.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 text-white py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #CE1126, #A50D1E)' }}
            >
              {loading ? t.cases.creating : t.cases.create}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
