import { useQuery } from '@tanstack/react-query'
import {
  Users,
  FolderOpen,
  Network,
  ShieldCheck,
  TrendingUp,
  Activity,
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { api } from '../lib/api'
import { Case, CORPS_CONFIG, STATUS_CONFIG, CaseStatus, Corps } from '../types'
import Layout from '../components/Layout'

export default function AdminDashboard() {
  const { t } = useLanguage()

  const { data: cases = [], isLoading } = useQuery({
    queryKey: ['cases-admin'],
    queryFn: () => api.get<Case[]>('/cases'),
  })

  // Aggregate stats
  const totalCases = cases.length
  const totalNodes = cases.reduce((sum, c) => sum + (c._count?.nodes ?? 0), 0)
  const totalMembers = cases.reduce((sum, c) => sum + (c._count?.members ?? 0), 0)

  const byStatus = (Object.keys(STATUS_CONFIG) as CaseStatus[]).map((s) => ({
    status: s,
    count: cases.filter((c) => c.status === s).length,
    config: STATUS_CONFIG[s],
  }))

  const byCorps = (Object.keys(CORPS_CONFIG) as Corps[]).map((corp) => ({
    corps: corp,
    count: cases.filter((c) => c.corps === corp).length,
    config: CORPS_CONFIG[corp],
  }))

  const recentCases = [...cases]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)

  const stats = [
    {
      label: t.admin.allCases,
      value: totalCases,
      icon: FolderOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: t.dashboard.totalNodes,
      value: totalNodes,
      icon: Network,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: t.admin.users,
      value: totalMembers,
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: t.dashboard.activeCases,
      value: cases.filter((c) => c.status === 'ACTIVE' || c.status === 'OPEN').length,
      icon: Activity,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #CE1126, #A50D1E)' }}>
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{t.admin.title}</h1>
              <p className="text-sm text-slate-500">{t.admin.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
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

          {/* Cases table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">{t.admin.allCases}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {t.cases.reference}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {t.cases.caseTitle}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                      Corps
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-3"><div className="h-3 bg-slate-100 rounded animate-pulse w-20" /></td>
                        <td className="px-6 py-3"><div className="h-3 bg-slate-100 rounded animate-pulse w-40" /></td>
                        <td className="px-6 py-3 hidden md:table-cell"><div className="h-3 bg-slate-100 rounded animate-pulse w-24" /></td>
                        <td className="px-6 py-3"><div className="h-5 bg-slate-100 rounded-full animate-pulse w-16" /></td>
                      </tr>
                    ))
                  ) : recentCases.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm">
                        Aucune affaire
                      </td>
                    </tr>
                  ) : (
                    recentCases.map((c) => {
                      const sCfg = STATUS_CONFIG[c.status]
                      const cCfg = CORPS_CONFIG[c.corps]
                      return (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-3 font-mono text-xs text-slate-500">{c.reference}</td>
                          <td className="px-6 py-3 font-medium text-slate-900 max-w-[200px] truncate">{c.title}</td>
                          <td className="px-6 py-3 hidden md:table-cell">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium text-white ${cCfg.bg}`}>
                              {cCfg.badge}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sCfg.color}`}>
                              {sCfg.label}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">

            {/* By status */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-semibold text-slate-900 mb-4 text-sm">Par statut</h3>
              <div className="space-y-3">
                {byStatus.map(({ status, count, config }) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: totalCases > 0 ? `${(count / totalCases) * 100}%` : '0%',
                            background: '#CE1126',
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 w-4 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By corps */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-semibold text-slate-900 mb-4 text-sm">{t.admin.byCorps}</h3>
              <div className="space-y-3">
                {byCorps.map(({ corps, count, config }) => (
                  <div key={corps} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${config.bg}`} />
                      <span className="text-xs text-slate-600 font-medium">{config.badge}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${config.bg}`}
                          style={{ width: totalCases > 0 ? `${(count / totalCases) * 100}%` : '0%' }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 w-4 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
