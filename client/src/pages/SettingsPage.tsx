import { Globe, Shield, Bell, Lock } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { LANGUAGES, type Language } from '../lib/i18n'
import { useAuthStore } from '../stores/authStore'
import { CORPS_CONFIG } from '../types'
import Layout from '../components/Layout'

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()
  const { user } = useAuthStore()
  const corpsConfig = user ? CORPS_CONFIG[user.corps] : null

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{t.nav.settings}</h1>
          <p className="text-sm text-slate-500 mt-1">Gérez vos préférences et votre compte</p>
        </div>

        <div className="space-y-6">

          {/* Profile section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Shield className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="font-semibold text-slate-900">{t.nav.profile}</h2>
            </div>

            {user && (
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl ${corpsConfig?.bg ?? 'bg-slate-500'}`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium text-white ${corpsConfig?.bg ?? 'bg-slate-500'}`}>
                      {corpsConfig?.badge}
                    </span>
                    {user.grade && (
                      <span className="text-xs text-slate-500">{user.grade}</span>
                    )}
                    {user.matricule && (
                      <span className="text-xs text-slate-400 font-mono">{user.matricule}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Language section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Globe className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="font-semibold text-slate-900">Langue / Language</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as Language)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                    language === lang.code
                      ? 'border-guinea-red bg-red-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <p className={`text-sm font-semibold ${language === lang.code ? 'text-guinea-red' : 'text-slate-900'}`}>
                      {lang.label}
                    </p>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">{lang.code}</p>
                  </div>
                  {language === lang.code && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-guinea-red" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Security section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Lock className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="font-semibold text-slate-900">Sécurité</h2>
            </div>
            <p className="text-sm text-slate-500">
              Pour modifier votre mot de passe ou vos informations de sécurité, contactez votre administrateur système.
            </p>
          </div>

          {/* Notifications section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Bell className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="font-semibold text-slate-900">Notifications</h2>
            </div>
            <p className="text-sm text-slate-500">
              Les notifications seront disponibles dans une prochaine version.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
