import { useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', org: '', message: '', corps: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would send to backend API
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-[#060b14] text-white">
      <NavBar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8 font-medium"
               style={{ background: 'rgba(252,209,22,0.1)', color: '#FCD116', border: '1px solid rgba(252,209,22,0.2)' }}>
            CONTACTEZ-NOUS
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Parlons de votre
            <br />
            <span style={{ background: 'linear-gradient(90deg, #CE1126, #FCD116, #009460)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              déploiement
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Notre équipe est disponible pour une démonstration personnalisée, une formation ou un déploiement national.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-bold mb-8">Informations de Contact</h2>

              {/* Direct contact card */}
              <div className="rounded-2xl p-8 mb-8"
                   style={{ background: 'linear-gradient(135deg, rgba(206,17,38,0.1), rgba(0,148,96,0.1))', border: '1px solid rgba(252,209,22,0.2)' }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                       style={{ background: 'linear-gradient(135deg, #CE1126, #009460)' }}>
                    👤
                  </div>
                  <div>
                    <div className="text-xl font-bold">Paikoun Nene</div>
                    <div className="text-sm" style={{ color: '#FCD116' }}>Fondateur & Directeur Produit</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <a href="mailto:golehlee@gmail.com"
                     className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/5">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                         style={{ background: 'rgba(252,209,22,0.1)' }}>
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" style={{ color: '#FCD116' }}>
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-0.5">Email</div>
                      <div className="text-sm font-medium">golehlee@gmail.com</div>
                    </div>
                  </a>

                  <a href="https://wa.me/224629653636" target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/5">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                         style={{ background: 'rgba(37,211,102,0.1)' }}>
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" style={{ color: '#25D366' }}>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-0.5">WhatsApp</div>
                      <div className="text-sm font-medium">+224 629 653 636</div>
                    </div>
                  </a>

                  <div className="flex items-center gap-3 p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                         style={{ background: 'rgba(206,17,38,0.1)' }}>
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" style={{ color: '#CE1126' }}>
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-0.5">Localisation</div>
                      <div className="text-sm font-medium">Conakry, République de Guinée 🇬🇳</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick links */}
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-300 mb-4">Accès Rapide</h3>
                <a href="https://wa.me/224629653636?text=Bonjour%20Paikoun%2C%20je%20souhaite%20une%20d%C3%A9monstration%20de%20Guin%C3%A9eEnqu%C3%AAte"
                   target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02] font-medium"
                   style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)', color: '#25D366' }}>
                  💬 Démarrer sur WhatsApp
                </a>
                <a href="mailto:golehlee@gmail.com?subject=Demande%20de%20d%C3%A9monstration%20Guin%C3%A9eEnqu%C3%AAte"
                   className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02] font-medium"
                   style={{ background: 'rgba(252,209,22,0.1)', border: '1px solid rgba(252,209,22,0.2)', color: '#FCD116' }}>
                  📧 Envoyer un Email
                </a>
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold mb-8">Demande de Démo</h2>
              {sent ? (
                <div className="rounded-2xl p-12 text-center"
                     style={{ background: 'rgba(0,148,96,0.1)', border: '1px solid rgba(0,148,96,0.2)' }}>
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#009460' }}>Message Envoyé !</h3>
                  <p className="text-slate-400">Paikoun vous contactera dans les 24 heures via email ou WhatsApp.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {[
                    { field: 'name', label: 'Nom complet *', placeholder: 'Ex: Commissaire Alpha Diallo', type: 'text' },
                    { field: 'email', label: 'Email professionnel *', placeholder: 'votre.email@securite.gov.gn', type: 'email' },
                    { field: 'org', label: 'Corps / Organisation *', placeholder: 'Ex: Police Nationale, Gendarmerie...', type: 'text' },
                  ].map(f => (
                    <div key={f.field}>
                      <label className="block text-sm font-medium text-slate-400 mb-2">{f.label}</label>
                      <input
                        type={f.type}
                        required
                        placeholder={f.placeholder}
                        value={(form as any)[f.field]}
                        onChange={e => setForm(prev => ({ ...prev, [f.field]: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 outline-none transition-all focus:ring-1"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Corps de sécurité</label>
                    <select
                      value={form.corps}
                      onChange={e => setForm(prev => ({ ...prev, corps: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-white outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <option value="">Sélectionner...</option>
                      <option>Police Nationale</option>
                      <option>Gendarmerie Nationale</option>
                      <option>Douanes Nationales</option>
                      <option>Sécurité d'État</option>
                      <option>Garde Républicaine</option>
                      <option>Administration Pénitentiaire</option>
                      <option>Eaux et Forêts</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Message *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Décrivez vos besoins, le nombre d'agents, votre région..."
                      value={form.message}
                      onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 outline-none transition-all resize-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg, #CE1126, #009460)' }}
                  >
                    Envoyer la Demande
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
