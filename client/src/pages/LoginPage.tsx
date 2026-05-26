// LoginPage.tsx — Corps selector + secure login for Guinea national security system
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, AlertCircle, Shield, ArrowRight } from 'lucide-react';
import { CORPS_LOGOS, CORPS_META, CorpsId } from '../components/CorpsLogos';
import { ROLE_META, getRoleBadgeStyle } from '../utils/permissions';
import type { UserRole } from '../types';
import { useAuthStore } from '../stores/authStore';

const CORPS_ORDER: CorpsId[] = ['POLICE','GENDARMERIE','DOUANE','SECURITE_ETAT','GARDE_REPUBLICAINE','EAUX_FORETS'];

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [step, setStep] = useState<'corps'|'login'>('corps');
  const [selectedCorps, setSelectedCorps] = useState<CorpsId|null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('OFFICIER');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const meta = selectedCorps ? CORPS_META[selectedCorps] : null;
  const Logo = selectedCorps ? CORPS_LOGOS[selectedCorps] : null;

  const selectCorps = (id: CorpsId) => {
    setSelectedCorps(id);
    setStep('login');
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Veuillez saisir votre identifiant et mot de passe.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Simulate auth — in production this calls the real API
      await new Promise(r=>setTimeout(r,800));
      if (password.length < 4) {
        setError('Identifiants incorrects. Veuillez réessayer.');
        setLoading(false);
        return;
      }
      // Simulate auth call — replace with real API in production
      const mockUser = { id: '1', name: username, email: username+'@guinee.gov.gn', corps: selectedCorps || 'POLICE', role: selectedRole as UserRole, matricule: 'GN-' + Math.floor(Math.random()*9000+1000) };
      setAuth(mockUser as any, 'mock-token-' + Date.now());
      navigate('/cases');
    } catch (err: any) {
      setError(err.message || 'Erreur d\'authentification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b14] flex flex-col" style={{
      backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(206,17,38,0.08), transparent), radial-gradient(ellipse 80% 60% at 80% 80%, rgba(0,148,96,0.06), transparent)'
    }}>

      {/* Guinea flag top bar */}
      <div className="flex h-1.5 w-full flex-shrink-0">
        <div className="flex-1 bg-[#CE1126]"/>
        <div className="flex-1 bg-[#FCD116]"/>
        <div className="flex-1 bg-[#009460]"/>
      </div>

      {/* Header */}
      <div className="flex items-center justify-center pt-8 pb-4">
        <div className="flex items-center gap-4">
          {/* Guinea coat of arms placeholder */}
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
            style={{ background: 'linear-gradient(135deg,#CE1126,#FCD116,#009460)', color:'#fff', boxShadow:'0 0 20px rgba(252,209,22,0.3)' }}>
            RG
          </div>
          <div className="text-center">
            <div className="text-white font-bold text-lg tracking-wide">SYSTÈME D'ENQUÊTE NATIONALE</div>
            <div className="text-xs text-slate-400">République de Guinée — Accès Sécurisé</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">

        {step === 'corps' ? (
          /* ── Corps selection ── */
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900/50 text-xs text-slate-400 mb-4">
                <Shield size={12} className="text-green-400"/> Connexion sécurisée — Données classifiées
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Sélectionnez votre corps</h1>
              <p className="text-slate-400 text-sm">Choisissez votre institution pour accéder à l'interface dédiée</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CORPS_ORDER.map(corpsId => {
                const CorpsLogo = CORPS_LOGOS[corpsId];
                const m = CORPS_META[corpsId];
                return (
                  <button key={corpsId} onClick={()=>selectCorps(corpsId)}
                    className="group flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105"
                    style={{
                      background: m.badgeBg,
                      borderColor: m.borderColor,
                    }}
                    onMouseEnter={e=>{
                      (e.currentTarget as HTMLElement).style.borderColor = m.primaryColor;
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px '+m.primaryColor+'44';
                    }}
                    onMouseLeave={e=>{
                      (e.currentTarget as HTMLElement).style.borderColor = m.borderColor;
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    <CorpsLogo size={64}/>
                    <div className="text-center">
                      <div className="font-bold text-sm" style={{ color: m.secondaryColor }}>{m.label}</div>
                      <div className="text-xs mt-1 opacity-60 leading-tight" style={{ color: m.textColor }}>{m.description}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: m.secondaryColor }}>
                      Se connecter <ArrowRight size={12}/>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="text-center mt-8 text-xs text-slate-600">
              Accès réservé aux agents habilités — Toute connexion est tracée et enregistrée
            </div>
          </div>
        ) : (
          /* ── Login form ── */
          <div className="w-full max-w-md">
            {/* Back to corps selection */}
            <button onClick={()=>setStep('corps')} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6 group">
              <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform"/>
              Changer de corps
            </button>

            {/* Corps header */}
            <div className="rounded-2xl border p-6 mb-6 flex items-center gap-4"
              style={{ background: meta?.badgeBg, borderColor: meta?.borderColor }}>
              {Logo && <Logo size={64}/>}
              <div>
                <div className="font-bold text-white text-lg">{meta?.label}</div>
                <div className="text-xs mt-0.5" style={{ color: meta?.textColor }}>{meta?.description}</div>
              </div>
            </div>

            {/* Login form */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur">
              <h2 className="text-xl font-bold text-white mb-6">Authentification</h2>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">
                  <AlertCircle size={14}/>
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Identifiant agent
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                    <input
                      type="text"
                      value={username}
                      onChange={e=>{setUsername(e.target.value);setError('');}}
                      placeholder="N° matricule ou identifiant"
                      autoComplete="username"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition-all"
                      style={{ '--tw-ring-color': meta?.primaryColor } as any}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e=>{setPassword(e.target.value);setError('');}}
                      placeholder="Mot de passe sécurisé"
                      autoComplete="current-password"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition-all"
                    />
                    <button type="button" onClick={()=>setShowPass(v=>!v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                </div>

                {/* Role selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Niveau d'accès / Rôle
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['ADMIN','COMMANDANT','OFFICIER','ANALYSTE'] as UserRole[]).map(role => {
                      const rm = ROLE_META[role];
                      return (
                        <button key={role} type="button" onClick={() => setSelectedRole(role)}
                          className="flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left"
                          style={{
                            background: selectedRole === role ? rm.badgeBg : 'transparent',
                            borderColor: selectedRole === role ? rm.color : '#334155',
                            color: selectedRole === role ? rm.color : '#64748b',
                          }}>
                          <span className="text-base">
                            {role === 'ADMIN' ? '🛡️' : role === 'COMMANDANT' ? '⭐' : role === 'OFFICIER' ? '🔵' : '📊'}
                          </span>
                          <div>
                            <div className="font-bold">{rm.label}</div>
                            <div className="text-[9px] opacity-70 leading-tight hidden sm:block">{rm.description.split(' — ')[0]}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-600"/>
                    Rester connecté (8h)
                  </label>
                  <button type="button" onClick={()=>navigate('/forgot-password')}
                    className="text-slate-400 hover:text-white transition-colors">
                    Mot de passe oublié ?
                  </button>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                  style={{ background: `linear-gradient(135deg, ${meta?.primaryColor || '#CE1126'}, ${meta?.accentColor || '#009460'})` }}>
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Authentification...</>
                  ) : (
                    <><Shield size={16}/>Accéder au système</>
                  )}
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-600">
                  Problème d'accès ? Contactez votre administrateur système
                </p>
              </div>
            </div>

            {/* Security notice */}
            <div className="mt-4 text-center text-xs text-slate-700">
              🔒 Connexion chiffrée TLS 1.3 — Toute activité est journalisée conformément aux directives nationales de sécurité
            </div>
          </div>
        )}
      </div>

      {/* Guinea flag bottom bar */}
      <div className="flex h-1.5 w-full flex-shrink-0">
        <div className="flex-1 bg-[#CE1126]"/>
        <div className="flex-1 bg-[#FCD116]"/>
        <div className="flex-1 bg-[#009460]"/>
      </div>
    </div>
  );
};

export default LoginPage;
