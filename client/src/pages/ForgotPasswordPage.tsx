import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Send, CheckCircle } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#060b14] flex flex-col items-center justify-center px-4"
      style={{ backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(206,17,38,0.07), transparent)' }}>

      <div className="flex h-1.5 w-full fixed top-0 left-0">
        <div className="flex-1 bg-[#CE1126]"/>
        <div className="flex-1 bg-[#FCD116]"/>
        <div className="flex-1 bg-[#009460]"/>
      </div>

      <div className="w-full max-w-md">
        <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={14}/>Retour à la connexion
        </button>

        {!submitted ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-blue-400"/>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Mot de passe oublié</h1>
              <p className="text-slate-400 text-sm">
                Saisissez l'adresse mail de votre compte. Vous recevrez un lien de réinitialisation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Adresse email institutionnelle
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="agent@guinee.gov.gn"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading || !email.trim()}
                className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #CE1126, #009460)' }}>
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                ) : (
                  <><Send size={16}/>Envoyer le lien de réinitialisation</>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-slate-600 mt-4">
              Si vous n'avez pas accès à votre email, contactez votre administrateur système.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-400"/>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Email envoyé</h2>
            <p className="text-slate-400 text-sm mb-6">
              Si le compte <strong className="text-white">{email}</strong> existe dans notre système, vous recevrez un lien de réinitialisation dans les 5 prochaines minutes.
            </p>
            <button onClick={() => navigate('/login')}
              className="px-6 py-2.5 rounded-xl font-bold text-white text-sm hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg, #CE1126, #009460)' }}>
              Retour à la connexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
