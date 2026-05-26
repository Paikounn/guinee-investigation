import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, LogOut, ChevronDown, Menu, Globe } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useLanguage } from '../contexts/LanguageContext'
import { LANGUAGES, type Language } from '../lib/i18n'
import { CORPS_CONFIG } from '../types'

interface HeaderProps {
  onMenuToggle: () => void
  sidebarOpen: boolean
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()
  const { language, t, setLanguage } = useLanguage()

  const [profileOpen, setProfileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleLogout() {
    clearAuth()
    navigate('/login', { replace: true })
  }

  const corpsConfig = user ? CORPS_CONFIG[user.corps] : null
  const initials = user?.name?.charAt(0).toUpperCase() ?? '?'

  return (
    <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 gap-4 z-30 relative">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-sm"
          style={{ background: 'linear-gradient(135deg, #CE1126 0%, #CE1126 33%, #FCD116 33%, #FCD116 66%, #007A5E 66%)' }}
        >
          <Shield className="w-5 h-5 text-white drop-shadow" />
        </div>
        <div className="hidden sm:block min-w-0">
          <p className="font-bold text-slate-900 text-sm leading-tight truncate">{t.appName}</p>
          <p className="text-xs text-slate-400 leading-tight">{t.appSubtitle}</p>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right controls */}
      <div className="flex items-center gap-2">

        {/* Language switcher */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen((o) => !o)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline uppercase font-semibold text-xs tracking-wide">
              {language}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
          </button>

          {langOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1 animate-scale-in z-50">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code as Language); setLangOpen(false) }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                    language === lang.code
                      ? 'bg-red-50 text-guinea-red font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                  {language === lang.code && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-guinea-red" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200" />

        {/* Profile dropdown */}
        {user && (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${corpsConfig?.bg ?? 'bg-slate-500'}`}
              >
                {initials}
              </div>
              <div className="hidden md:block text-left min-w-0">
                <p className="text-sm font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                  {user.name}
                </p>
                <p className="text-xs text-slate-400 leading-tight truncate max-w-[120px]">
                  {user.grade ? `${user.grade} · ` : ''}{corpsConfig?.label}
                </p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform hidden md:block ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1 animate-scale-in z-50">
                {/* User info */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium text-white ${corpsConfig?.bg ?? 'bg-slate-500'}`}>
                      {corpsConfig?.badge}
                    </span>
                    {user.role && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600">
                        {user.role}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {t.nav.logout}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
