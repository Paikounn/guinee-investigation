import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  FolderOpen,
  Activity,
  CheckCircle2,
  Archive,
  Plus,
  ArrowRight,
  Network,
  Users,
  TrendingUp,
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useLanguage } from '../contexts/LanguageContext'
import { api } from '../lib/api'
import { Case, CORPS_CONFIG, STATUS_CONFIG } from '../types'
import Layout from '../components/Layout'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { t } = useLanguage()

  const { data: cases = [], isLoading } = useQuery({
    queryKey: ['cases'],
    queryFn: () => api.get<Case[]>('/cases'),
  })

  const totalCases = cases.length
  const activeCases = cases.filter((c) => c.status === 'ACTIVE').length
  const openCases = cases.filter((c) => c.status === 'OPEN').length
  const closedCases = cases.filter((c) => c.status === 'CLOSED').length
  const totalNodes = cases.reduce((sum, c) => sum + (c._count?.nodes ?? 0), 0)

  const recentCases = [...cases]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  const corpsConfig = user ? CORPS_CONFIG[user.corps] : null

  const stats = [
    {
      label: t.dashboard.totalCases,
      value: totalCases,
      icon: FolderOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: t.dashboard.activeCases,
      value: activeCases + openCases,
      icon: Activity,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      label: t.dashboard.closedCases,
      value: closedCases,
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-100',
    },
    {
      label: t.dashboard.totalNodes,
      value: totalNodes,
      icon: Network,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
    },
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">
              {t.dashboard.welcome},{' '}
              <span className="text-guinea-red">{user?.name?.split(' ')[0]}</span>
            </h1>
          </div>
          <p className="text-slate-500 text-sm">{t.dashboard.subtitle}</p>
          {corpsConfig && (
            <div className="flex items-center gap-2 mt-3">
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold text-white ${corpsConfig.bg}`}>
                {corpsConfig.badge}
              </span>
              <span className="text-xs text-slate-500">{corpsConfig.label}</span>
              {user?.grade && (
                <span className="text-xs text-slate-400">· {user.grade}</span>
              )}
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
            <div
              key={label}
              className={`bg-white rounded-xl border ${border} p-5 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {isLoading ? (
                  <span className="inline-block w-8 h-7 bg-slate-100 rounded animate-pulse" />
                ) : (
                  value
                )}
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent cases */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">{t.dashboard.recentCases}</h2>
              <button
                onClick={() => navigate('/cases')}
                className="flex items-center gap-1 text-xs font-medium text-guinea-red hover:text-guinea-red-dark transition-colors"
              >
                {t.dashboard.viewAll}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-slate-100 rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))
              ) : recentCases.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <FolderOpen className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">{t.dashboard.noRecentCases}</p>
                </div>
              ) : (
                recentCases.map((c) => {
                  const sCfg = STATUS_CONFIG[c.status]
                  const cCfg = CORPS_CONFIG[c.corps]
                  return (
                    <button
                      key={c.id}
                      onClick={() => navigate(`/cases/${c.id}`)}
                      className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors text-left group"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${cCfg.bg}`}>
                        <FolderOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-slate-900 truncate">{c.title}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-mono">{c.reference}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${sCfg.color}`}>
                            {sCfg.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-slate-400">
                            {new Date(c.updatedAt).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 justify-end mt-0.5">
                            <Network className="w-3 h-3" />
                            {c._count?.nodes ?? 0}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-guinea-red transition-colors" />
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-semibold text-slate-900 mb-4">{t.dashboard.quickActions}</h2>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/cases')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-guinea-red text-white hover:bg-guinea-red-dark transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  {t.dashboard.newCase}
                </button>
                <button
                  onClick={() => navigate('/cases')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                  <FolderOpen className="w-4 h-4 text-slate-400" />
                  {t.nav.cases}
                </button>
                {user?.role === 'ADMIN' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
                  >
                    <Users className="w-4 h-4 text-slate-400" />
                    {t.nav.admin}
                  </button>
                )}
              </div>
            </div>

            {/* Corps info card */}
            {corpsConfig && (
              <div className={`rounded-xl p-5 text-white ${corpsConfig.bg}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <p className="font-semibold text-sm">{corpsConfig.label}</p>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">{t.dashboard.totalCases}</span>
                    <span className="font-semibold">{totalCases}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">{t.dashboard.activeCases}</span>
                    <span className="font-semibold">{activeCases + openCases}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">{t.dashboard.totalNodes}</span>
                    <span className="font-semibold">{totalNodes}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
