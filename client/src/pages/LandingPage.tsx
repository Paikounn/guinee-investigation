import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield, Network, Users, Lock, Globe, Zap, Download,
  ChevronRight, Menu, X, ArrowRight, CheckCircle,
  Eye, Database, GitBranch, Radio,
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

// ─── Corps badge SVG ──────────────────────────────────────────────────────────

function ShieldBadge({
  initials, color, bg, size = 56,
}: { initials: string; color: string; bg: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 56 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 2L52 12V32C52 46 40 58 28 62C16 58 4 46 4 32V12L28 2Z" fill={bg} stroke={color} strokeWidth="2" />
      <text x="28" y="37" textAnchor="middle" fontSize={initials.length > 3 ? '9' : '11'} fontWeight="bold" fill={color} fontFamily="system-ui,sans-serif">
        {initials}
      </text>
    </svg>
  )
}

// ─── Guinea security corps data ───────────────────────────────────────────────

const GUINEA_CORPS = [
  { initials: 'PN',    name: 'Police Nationale',                   color: '#60a5fa', bg: '#1e3a5f', desc: 'Sécurité publique & investigation criminelle' },
  { initials: 'GN',    name: 'Gendarmerie Nationale',              color: '#f87171', bg: '#5f1e1e', desc: 'Sécurité territoriale & ordre public' },
  { initials: 'DN',    name: 'Douane Nationale',                   color: '#34d399', bg: '#1e5f3a', desc: 'Contrôle des frontières & lutte contre la fraude' },
  { initials: 'DGSE',  name: 'Sécurité d\'État',                   color: '#a78bfa', bg: '#3b1e5f', desc: 'Renseignement & sécurité nationale' },
  { initials: 'BIR',   name: 'Brigade d\'Intervention Rapide',     color: '#fb923c', bg: '#5f3a1e', desc: 'Opérations spéciales & intervention rapide' },
  { initials: 'SCRIC', name: 'Rech. & Investigation Criminelle',   color: '#22d3ee', bg: '#1e4a5f', desc: 'Police judiciaire & criminologie' },
  { initials: 'SP',    name: 'Sécurité Présidentielle',            color: '#fbbf24', bg: '#5f4a1e', desc: 'Protection des hautes autorités' },
  { initials: 'IP',    name: 'INTERPOL Guinée',                    color: '#94a3b8', bg: '#1e2a3f', desc: 'Coopération policière internationale' },
]

// ─── Use cases per corps ──────────────────────────────────────────────────────

const USE_CASES = [
  {
    corps: 'Police Nationale',
    color: 'text-blue-400',
    activeBg: 'bg-blue-500/20 border-blue-500/50',
    badge: 'bg-blue-500/20 border border-blue-500/40 text-blue-300',
    title: 'Démanteler les réseaux criminels',
    body: `La Police Nationale fait face à des réseaux criminels de plus en plus complexes. Les affaires impliquent des dizaines d'acteurs, de véhicules, de lieux et d'organisations liées entre elles. Guinée Investigation connecte toutes ces données en un graphe relationnel interactif, permettant aux enquêteurs de visualiser instantanément les liens cachés et d'identifier les chefs de réseau.`,
    points: ['Cartographie des réseaux criminels', 'Suivi des individus & véhicules', 'Corrélation multi-affaires', 'Collaboration inter-brigades'],
  },
  {
    corps: 'Gendarmerie Nationale',
    color: 'text-red-400',
    activeBg: 'bg-red-500/20 border-red-500/50',
    badge: 'bg-red-500/20 border border-red-500/40 text-red-300',
    title: 'Sécuriser le territoire national',
    body: `La Gendarmerie couvre l'ensemble du territoire guinéen, des zones rurales aux frontières sensibles. Guinée Investigation permet de coordonner les opérations entre brigades géographiquement dispersées, de partager en temps réel les informations sur les suspects et de cartographier les zones d'activité criminelle à l'échelle nationale.`,
    points: ['Coordination inter-brigades', 'Surveillance des frontières', 'Suivi des mouvements suspects', 'Cartographie des incidents'],
  },
  {
    corps: 'Douane Nationale',
    color: 'text-emerald-400',
    activeBg: 'bg-emerald-500/20 border-emerald-500/50',
    badge: 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300',
    title: 'Lutter contre la fraude & la contrebande',
    body: `Les réseaux de contrebande et de fraude douanière sont sophistiqués et transfrontaliers. Guinée Investigation permet aux agents douaniers de tracer les routes de contrebande, d'identifier les organisations impliquées, de relier les saisies entre elles et de cartographier les réseaux de conteneurs suspects à travers les ports et aéroports.`,
    points: ['Traçage des routes de contrebande', 'Analyse des conteneurs suspects', 'Liens entre saisies & réseaux', 'Enquêtes sur la fraude fiscale'],
  },
  {
    corps: 'Sécurité d\'État',
    color: 'text-purple-400',
    activeBg: 'bg-purple-500/20 border-purple-500/50',
    badge: 'bg-purple-500/20 border border-purple-500/40 text-purple-300',
    title: 'Protéger la sécurité nationale',
    body: `La Direction Générale de la Sécurité d'État fait face à des menaces complexes mêlant renseignement humain, sources ouvertes et données classifiées. Guinée Investigation offre une plateforme sécurisée pour centraliser et analyser ces informations, identifier les acteurs des menaces et produire des rapports d'analyse pour les décideurs.`,
    points: ['Analyse du renseignement', 'Cartographie des menaces', 'Corrélation HUMINT / OSINT', 'Rapports pour les autorités'],
  },
]

