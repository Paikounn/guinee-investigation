import { useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

// ── Corps SVG Logos ──────────────────────────────────────────────────────────

function GendarmerieLogoSVG({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="95" fill="#0a2e1a" stroke="#009460" strokeWidth="4"/>
      <circle cx="100" cy="100" r="80" fill="none" stroke="#FCD116" strokeWidth="2"/>
      {/* Shield */}
      <path d="M100 40 L140 60 L140 110 Q140 140 100 165 Q60 140 60 110 L60 60 Z" fill="#1a4a2a" stroke="#009460" strokeWidth="2"/>
      {/* Lion simplified */}
      <ellipse cx="100" cy="95" rx="22" ry="18" fill="#FCD116"/>
      <ellipse cx="100" cy="88" rx="15" ry="12" fill="#f59e0b"/>
      <circle cx="93" cy="85" r="3" fill="#1a1a1a"/>
      <circle cx="107" cy="85" r="3" fill="#1a1a1a"/>
      <path d="M94 92 Q100 97 106 92" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/>
      {/* Mane */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => (
        <line key={i}
          x1={100 + 18 * Math.cos(a * Math.PI / 180)}
          y1={88 + 14 * Math.sin(a * Math.PI / 180)}
          x2={100 + 26 * Math.cos(a * Math.PI / 180)}
          y2={88 + 22 * Math.sin(a * Math.PI / 180)}
          stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
      ))}
      {/* Stars */}
      {[0, 120, 240].map((a, i) => (
        <text key={i} x={100 + 60 * Math.cos((a - 90) * Math.PI / 180)} y={100 + 60 * Math.sin((a - 90) * Math.PI / 180)}
              textAnchor="middle" dominantBaseline="middle" fontSize="14" fill="#FCD116">★</text>
      ))}
      <text x="100" y="150" textAnchor="middle" fontSize="8" fill="#FCD116" fontWeight="bold" letterSpacing="1">GENDARMERIE</text>
      <text x="100" y="160" textAnchor="middle" fontSize="7" fill="#009460" letterSpacing="0.5">NATIONALE</text>
    </svg>
  )
}

function DouanesLogoSVG({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <polygon points="100,10 190,55 190,145 100,190 10,145 10,55" fill="#1a2e0a" stroke="#009460" strokeWidth="4"/>
      <polygon points="100,25 175,65 175,135 100,175 25,135 25,65" fill="none" stroke="#FCD116" strokeWidth="2"/>
      {/* Scales of justice */}
      <line x1="100" y1="50" x2="100" y2="140" stroke="#FCD116" strokeWidth="3"/>
      <line x1="65" y1="75" x2="135" y2="75" stroke="#FCD116" strokeWidth="3"/>
      {/* Left pan */}
      <path d="M65 75 Q55 90 50 100 Q60 105 75 100 Q80 90 65 75" fill="none" stroke="#FCD116" strokeWidth="2"/>
      {/* Right pan */}
      <path d="M135 75 Q145 90 150 100 Q140 105 125 100 Q120 90 135 75" fill="none" stroke="#FCD116" strokeWidth="2"/>
      <circle cx="100" cy="55" r="6" fill="#FCD116"/>
      {/* Stars */}
      <text x="40" y="55" textAnchor="middle" fontSize="18" fill="#FCD116">★</text>
      <text x="160" y="55" textAnchor="middle" fontSize="18" fill="#FCD116">★</text>
      <text x="100" y="48" textAnchor="middle" fontSize="18" fill="#FCD116">★</text>
      <text x="100" y="157" textAnchor="middle" fontSize="8" fill="#FCD116" fontWeight="bold" letterSpacing="1">DOUANES</text>
      <text x="100" y="167" textAnchor="middle" fontSize="7" fill="#009460" letterSpacing="0.5">NATIONALES</text>
    </svg>
  )
}

function PoliceLogoSVG({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="95" fill="#0a1a3a" stroke="#1e40af" strokeWidth="4"/>
      <circle cx="100" cy="100" r="80" fill="none" stroke="#FCD116" strokeWidth="2"/>
      {/* Badge shield */}
      <path d="M100 35 L155 60 L155 115 Q155 150 100 170 Q45 150 45 115 L45 60 Z" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2"/>
      {/* Star badge */}
      <polygon points="100,55 106,75 128,75 111,87 118,108 100,96 82,108 89,87 72,75 94,75"
               fill="#FCD116" stroke="#f59e0b" strokeWidth="1"/>
      <circle cx="100" cy="82" r="8" fill="#1e3a8a"/>
      {/* Text */}
      <text x="100" y="125" textAnchor="middle" fontSize="9" fill="#FCD116" fontWeight="bold" letterSpacing="1">POLICE</text>
      <text x="100" y="138" textAnchor="middle" fontSize="7.5" fill="#93c5fd" letterSpacing="0.5">NATIONALE</text>
      {/* Stars bottom */}
      <text x="65" y="158" textAnchor="middle" fontSize="14" fill="#FCD116">★</text>
      <text x="100" y="162" textAnchor="middle" fontSize="14" fill="#FCD116">★</text>
      <text x="135" y="158" textAnchor="middle" fontSize="14" fill="#FCD116">★</text>
    </svg>
  )
}

