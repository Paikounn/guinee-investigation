import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const TEAM = [
  {
    name: 'Paikoun Nene',
    role: 'Fondateur & Directeur Produit',
    bio: 'Expert en technologie de sécurité publique avec une vision pour la modernisation des forces de l\'ordre guinéennes.',
    email: 'golehlee@gmail.com',
    whatsapp: '+224629653636',
  },
]

const CORPS_PARTNERS = [
  { name: 'Police Nationale', abbr: 'PNG', color: '#1e3a8a', icon: '🛡️' },
  { name: 'Gendarmerie Nationale', abbr: 'GNG', color: '#14532d', icon: '⚖️' },
  { name: 'Douanes Nationales', abbr: 'DNG', color: '#854d0e', icon: '🔍' },
  { name: 'Sécurité d\'État', abbr: 'DGSE', color: '#1c1917', icon: '🔐' },
  { name: 'Garde Républicaine', abbr: 'GRG', color: '#7c2d12', icon: '🎖️' },
  { name: 'Eaux et Forêts', abbr: 'DNEF', color: '#166534', icon: '🌿' },
]

const TIMELINE = [
  { year: '2023', title: 'Conception', desc: 'Identification du besoin d\'une plateforme d\'investigation nationale unifiée pour la Guinée.' },
  { year: '2024', title: 'Développement', desc: 'Construction de la plateforme GuinéeEnquête avec cartographie des réseaux criminels et collaboration en temps réel.' },
  { year: '2024', title: 'Lancement Bêta', desc: 'Déploiement pilote avec des unités sélectionnées de la Police Nationale et de la Gendarmerie.' },
  { year: '2025', title: 'Déploiement National', desc: 'Extension à l\'ensemble des forces de sécurité de la République de Guinée.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#060b14] text-white">
      <NavBar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8 font-medium"
               style={{ background: 'rgba(206, 17, 38, 0.1)', color: '#CE1126', border: '1px solid rgba(206,17,38,0.2)' }}>
            À PROPOS DE NOUS
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Moderniser la sécurité
            <br />
            <span style={{ background: 'linear-gradient(90deg, #CE1126, #FCD116, #009460)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              nationale guinéenne
            </span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            GuinéeEnquête est né d'une conviction : les forces de sécurité guinéennes méritent des outils
            à la hauteur de leurs missions. Nous construisons la plateforme d'investigation de demain, aujourd'hui.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 bg-[#04080f]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Notre Mission</h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Fournir aux forces de l'ordre guinéennes une plateforme d'investigation numérique unifiée qui permet de
                cartographier les réseaux criminels, de partager l'information en temps réel entre corps, et
                de conduire des enquêtes plus efficaces et mieux documentées.
              </p>
              <p className="text-slate-400 leading-relaxed mb-8">
                En unissant Police Nationale, Gendarmerie, Douanes et services de renseignement sur une même plateforme,
                nous créons la première infrastructure numérique de sécurité nationale de la Guinée.
              </p>
              <div className="flex gap-1">
                <div className="h-1 flex-1 rounded-l-full" style={{ background: '#CE1126' }} />
                <div className="h-1 flex-1" style={{ background: '#FCD116' }} />
                <div className="h-1 flex-1 rounded-r-full" style={{ background: '#009460' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Régions couvertes', value: '5', color: '#CE1126' },
                { label: 'Préfectures', value: '33', color: '#FCD116' },
                { label: 'Corps partenaires', value: '8', color: '#009460' },
                { label: 'Agents formés', value: '500+', color: '#CE1126' },
              ].map(stat => (
                <div key={stat.label} className="rounded-2xl p-6 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="text-3xl font-bold mb-2" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Notre Parcours</h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10" />
            <div className="space-y-12">
              {TIMELINE.map((item, i) => (
                <div key={i} className="flex gap-8 items-start">
                  <div className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                       style={{ background: 'linear-gradient(135deg, #CE1126, #009460)' }}>
                    <span className="text-xs font-bold">{item.year}</span>
                  </div>
                  <div className="pt-3">
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-[#04080f]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-16">L'Équipe Fondatrice</h2>
          {TEAM.map(member => (
            <div key={member.name} className="rounded-2xl p-8 max-w-md mx-auto"
                 style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl"
                   style={{ background: 'linear-gradient(135deg, #CE1126, #009460)' }}>
                👤
              </div>
              <h3 className="text-xl font-bold mb-1">{member.name}</h3>
              <p className="text-sm mb-4" style={{ color: '#FCD116' }}>{member.role}</p>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">{member.bio}</p>
              <div className="flex flex-col gap-2">
                <a href={`mailto:${member.email}`} className="text-sm text-slate-400 hover:text-white transition-colors">
                  📧 {member.email}
                </a>
                <a href={`https://wa.me/${member.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                   className="text-sm text-slate-400 hover:text-white transition-colors">
                  💬 WhatsApp: {member.whatsapp}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partner corps */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Corps Partenaires</h2>
          <p className="text-slate-400 mb-16">Une plateforme unifiée pour toutes les forces de sécurité nationales</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {CORPS_PARTNERS.map(corps => (
              <div key={corps.abbr} className="rounded-2xl p-6 flex flex-col items-center gap-3 transition-all hover:scale-105"
                   style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-4xl">{corps.icon}</div>
                <span className="text-lg font-bold" style={{ color: corps.color === '#1c1917' ? '#94a3b8' : corps.color }}>
                  {corps.abbr}
                </span>
                <span className="text-sm text-slate-400 text-center">{corps.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
