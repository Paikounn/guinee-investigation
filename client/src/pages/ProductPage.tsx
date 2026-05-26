import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: '🗺️',
    title: 'Cartographie des Réseaux',
    desc: 'Visualisez les liens entre individus, véhicules, adresses et événements sur un canvas interactif. Identifiez les hubs criminels d\'un seul regard.',
    color: '#CE1126',
  },
  {
    icon: '👥',
    title: 'Collaboration en Temps Réel',
    desc: 'Plusieurs enquêteurs travaillent simultanément sur la même affaire. Synchronisation instantanée entre Police, Gendarmerie et Douanes.',
    color: '#009460',
  },
  {
    icon: '🤖',
    title: 'Suggestions IA',
    desc: 'L\'IA propose des connexions probables entre entités, préremplit les localités guinéennes et suggère des types de relations selon le contexte.',
    color: '#FCD116',
  },
  {
    icon: '📍',
    title: 'Géolocalisation Guinéenne',
    desc: 'Base de données complète des 33 préfectures, sous-préfectures, quartiers et villes de Guinée. Autofill intelligent pour chaque entité.',
    color: '#CE1126',
  },
  {
    icon: '📊',
    title: 'Tableaux de Bord',
    desc: 'Suivez l\'avancement de toutes vos affaires, les statuts (Ouvert, Actif, Fermé), et les statistiques par corps de sécurité.',
    color: '#009460',
  },
  {
    icon: '🔐',
    title: 'Sécurité Maximum',
    desc: 'Chiffrement de bout en bout, contrôle d\'accès par corps et grade, journalisation complète de toutes les actions. Hébergement souverain.',
    color: '#FCD116',
  },
  {
    icon: '🖨️',
    title: 'Rapports & Export',
    desc: 'Générez des rapports d\'enquête officiels au format PDF, exportez les graphes en haute résolution pour vos dossiers judiciaires.',
    color: '#CE1126',
  },
  {
    icon: '📱',
    title: 'Multi-Appareils',
    desc: 'Accessible depuis PC de bureau, laptop et smartphone. Interface optimisée pour un usage terrain par les agents de sécurité.',
    color: '#009460',
  },
]

const ENTITY_TYPES = [
  { type: 'Personne', icon: '👤', desc: 'Suspects, témoins, victimes, contacts', color: '#3b82f6' },
  { type: 'Véhicule', icon: '🚗', desc: 'Voitures, motos, camions, embarcations', color: '#f59e0b' },
  { type: 'Adresse', icon: '📍', desc: 'Domiciles, lieux de rendez-vous, QG', color: '#10b981' },
  { type: 'Téléphone', icon: '📱', desc: 'Numéros, communications interceptées', color: '#8b5cf6' },
  { type: 'Événement', icon: '📅', desc: 'Incidents, réunions, transactions', color: '#ef4444' },
  { type: 'Organisation', icon: '🏢', desc: 'Entreprises, groupes criminels, associations', color: '#06b6d4' },
  { type: 'Document', icon: '📄', desc: 'Pièces d\'identité, contrats, preuves', color: '#f97316' },
  { type: 'Compte Bancaire', icon: '🏦', desc: 'Transactions financières, virements', color: '#84cc16' },
]