// ── Demo Canvas Mockup ───────────────────────────────────────────────────────

function DemoCanvas() {
  const nodes = [
    { id: 1, x: 200, y: 180, type: 'PERSON', label: 'Alpha Diallo', color: '#3b82f6' },
    { id: 2, x: 450, y: 100, type: 'VEHICLE', label: 'Véhicule\nAA-1234-C', color: '#f59e0b' },
    { id: 3, x: 680, y: 200, type: 'PERSON', label: 'Mamadou Bah', color: '#3b82f6' },
    { id: 4, x: 400, y: 320, type: 'ADDRESS', label: 'Kaloum, Conakry', color: '#10b981' },
    { id: 5, x: 160, y: 360, type: 'PHONE', label: '+224 622 xxx', color: '#8b5cf6' },
    { id: 6, x: 650, y: 370, type: 'COMPANY', label: 'Société Fictive\nSARL', color: '#06b6d4' },
  ]

  const edges = [
    { from: { x: 200, y: 180 }, to: { x: 450, y: 100 }, label: 'Propriétaire', color: '#FCD116' },
    { from: { x: 450, y: 100 }, to: { x: 680, y: 200 }, label: 'Utilisé par', color: '#CE1126' },
    { from: { x: 200, y: 180 }, to: { x: 400, y: 320 }, label: 'Réside à', color: '#009460' },
    { from: { x: 200, y: 180 }, to: { x: 160, y: 360 }, label: 'Contacte', color: '#8b5cf6' },
    { from: { x: 680, y: 200 }, to: { x: 650, y: 370 }, label: 'Dirige', color: '#06b6d4' },
    { from: { x: 400, y: 320 }, to: { x: 650, y: 370 }, label: 'Associé', color: '#f59e0b' },
  ]

  const icons: Record<string, string> = { PERSON: '👤', VEHICLE: '🚗', ADDRESS: '📍', PHONE: '📱', COMPANY: '🏢', EVENT: '📅' }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden"
         style={{ background: '#070d1a', border: '1px solid rgba(255,255,255,0.08)', height: '480px' }}>
      {/* Grid background */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }}>
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#334155" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>

      {/* Edges */}
      <svg className="absolute inset-0 w-full h-full">
        {edges.map((edge, i) => {
          const mx = (edge.from.x + edge.to.x) / 2
          const my = (edge.from.y + edge.to.y) / 2
          return (
            <g key={i}>
              <line x1={edge.from.x} y1={edge.from.y} x2={edge.to.x} y2={edge.to.y}
                    stroke={edge.color} strokeWidth="2" strokeDasharray="6 3" opacity="0.7"/>
              <rect x={mx - 32} y={my - 10} width="64" height="18" rx="9"
                    fill="rgba(7,13,26,0.9)" stroke={edge.color} strokeWidth="1" opacity="0.9"/>
              <text x={mx} y={my + 4} textAnchor="middle" fontSize="9" fill={edge.color} fontFamily="sans-serif">
                {edge.label}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Nodes */}
      {nodes.map(node => (
        <div key={node.id}
             className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
             style={{ left: node.x, top: node.y }}>
          <div className="rounded-xl px-3 py-2 flex flex-col items-center gap-1 min-w-[90px] shadow-lg"
               style={{ background: `${node.color}20`, border: `2px solid ${node.color}60`, backdropFilter: 'blur(4px)' }}>
            <div className="text-xl">{icons[node.type]}</div>
            <div className="text-[10px] font-medium text-white text-center leading-tight whitespace-pre-line">
              {node.label}
            </div>
            <div className="text-[8px] font-bold px-2 py-0.5 rounded-full"
                 style={{ background: `${node.color}30`, color: node.color }}>
              {node.type}
            </div>
          </div>
        </div>
      ))}

      {/* UI chrome */}
      <div className="absolute top-3 left-3 flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500 opacity-70"/>
        <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-70"/>
        <div className="w-3 h-3 rounded-full bg-green-500 opacity-70"/>
        <span className="ml-2 text-xs text-slate-500">Affaire #AF-2024-089 — Réseau Kankan</span>
      </div>

      <div className="absolute top-3 right-3 flex gap-2">
        <div className="px-3 py-1 rounded-lg text-xs" style={{ background: 'rgba(0,148,96,0.2)', color: '#009460', border: '1px solid rgba(0,148,96,0.3)' }}>● ACTIF</div>
        <div className="px-3 py-1 rounded-lg text-xs text-slate-400" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>6 entités</div>
      </div>

      <div className="absolute bottom-3 left-3 flex gap-2">
        {['+', '−', '⊞'].map(icon => (
          <div key={icon} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 text-sm cursor-pointer hover:text-white transition-colors"
               style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {icon}
          </div>
        ))}
      </div>

      <div className="absolute bottom-3 right-3 text-xs text-slate-600">🤖 IA: 2 connexions suggérées</div>
    </div>
  )
}

// ── Use Cases Tab Panel ─────────────────────────────────────────────────────

const USE_CASES = [
  {
    id: 'police',
    label: '🛡️ Police',
    title: 'Police Nationale',
    features: [
      'Cartographie des réseaux de crime organisé',
      'Suivi des suspects multi-régions',
      'Coordination entre commissariats',
      'Rapports d\'enquête officiels PDF',
      'Base de données des véhicules suspects',
    ],
    color: '#1e40af',
  },
  {
    id: 'gendarmerie',
    label: '⚖️ Gendarmerie',
    title: 'Gendarmerie Nationale',
    features: [
      'Enquêtes rurales et périurbaines',
      'Cartographie des 33 préfectures',
      'Coordination avec sous-préfectures',
      'Suivi des activités terroristes',
      'Rapports pour le Parquet Militaire',
    ],
    color: '#14532d',
  },
  {
    id: 'douane',
    label: '🔍 Douanes',
    title: 'Douanes Nationales',
    features: [
      'Cartographie des réseaux de contrebande',
      'Suivi des flux financiers suspects',
      'Identification des complices douaniers',
      'Coordination aux postes frontaliers',
      'Dossiers pour la Justice Financière',
    ],
    color: '#92400e',
  },
  {
    id: 'dgse',
    label: '🔐 Renseignement',
    title: 'Services de Renseignement',
    features: [
      'Cartographie des réseaux de menaces',
      'Analyse des communications interceptées',
      'Surveillance de cibles multiples',
      'Rapports classifiés et chiffrés',
      'Coordination inter-services',
    ],
    color: '#374151',
  },
]

// ── Main Component ───────────────────────────────────────────────────────────

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('police')

  const activeCase = USE_CASES.find(c => c.id === activeTab)!

  return (
    <div className="min-h-screen bg-[#060b14] text-white overflow-x-hidden">
      <NavBar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
             style={{ background: '#CE1126' }} />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
             style={{ background: '#009460' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
             style={{ background: '#FCD116' }} />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8 font-medium"
               style={{ background: 'rgba(252,209,22,0.08)', color: '#FCD116', border: '1px solid rgba(252,209,22,0.2)' }}>
            🇬🇳 Plateforme Nationale d'Investigation — République de Guinée
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            Cartographiez les
            <br />
            <span style={{ background: 'linear-gradient(90deg, #CE1126 10%, #FCD116 50%, #009460 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              réseaux criminels
            </span>
            <br />
            de Guinée
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Plateforme d'investigation numérique pour Police, Gendarmerie, Douanes et services de renseignement.
            Enquêtes collaboratives, cartographie réseau, intelligence artificielle.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login"
                  className="px-8 py-4 rounded-xl font-bold text-white text-lg transition-all hover:opacity-90 hover:scale-105 shadow-2xl"
                  style={{ background: 'linear-gradient(135deg, #CE1126, #009460)', boxShadow: '0 0 40px rgba(206,17,38,0.3)' }}>
              Commencer Gratuitement
            </Link>
            <a href="#demo"
               className="px-8 py-4 rounded-xl font-semibold text-white text-lg transition-all hover:bg-white/10 border border-white/20">
              Voir la Démo ↓
            </a>
          </div>

          {/* Guinea flag strip */}
          <div className="flex justify-center mt-12">
            <div className="flex gap-0.5 rounded-full overflow-hidden w-32 h-1.5">
              <div className="flex-1" style={{ background: '#CE1126' }} />
              <div className="flex-1" style={{ background: '#FCD116' }} />
              <div className="flex-1" style={{ background: '#009460' }} />
            </div>
          </div>

          {/* Corps logos */}
          <div className="flex justify-center gap-8 mt-12 flex-wrap">
            <div className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <PoliceLogoSVG size={64} />
              <span className="text-xs text-slate-500">Police</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <GendarmerieLogoSVG size={64} />
              <span className="text-xs text-slate-500">Gendarmerie</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <DouanesLogoSVG size={64} />
              <span className="text-xs text-slate-500">Douanes</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-y border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: '33', label: 'Préfectures couvertes', color: '#CE1126' },
              { val: '500+', label: 'Agents actifs', color: '#FCD116' },
              { val: '8', label: 'Corps de sécurité', color: '#009460' },
              { val: '2 400+', label: 'Localités en base', color: '#CE1126' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-4xl font-black mb-2" style={{ color: stat.color }}>{stat.val}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo Canvas ────────────────────────────────────────────────────── */}
      <section id="demo" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6 font-medium"
                 style={{ background: 'rgba(0,148,96,0.1)', color: '#009460', border: '1px solid rgba(0,148,96,0.2)' }}>
              DÉMO INTERACTIVE
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Canvas d'Investigation en Direct
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Visualisez les liens entre entités, ajoutez des connexions étiquetées, collaborez en temps réel.
              C'est ce que vos enquêteurs verront chaque jour.
            </p>
          </div>
          <DemoCanvas />
          <div className="flex justify-center mt-8">
            <Link to="/login"
                  className="px-8 py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #CE1126, #009460)' }}>
              Essayer le Vrai Canvas →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Use Cases ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#04080f]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Conçu pour Chaque Corps</h2>
            <p className="text-slate-400 text-lg">Une plateforme unifiée, adaptée aux besoins de chaque service</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {USE_CASES.map(c => (
              <button key={c.id} onClick={() => setActiveTab(c.id)}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={activeTab === c.id
                        ? { background: c.color, color: '#fff' }
                        : { background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
                {c.label}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="rounded-2xl p-8 md:p-12"
               style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${activeCase.color}40` }}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6" style={{ color: activeCase.color }}>
                  {activeCase.title}
                </h3>
                <ul className="space-y-4">
                  {activeCase.features.map(f => (
                    <li key={f} className="flex items-start gap-3">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ fill: activeCase.color }}>
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      <span className="text-slate-300">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <div className="rounded-xl p-6" style={{ background: `${activeCase.color}10`, border: `1px solid ${activeCase.color}20` }}>
                  <div className="text-4xl mb-3">🗺️</div>
                  <div className="font-semibold mb-2">Réseau d'enquête visuel</div>
                  <div className="text-sm text-slate-400">Relier suspects, véhicules et lieux en quelques clics</div>
                </div>
                <div className="rounded-xl p-6" style={{ background: 'rgba(252,209,22,0.05)', border: '1px solid rgba(252,209,22,0.1)' }}>
                  <div className="text-4xl mb-3">🤖</div>
                  <div className="font-semibold mb-2">IA pour la Guinée</div>
                  <div className="text-sm text-slate-400">Autofill des localités, suggestions de liens, anomalies détectées</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Entity Types ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Types d'Entités</h2>
            <p className="text-slate-400 text-lg">Reliez n'importe quel type d'entité sur votre canvas d'investigation</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: '👤', label: 'Personne', color: '#3b82f6', desc: 'Suspects, témoins, victimes' },
              { icon: '🚗', label: 'Véhicule', color: '#f59e0b', desc: 'Voitures, motos, camions' },
              { icon: '📍', label: 'Adresse', color: '#10b981', desc: 'Lieux, domiciles, QG' },
              { icon: '📱', label: 'Téléphone', color: '#8b5cf6', desc: 'Communications, numéros' },
              { icon: '📅', label: 'Événement', color: '#ef4444', desc: 'Incidents, transactions' },
              { icon: '🏢', label: 'Organisation', color: '#06b6d4', desc: 'Entreprises, groupes' },
              { icon: '📄', label: 'Document', color: '#f97316', desc: 'Pièces, preuves, contrats' },
              { icon: '🏦', label: 'Compte Bancaire', color: '#84cc16', desc: 'Finances, virements' },
            ].map(ent => (
              <div key={ent.label}
                   className="rounded-2xl p-5 text-center transition-all hover:scale-105 cursor-default"
                   style={{ background: `${ent.color}10`, border: `1px solid ${ent.color}25` }}>
                <div className="text-4xl mb-2">{ent.icon}</div>
                <div className="font-bold text-sm mb-1" style={{ color: ent.color }}>{ent.label}</div>
                <div className="text-xs text-slate-500">{ent.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features grid ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#04080f]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Fonctionnalités Avancées</h2>
            <p className="text-slate-400 text-lg">Tout ce dont vos enquêteurs ont besoin, dans une seule plateforme</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🤝',
                title: 'Collaboration Temps Réel',
                desc: 'Plusieurs enquêteurs simultanés sur le même canvas. Synchronisation instantanée. Pas de conflit de version.',
                color: '#CE1126',
              },
              {
                icon: '🤖',
                title: 'Intelligence Artificielle',
                desc: 'Suggestions de connexions, autofill des 33 préfectures et leurs sous-préfectures, détection d\'anomalies comportementales.',
                color: '#FCD116',
              },
              {
                icon: '🔐',
                title: 'Sécurité Souveraine',
                desc: 'Données hébergées en Guinée. Chiffrement AES-256. Contrôle d\'accès par corps, grade et région.',
                color: '#009460',
              },
              {
                icon: '🖨️',
                title: 'Rapports Officiels',
                desc: 'Export PDF des réseaux en haute résolution. Rapports d\'enquête formatés pour le Parquet, les Juges et la hiérarchie.',
                color: '#CE1126',
              },
              {
                icon: '📱',
                title: 'Multi-Appareils',
                desc: 'Conçu pour PC, tablette et smartphone. Interface optimisée pour le terrain, même avec connexion limitée.',
                color: '#FCD116',
              },
              {
                icon: '🌍',
                title: 'Données Guinéennes Complètes',
                desc: '33 préfectures, toutes sous-préfectures, districts, villes et quartiers. Base nationale de noms et identités.',
                color: '#009460',
              },
            ].map(feat => (
              <div key={feat.title} className="rounded-2xl p-7 transition-all hover:scale-[1.02] hover:bg-white/5"
                   style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-4xl mb-4">{feat.icon}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: feat.color }}>{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Corps Showcase ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Forces de Sécurité Intégrées</h2>
          <p className="text-slate-400 text-lg mb-16">Tous les corps de sécurité nationale de la République de Guinée</p>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-8 items-center justify-items-center">
            <div className="flex flex-col items-center gap-3">
              <PoliceLogoSVG size={80} />
              <span className="text-sm text-slate-400">Police Nationale</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <GendarmerieLogoSVG size={80} />
              <span className="text-sm text-slate-400">Gendarmerie Nationale</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <DouanesLogoSVG size={80} />
              <span className="text-sm text-slate-400">Douanes Nationales</span>
            </div>
            {[
              { icon: '🔐', label: 'Sécurité d\'État', color: '#374151' },
              { icon: '🎖️', label: 'Garde Républicaine', color: '#7c2d12' },
              { icon: '🚒', label: 'Sapeurs-Pompiers', color: '#991b1b' },
              { icon: '⚖️', label: 'Admin. Pénitentiaire', color: '#374151' },
              { icon: '🌿', label: 'Eaux & Forêts', color: '#166534' },
            ].map(corps => (
              <div key={corps.label} className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                     style={{ background: corps.color + '40', border: `2px solid ${corps.color}60` }}>
                  {corps.icon}
                </div>
                <span className="text-sm text-slate-400 text-center">{corps.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
               style={{ background: 'linear-gradient(135deg, rgba(206,17,38,0.15) 0%, rgba(0,148,96,0.15) 100%)', border: '1px solid rgba(252,209,22,0.2)' }}>
            <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
                 style={{ background: '#CE1126', transform: 'translate(-50%, -50%)' }} />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
                 style={{ background: '#009460', transform: 'translate(50%, 50%)' }} />
            <div className="relative z-10">
              <div className="flex justify-center gap-1 mb-8">
                <div className="h-2 w-12 rounded-l-full" style={{ background: '#CE1126' }} />
                <div className="h-2 w-12" style={{ background: '#FCD116' }} />
                <div className="h-2 w-12 rounded-r-full" style={{ background: '#009460' }} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Prêt à moderniser vos enquêtes ?
              </h2>
              <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                Rejoignez les unités d'élite qui utilisent déjà GuinéeEnquête.
                Démo gratuite, déploiement rapide, formation incluse.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/login"
                      className="px-10 py-4 rounded-xl font-bold text-white text-lg transition-all hover:opacity-90 hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #CE1126, #009460)' }}>
                  Démarrer Maintenant
                </Link>
                <Link to="/contact"
                      className="px-10 py-4 rounded-xl font-semibold text-white text-lg transition-all hover:bg-white/10 border border-white/20">
                  Contacter l'Équipe
                </Link>
              </div>
              <p className="mt-6 text-sm text-slate-500">
                📱 WhatsApp: +224 629 653 636 &nbsp;•&nbsp; ✉️ golehlee@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