// ─── Features ─────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: Network,   title: 'Graphe relationnel',       desc: 'Visualisez les connexions entre suspects, véhicules, lieux et organisations sur une carte interactive.' },
  { icon: Radio,     title: 'Collaboration temps réel', desc: 'Plusieurs enquêteurs travaillent simultanément sur la même affaire, curseurs en direct.' },
  { icon: Lock,      title: 'Sécurité maximale',        desc: 'Authentification par corps, isolation des données, accès strictement contrôlé par rôle.' },
  { icon: Database,  title: '5 types d\'entités',       desc: 'Personnes, véhicules, organisations, lieux et conteneurs — avec leurs données détaillées.' },
  { icon: GitBranch, title: 'Multi-corps',              desc: 'Police, Gendarmerie, Douane et autres corps partagent une infrastructure commune sécurisée.' },
  { icon: Download,  title: 'Export SVG',               desc: 'Exportez vos graphes d\'investigation en haute qualité pour les rapports officiels.' },
  { icon: Eye,       title: 'Statuts d\'affaires',      desc: 'Suivi complet : Ouvert, En cours, Clôturé, Archivé — avec filtrage et recherche.' },
  { icon: Globe,     title: 'Coopération INTERPOL',     desc: 'Architecture prête pour l\'interconnexion avec les bases de données internationales.' },
]