const PLANS = [
  {
    name: 'Brigade',
    price: '500 000',
    period: '/mois',
    currency: 'GNF',
    desc: 'Pour une brigade ou unité locale',
    features: ['Jusqu\'à 10 agents', '50 affaires actives', 'Cartographie réseau', 'Export PDF', 'Support email'],
    color: '#3b82f6',
    popular: false,
  },
  {
    name: 'Préfecture',
    price: '2 000 000',
    period: '/mois',
    currency: 'GNF',
    desc: 'Pour une préfecture entière',
    features: ['Jusqu\'à 100 agents', 'Affaires illimitées', 'Collaboration temps réel', 'IA intégrée', 'Tous corps de sécurité', 'Support prioritaire', 'Formation incluse'],
    color: '#FCD116',
    popular: true,
  },
  {
    name: 'National',
    price: 'Sur devis',
    period: '',
    currency: '',
    desc: 'Déploiement national complet',
    features: ['Agents illimités', 'Toutes 33 préfectures', 'Serveur dédié souverain', 'Intégrations personnalisées', 'Formation sur site', 'Support 24/7', 'SLA garanti', 'Audit de sécurité'],
    color: '#009460',
    popular: false,
  },
]

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-[#060b14] text-white">
      <NavBar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8 font-medium"
               style={{ background: 'rgba(0,148,96,0.1)', color: '#009460', border: '1px solid rgba(0,148,96,0.2)' }}>
            FONCTIONNALITÉS PRODUIT
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Tout ce dont vos enquêtes
            <br />
            <span style={{ background: 'linear-gradient(90deg, #CE1126, #FCD116, #009460)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ont besoin
            </span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            GuinéeEnquête regroupe cartographie des réseaux criminels, collaboration multi-corps,
            intelligence artificielle et données géographiques guinéennes complètes.
          </p>
          <Link to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #CE1126, #009460)' }}>
            Demander une Démo
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M8 5v14l11-7z"/></svg>
          </Link>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 px-6 bg-[#04080f]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Fonctionnalités Clés</h2>
          <p className="text-slate-400 text-center mb-16">Conçu spécifiquement pour les besoins des forces de sécurité guinéennes</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(feat => (
              <div key={feat.title} className="rounded-2xl p-6 transition-all hover:scale-105"
                   style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-3xl mb-4">{feat.icon}</div>
                <h3 className="text-base font-bold mb-2" style={{ color: feat.color }}>{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Entity types */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Types d'Entités Supportés</h2>
          <p className="text-slate-400 text-center mb-16">Chaque type d'entité peut être lié aux autres pour former un réseau d'investigation complet</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ENTITY_TYPES.map(ent => (
              <div key={ent.type} className="rounded-2xl p-5 text-center transition-all hover:scale-105"
                   style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${ent.color}30` }}>
                <div className="text-4xl mb-3">{ent.icon}</div>
                <div className="font-bold mb-1" style={{ color: ent.color }}>{ent.type}</div>
                <div className="text-xs text-slate-500">{ent.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-[#04080f]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Comment ça marche</h2>
          <div className="space-y-8">
            {[
              { n: '01', title: 'Créez une affaire', desc: 'Ouvrez une nouvelle enquête, renseignez le corps de sécurité, la région, le type d\'infraction et les agents assignés.' },
              { n: '02', title: 'Ajoutez des entités', desc: 'Positionnez suspects, véhicules, adresses, numéros de téléphone et organisations sur le canvas d\'investigation.' },
              { n: '03', title: 'Établissez les liens', desc: 'Reliez les entités avec des connexions étiquetées : "Associé à", "Propriétaire de", "Présent lors de"...' },
              { n: '04', title: 'Collaborez et analysez', desc: 'Invitez vos collègues d\'autres corps, suivez les mises à jour en temps réel, exportez le rapport final.' },
            ].map(step => (
              <div key={step.n} className="flex gap-6 items-start">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-black"
                     style={{ background: 'linear-gradient(135deg, rgba(206,17,38,0.2), rgba(0,148,96,0.2))', border: '1px solid rgba(252,209,22,0.2)', color: '#FCD116' }}>
                  {step.n}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                  <p className="text-slate-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Tarification</h2>
          <p className="text-slate-400 text-center mb-16">Plans adaptés à chaque niveau d'organisation sécuritaire</p>
          <div className="grid md:grid-cols-3 gap-8">
            {PLANS.map(plan => (
              <div key={plan.name} className={`rounded-2xl p-8 relative ${plan.popular ? 'scale-105' : ''}`}
                   style={{
                     background: plan.popular ? 'rgba(252,209,22,0.05)' : 'rgba(255,255,255,0.03)',
                     border: `1px solid ${plan.popular ? 'rgba(252,209,22,0.3)' : 'rgba(255,255,255,0.07)'}`,
                   }}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-black"
                       style={{ background: '#FCD116' }}>
                    RECOMMANDÉ
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1" style={{ color: plan.color }}>{plan.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{plan.desc}</p>
                  <div className="text-3xl font-black text-white">
                    {plan.price}
                    <span className="text-base font-normal text-slate-400">{plan.currency && ` ${plan.currency}`}{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(feat => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-slate-300">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" style={{ fill: plan.color }}>
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to="/contact"
                      className="block text-center py-3 px-6 rounded-xl font-semibold transition-all hover:opacity-90"
                      style={{ background: plan.popular ? '#FCD116' : 'rgba(255,255,255,0.08)', color: plan.popular ? '#000' : '#fff' }}>
                  {plan.price === 'Sur devis' ? 'Nous Contacter' : 'Commencer'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
