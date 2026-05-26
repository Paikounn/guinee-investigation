import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff, CheckCircle, Network, Lock, Globe, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useLanguage } from '../contexts/LanguageContext'
import { api } from '../lib/api'
import { Corps, CORPS_CONFIG } from '../types'
import { LANGUAGES, type Language } from '../lib/i18n'

type Mode = 'login' | 'register'

interface AuthResponse {
  user: {
    id: string
    name: string
    email: string
    corps: Corps
    role: 'ADMIN' | 'INVESTIGATOR' | 'ANALYST'
    grade?: string
    matricule?: string
  }
  token: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const { language, t, setLanguage } = useLanguage()

  const [mode, setMode] = useState<Mode>('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    corps: 'POLICE' as Corps,
    grade: '',
    matricule: '',
  })

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const body =
        mode === 'login'
          ? { email: form.email, password: form.password }
          : {
              email: form.email,
              password: form.password,
              name: form.name,
              corps: form.corps,
              ...(form.grade ? { grade: form.grade } : {}),
              ...(form.matricule ? { matricule: form.matricule } : {}),
            }

      const res = await api.post<AuthResponse>(`/auth/${mode}`, body)
      setAuth(res.user, res.token)
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      setError(err.message || t.common.unknownError)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { icon: Network, text: t.auth.heroFeature1 },
    { icon: Shield, text: t.auth.heroFeature2 },
    { icon: Lock, text: t.auth.heroFeature3 },
  ]

  return (
    <div className="min-h-screen flex bg-slate-950">

      {/* ── Left hero panel ─────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #0F172A 100%)',
          }}
        />

        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #CE1126, transparent)' }} />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #007A5E, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #FCD116, transparent)' }} />

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-16">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #CE1126 0%, #CE1126 33%, #FCD116 33%, #FCD116 66%, #007A5E 66%)' }}
            >
              <Shield className="w-6 h-6 text-white drop-shadow" />
            </div>
            <div>
              <p className="font-bold text-white text-lg leading-tight">{t.appName}</p>
              <p className="text-slate-400 text-sm">{t.appSubtitle}</p>
            </div>
          </div>

          {/* Hero text */}
          <div className="mb-12">
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
              {t.auth.heroTitle.split('\n').map((line, i) => (
                <span key={i}>
                  {i === 0 ? line : (
                    <>
                      <br />
                      <span style={{ color: '#FCD116' }}>{line}</span>
                    </>
                  )}
                </span>
              ))}
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              {t.auth.heroSubtitle}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-white/80" />
                </div>
                <p className="text-slate-300 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — Guinea flag stripe */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-4 w-8 rounded overflow-hidden">
              <div className="flex-1" style={{ background: '#CE1126' }} />
              <div className="flex-1" style={{ background: '#FCD116' }} />
              <div className="flex-1" style={{ background: '#007A5E' }} />
            </div>
            <p className="text-slate-500 text-xs">{t.footer.confidential}</p>
          </div>
          <div className="h-px opacity-40"
            style={{ background: 'linear-gradient(90deg, #CE1126, #FCD116, #007A5E)' }} />
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-white">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #CE1126 0%, #CE1126 33%, #FCD116 33%, #FCD116 66%, #007A5E 66%)' }}
            >
              <Shield className="w-4 h-4 text-white" />
            </div>
            <p className="font-bold text-slate-900 text-sm">{t.appName}</p>
          </div>
          <div className="hidden lg:block" />

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen((o) => !o)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase text-xs font-semibold tracking-wide">{language}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-scale-in">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code as Language); setLangOpen(false) }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                      language === lang.code
                        ? 'bg-red-50 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    style={language === lang.code ? { color: '#CE1126' } : {}}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-sm animate-slide-up">

            {/* Form header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                {mode === 'login' ? t.auth.loginTitle : t.auth.registerTitle}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {mode === 'login' ? t.auth.loginSubtitle : t.auth.registerSubtitle}
              </p>
            </div>

            {/* Mode tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 mb-7">
              {(['login', 'register'] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setMode(m); setError('') }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    mode === m
                      ? 'bg-white shadow-sm text-slate-900'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {m === 'login' ? t.auth.login : t.auth.register}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <FormField label={t.auth.fullName}>
                  <input
                    className="input"
                    type="text"
                    required
                    value={form.name}
                    onChange={set('name')}
                    placeholder={t.auth.namePlaceholder}
                    autoComplete="name"
                  />
                </FormField>
              )}

              <FormField label={t.auth.email}>
                <input
                  className="input"
                  type="email"
                  required
                  value={form.email}
                  onChange={set('email')}
                  placeholder={t.auth.emailPlaceholder}
                  autoComplete="email"
                />
              </FormField>

              <FormField label={t.auth.password}>
                <div className="relative">
                  <input
                    className="input pr-10"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={set('password')}
                    placeholder="••••••••"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </FormField>

              {mode === 'register' && (
                <>
                  <FormField label={t.auth.corps}>
                    <select className="input" value={form.corps} onChange={set('corps')}>
                      {(Object.keys(CORPS_CONFIG) as Corps[]).map((c) => (
                        <option key={c} value={c}>{CORPS_CONFIG[c].label}</option>
                      ))}
                    </select>
                  </FormField>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label={t.auth.grade}>
                      <input
                        className="input"
                        type="text"
                        value={form.grade}
                        onChange={set('grade')}
                        placeholder={t.auth.gradePlaceholder}
                      />
                    </FormField>
                    <FormField label={t.auth.matricule}>
                      <input
                        className="input"
                        type="text"
                        value={form.matricule}
                        onChange={set('matricule')}
                        placeholder={t.auth.matriculePlaceholder}
                      />
                    </FormField>
                  </div>
                </>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <div className="w-4 h-4 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-700 text-xs font-bold">!</span>
                  </div>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-150 disabled:opacity-60 mt-2"
                style={{ background: loading ? '#94A3B8' : 'linear-gradient(135deg, #CE1126, #A50D1E)' }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t.auth.loading}
                  </>
                ) : mode === 'login' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {t.auth.loginBtn}
                  </>
                ) : (
                  t.auth.registerBtn
                )}
              </button>
            </form>

            {/* Footer note */}
            <p className="text-center text-xs text-slate-400 mt-6">
              {t.footer.confidential}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}
