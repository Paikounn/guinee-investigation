import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { api } from '../lib/api'
import { Corps, CORPS_CONFIG } from '../types'

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

  const [mode, setMode] = useState<Mode>('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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
      navigate('/cases', { replace: true })
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Système d'Investigation
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Sécurité Nationale — République de Guinée
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  mode === m
                    ? 'bg-white shadow text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
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
              <input className={inp} type="password" required value={form.password} onChange={set('password')} placeholder="••••••••" />
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
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2"
            >
              {loading
                ? 'Chargement…'
                : mode === 'login'
                ? 'Se connecter'
                : "S'inscrire"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )
}

const inp =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
