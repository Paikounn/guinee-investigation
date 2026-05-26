import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { api } from '../lib/api'
import { Corps, CORPS_CONFIG } from '../types'

type Mode = 'login' | 'register'

interface AuthResponse {
  user: {
    id: string; name: string; email: string; corps: Corps
    role: 'ADMIN' | 'INVESTIGATOR' | 'ANALYST'; grade?: string; matricule?: string
  }
  token: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [mode, setMode] = useState<Mode>('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', name: '', corps: 'POLICE' as Corps, grade: '', matricule: '' })

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { email: form.email, password: form.password, name: form.name, corps: form.corps,
            ...(form.grade ? { grade: form.grade } : {}), ...(form.matricule ? { matricule: form.matricule } : {}) }
      const res = await api.post<AuthResponse>(`/auth/${mode}`, body)
      setAuth(res.user, res.token)
      navigate('/cases', { replace: true })
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080c14] flex items-stretch">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0b1020] border-r border-slate-800/60 p-12 relative overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-white font-semibold tracking-wide text-sm">Guinée Investigation</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Plateforme Nationale<br />
            <span className="text-cyan-400">d'Investigation</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Système unifié de gestion des affaires criminelles pour les services de sécurité de la République de Guinée.
          </p>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-3 gap-4">
          {[
            { label: 'Corps connectés', value: '3' },
            { label: 'Collaboration temps réel', value: '✓' },
            { label: 'Chiffrement bout à bout', value: '✓' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-2xl font-bold text-cyan-400 mb-1">{s.value}</p>
              <p className="text-slate-500 text-xs leading-snug">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Corps badges */}
        <div className="relative flex items-center gap-2 mt-8">
          {(['POLICE', 'GENDARMERIE', 'DOUANE'] as Corps[]).map((c) => {
            const cfg = CORPS_CONFIG[c]
            return (
              <span key={c} className={`text-xs px-2.5 py-1 rounded-full font-medium ${cfg.bg}`}>
                {cfg.badge}
              </span>
            )
          })}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-white font-semibold text-sm">Guinée Investigation</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">
              {mode === 'login' ? 'Connexion' : 'Créer un compte'}
            </h2>
            <p className="text-slate-500 text-sm">
              {mode === 'login'
                ? 'Accédez à votre espace sécurisé'
                : 'Rejoignez la plateforme d\'investigation'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-1 mb-8">
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  mode === m
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {m === 'login' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <Field label="Nom complet">
                <input className={inp} type="text" required value={form.name} onChange={set('name')} placeholder="Ibrahima Diallo" />
              </Field>
            )}
            <Field label="Adresse email">
              <input className={inp} type="email" required value={form.email} onChange={set('email')} placeholder="ibrahima@securite.gn" />
            </Field>
            <Field label="Mot de passe">
              <div className="relative">
                <input className={inp + ' pr-10'} type={showPwd ? 'text' : 'password'} required value={form.password} onChange={set('password')} placeholder="••••••••" />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            {mode === 'register' && (
              <>
                <Field label="Corps d'appartenance">
                  <select className={inp} value={form.corps} onChange={set('corps')}>
                    {(Object.keys(CORPS_CONFIG) as Corps[]).map((c) => (
                      <option key={c} value={c}>{CORPS_CONFIG[c].label}</option>
                    ))}
                  </select>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Grade">
                    <input className={inp} type="text" value={form.grade} onChange={set('grade')} placeholder="Capitaine" />
                  </Field>
                  <Field label="Matricule">
                    <input className={inp} type="text" value={form.matricule} onChange={set('matricule')} placeholder="GN-12345" />
                  </Field>
                </div>
              </>
            )}

            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-semibold py-2.5 rounded-lg transition-colors text-sm mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                  Chargement…
                </>
              ) : mode === 'login' ? 'Se connecter' : "S'inscrire"}
            </button>

            {mode === 'login' && (
              <p className="text-center text-xs text-slate-600 mt-4">
                Mot de passe oublié ?{' '}
                <a href="mailto:admin@securite.gn" className="text-cyan-500 hover:text-cyan-400 transition-colors">
                  Contacter l'administrateur
                </a>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}

const inp =
  'w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-colors'