// ─── Main component ───────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate()
  const token = useAuthStore((s) => s.token)
  const [activeTab, setActiveTab] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function goToApp() {
    navigate(token ? '/cases' : '/login')
  }

  return (
    <div className="bg-[#080c14] text-white min-h-screen">

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#080c14]/95 backdrop-blur-md border-b border-slate-800/60 shadow-xl shadow-black/40' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-tight">Guinée Investigation</p>
              <p className="text-xs text-slate-500 leading-tight">République de Guinée</p>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Plateforme', href: '#features' },
              { label: 'Corps', href: '#corps' },
              { label: 'Cas d\'usage', href: '#usecases' },
              { label: 'À propos', href: '#about' },
            ].map((l) => (
              <a key={l.label} href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={goToApp} className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">
              Se connecter
            </button>
            <button onClick={goToApp} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-2">
              Accéder à la plateforme <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu */}
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-[#0b1020] border-b border-slate-800 px-6 py-4 space-y-3">
            {['Plateforme', 'Corps', 'Cas d\'usage', 'À propos'].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s/g,'').replace("'","")}`} className="block text-slate-400 hover:text-white text-sm py-1" onClick={() => setMenuOpen(false)}>{l}</a>
            ))}
            <button onClick={goToApp} className="w-full bg-cyan-500 text-slate-900 text-sm font-semibold py-2.5 rounded-lg mt-2">
              Accéder à la plateforme
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(#94a3b8 1px,transparent 1px),linear-gradient(90deg,#94a3b8 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        {/* Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 mb-8 text-xs font-medium text-cyan-400">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            Plateforme officielle — République de Guinée
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
            Connectez les données.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Résolvez les affaires.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            La première plateforme nationale d'investigation criminelle unifiée pour tous les corps de sécurité de Guinée. Graphes relationnels, collaboration temps réel, sécurité maximale.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button onClick={goToApp} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-8 py-3.5 rounded-xl transition-all shadow-2xl shadow-cyan-500/25 flex items-center justify-center gap-2 text-base">
              Accéder à la plateforme <ArrowRight className="w-5 h-5" />
            </button>
            <a href="#usecases" className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-base">
              Voir les cas d'usage <ChevronRight className="w-5 h-5" />
            </a>
          </div>

          {/* Hero corps strip */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {GUINEA_CORPS.slice(0, 6).map((c) => (
              <span key={c.initials} className="text-xs px-3 py-1.5 rounded-full font-medium border" style={{ color: c.color, borderColor: c.color + '40', backgroundColor: c.bg + '80' }}>
                {c.name}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 animate-bounce">
          <div className="w-5 h-8 border border-slate-700 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-slate-600 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-slate-800/60 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '8+',   label: 'Corps de sécurité',          sub: 'connectés nationalement' },
            { value: '100%', label: 'Chiffrement',                 sub: 'des données sensibles' },
            { value: '5',    label: 'Types d\'entités',            sub: 'par affaire' },
            { value: '∞',    label: 'Collaboration temps réel',    sub: 'entre enquêteurs' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-cyan-400 mb-1">{s.value}</p>
              <p className="text-white font-semibold text-sm">{s.label}</p>
              <p className="text-slate-500 text-xs mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLEM STATEMENT ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-4">Le constat</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
              85% des enquêteurs perdent du temps à chercher des connexions entre des données isolées.
            </h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Chaque corps de sécurité dispose de ses propres systèmes. Les données ne communiquent pas. Les connexions entre affaires, suspects et réseaux criminels restent invisibles — jusqu'à ce qu'il soit trop tard.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Guinée Investigation centralise tout : personnes, véhicules, lieux, organisations et conteneurs dans une interface graphique collaborative accessible à tous les corps autorisés.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: X,            color: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/20',     label: 'Données éparpillées entre services' },
              { icon: X,            color: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/20',     label: 'Connexions invisibles entre affaires' },
              { icon: X,            color: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/20',     label: 'Pas de collaboration inter-corps' },
              { icon: X,            color: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/20',     label: 'Rapports manuels, lents et incomplets' },
              { icon: CheckCircle,  color: 'text-cyan-400',  bg: 'bg-cyan-500/10 border-cyan-500/20',   label: 'Graphe unifié de toutes les entités' },
              { icon: CheckCircle,  color: 'text-cyan-400',  bg: 'bg-cyan-500/10 border-cyan-500/20',   label: 'Collaboration multi-corps sécurisée' },
              { icon: CheckCircle,  color: 'text-cyan-400',  bg: 'bg-cyan-500/10 border-cyan-500/20',   label: 'Visualisation des réseaux criminels' },
              { icon: CheckCircle,  color: 'text-cyan-400',  bg: 'bg-cyan-500/10 border-cyan-500/20',   label: 'Export officiel en un clic' },
            ].map(({ icon: Icon, color, bg, label }) => (
              <div key={label} className={`flex items-start gap-2.5 p-3 rounded-xl border ${bg}`}>
                <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${color}`} />
                <span className="text-xs text-slate-300 leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section id="usecases" className="bg-slate-900/30 border-y border-slate-800/60 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">Cas d'usage</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Adapté à chaque corps de sécurité</h2>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {USE_CASES.map((uc, i) => (
              <button
                key={uc.corps}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${activeTab === i ? uc.activeBg + ' text-white' : 'border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'}`}
              >
                {uc.corps}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {USE_CASES.map((uc, i) => (
            <div key={uc.corps} className={`transition-all ${activeTab === i ? 'block' : 'hidden'}`}>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <span className={`text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border ${uc.badge}`}>
                    {uc.corps}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mt-4 mb-4">{uc.title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-6">{uc.body}</p>
                  <div className="space-y-2">
                    {uc.points.map((p) => (
                      <div key={p} className="flex items-center gap-2.5">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${uc.color}`} />
                        <span className="text-slate-300 text-sm">{p}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={goToApp} className="mt-8 flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                    Accéder à la plateforme <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Mockup card */}
                <div className="bg-[#0b1020] border border-slate-800 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    <span className="text-xs text-slate-600 ml-2 font-mono">affaire-2026-{String(i + 1).padStart(3, '0')}</span>
                  </div>
                  {/* Fake graph nodes */}
                  <div className="relative h-52 bg-[#080c14] rounded-xl border border-slate-800/60 overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#94a3b8 1px,transparent 1px),linear-gradient(90deg,#94a3b8 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
                    {/* Nodes */}
                    {[
                      { x: 30, y: 35, label: 'Suspect A', color: '#60a5fa' },
                      { x: 65, y: 20, label: 'Véhicule', color: '#fbbf24' },
                      { x: 70, y: 60, label: 'Lieu', color: '#34d399' },
                      { x: 45, y: 68, label: 'Réseau', color: '#a78bfa' },
                      { x: 15, y: 65, label: 'Suspect B', color: '#60a5fa' },
                    ].map((node) => (
                      <div key={node.label} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${node.x}%`, top: `${node.y}%` }}>
                        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[8px] font-bold text-white shadow-lg" style={{ borderColor: node.color, backgroundColor: node.color + '30' }}>
                          {node.label.slice(0, 1)}
                        </div>
                        <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] text-slate-500">{node.label}</div>
                      </div>
                    ))}
                    {/* Lines */}
                    <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
                      <line x1="30%" y1="35%" x2="65%" y2="20%" stroke="#475569" strokeWidth="1" />
                      <line x1="65%" y1="20%" x2="70%" y2="60%" stroke="#475569" strokeWidth="1" />
                      <line x1="70%" y1="60%" x2="45%" y2="68%" stroke="#475569" strokeWidth="1" />
                      <line x1="45%" y1="68%" x2="15%" y2="65%" stroke="#475569" strokeWidth="1" />
                      <line x1="15%" y1="65%" x2="30%" y2="35%" stroke="#475569" strokeWidth="1" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-2">
                      {['Personne', 'Véhicule', 'Lieu'].map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 bg-slate-800 text-slate-500 rounded-md">{t}</span>
                      ))}
                    </div>
                    <span className="text-xs text-cyan-400 flex items-center gap-1"><Radio className="w-3 h-3" /> En direct</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CORPS SECTION ── */}
      <section id="corps" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">Corps de sécurité</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Toutes les forces de sécurité nationales
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Une plateforme unique unifiée pour l'ensemble des corps de sécurité de la République de Guinée.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {GUINEA_CORPS.map((corps) => (
              <div key={corps.initials} className="group bg-slate-900/40 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 text-center transition-all cursor-default">
                <div className="flex justify-center mb-4">
                  <ShieldBadge initials={corps.initials} color={corps.color} bg={corps.bg} size={52} />
                </div>
                <p className="font-semibold text-white text-sm leading-tight mb-1">{corps.name}</p>
                <p className="text-xs text-slate-500 leading-snug">{corps.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="bg-slate-900/30 border-y border-slate-800/60 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">Fonctionnalités</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Une suite complète d'outils conçus spécifiquement pour les besoins des enquêteurs guinéens.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[#0b1020] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:border-cyan-500/40 transition-colors">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="about" className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-b from-slate-900 to-[#0b1020] border border-slate-800 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#94a3b8 1px,transparent 1px),linear-gradient(90deg,#94a3b8 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-cyan-400" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Prêt à commencer ?
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Rejoignez la plateforme nationale d'investigation et commencez à connecter vos données pour résoudre vos affaires plus rapidement.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={goToApp} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-8 py-3.5 rounded-xl transition-all shadow-2xl shadow-cyan-500/25 flex items-center justify-center gap-2">
                  Accéder à la plateforme <ArrowRight className="w-5 h-5" />
                </button>
                <a href="mailto:admin@securite.gn" className="border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
                  Contacter l'équipe
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-800/60 bg-[#060a11]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="font-bold text-white text-sm">Guinée Investigation</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Plateforme nationale d'investigation criminelle unifiée pour les corps de sécurité de la République de Guinée.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Plateforme</p>
              <div className="space-y-2">
                {['Connexion', 'Fonctionnalités', 'Corps', 'Cas d\'usage'].map((l) => (
                  <div key={l}><a href="#" onClick={goToApp} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">{l}</a></div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Corps</p>
              <div className="space-y-2">
                {GUINEA_CORPS.slice(0, 5).map((c) => (
                  <div key={c.initials}><span className="text-slate-500 text-sm">{c.name}</span></div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Contact</p>
              <div className="space-y-2 text-slate-500 text-sm">
                <p>Ministère de la Sécurité</p>
                <p>Conakry, République de Guinée</p>
                <a href="mailto:admin@securite.gn" className="text-cyan-500 hover:text-cyan-400 transition-colors block mt-2">
                  admin@securite.gn
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-xs">
              © {new Date().getFullYear()} Guinée Investigation — République de Guinée. Tous droits réservés.
            </p>
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-cyan-500" />
              <span className="text-slate-600 text-xs">Sécurisé · Chiffré · Confidentiel</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
