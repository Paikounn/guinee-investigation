import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, FolderOpen, Settings, ShieldCheck, X } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useLanguage } from '../contexts/LanguageContext'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuthStore()
  const { t } = useLanguage()
  const location = useLocation()

  const isAdmin = user?.role === 'ADMIN'

  const navItems = [
    {
      to: '/dashboard',
      icon: LayoutDashboard,
      label: t.nav.dashboard,
    },
    {
      to: '/cases',
      icon: FolderOpen,
      label: t.nav.cases,
    },
    ...(isAdmin
      ? [
          {
            to: '/admin',
            icon: ShieldCheck,
            label: t.nav.admin,
          },
        ]
      : []),
    {
      to: '/settings',
      icon: Settings,
      label: t.nav.settings,
    },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200 z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #CE1126 0%, #CE1126 33%, #FCD116 33%, #FCD116 66%, #007A5E 66%)' }}
            >
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm leading-tight">{t.appName}</p>
              <p className="text-xs text-slate-400">{t.appSubtitle}</p>
            </div>
          </div>
          {/* Close button (mobile) */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Guinea flag stripe */}
        <div className="h-0.5 guinea-stripe flex-shrink-0" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
            Navigation
          </p>
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive =
              to === '/cases'
                ? location.pathname.startsWith('/cases')
                : location.pathname === to || location.pathname.startsWith(to + '/')

            return (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-guinea-red text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4.5 h-4.5 flex-shrink-0 w-[18px] h-[18px]" />
                {label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* User info at bottom */}
        {user && (
          <div className="px-3 py-4 border-t border-slate-200 flex-shrink-0">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50">
              <div className="w-8 h-8 rounded-full bg-guinea-red flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">
                  {user.grade ? `${user.grade} · ` : ''}{user.corps}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
