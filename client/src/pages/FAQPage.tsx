import { useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

// ── Mini canvas illustration ──────────────────────────────────────────────────
function CanvasIllustration({ step }: { step: number }) {
  const illustrations = [
    // Step 1 — Create a case
    <div key={1} className="relative rounded-xl overflow-hidden h-36 flex items-center justify-center"
         style={{ background: '#070d1a', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
             style={{ background: 'linear-gradient(135deg, rgba(206,17,38,0.2), rgba(0,148,96,0.2))', border: '1px solid rgba(252,209,22,0.2)' }}>
          📁
        </div>
        <div className="text-center">
          <div className="text-xs font-bold text-white">AF-2024-089</div>
          <div className="text-[10px] text-slate-500">Réseau Kankan · Police Nationale · ACTIF</div>
        </div>
      </div>
    </div>,

    // Step 2 — Add entities
    <div key={2} className="relative rounded-xl overflow-hidden h-36"
         style={{ background: '#070d1a', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="absolute inset-0 p-3 flex items-center justify-center gap-3 flex-wrap">
        {[
          { emoji: '👤', label: 'Alpha D.', color: '#3b82f6' },
          { emoji: '🚗', label: 'AA-1234', color: '#f59e0b' },
          { emoji: '📍', label: 'Kaloum', color: '#10b981' },
          { emoji: '📱', label: '+224 6xx', color: '#a855f7' },
        ].map(n => (
          <div key={n.label} className="rounded-xl px-3 py-2 flex items-center gap-1.5 text-xs font-medium"
               style={{ background: `${n.color}20`, border: `1.5px solid ${n.color}50`, color: n.color }}>
            <span>{n.emoji}</span><span>{n.label}</span>
          </div>
        ))}
      </div>
    </div>,

    // Step 3 — Link entities
    <div key={3} className="relative rounded-xl overflow-hidden h-36"
         style={{ background: '#070d1a', border: '1px solid rgba(255,255,255,0.08)' }}>
      <svg className="absolute inset-0 w-full h-full">
        <line x1="70" y1="68" x2="180" y2="68" stroke="#FCD116" strokeWidth="2" strokeDasharray="5 3"/>
        <line x1="180" y1="68" x2="290" y2="90" stroke="#CE1126" strokeWidth="2" strokeDasharray="5 3"/>
        <line x1="70" y1="68" x2="130" y2="110" stroke="#009460" strokeWidth="2" strokeDasharray="5 3"/>
        <rect x="95" y="55" width="80" height="16" rx="8" fill="#0d1b2e" opacity="0.9"/>
        <text x="135" y="67" textAnchor="middle" fontSize="8" fill="#FCD116">Propriétaire de</text>
        <rect x="195" y="70" width="70" height="16" rx="8" fill="#0d1b2e" opacity="0.9"/>
        <text x="230" y="82" textAnchor="middle" fontSize="8" fill="#CE1126">Associé à</text>
        <rect x="70" y="100" width="60" height="16" rx="8" fill="#0d1b2e" opacity="0.9"/>
        <text x="100" y="112" textAnchor="middle" fontSize="8" fill="#009460">Réside à</text>
      </svg>
      <div className="absolute" style={{ left: 40, top: 50 }}>
        <div className="rounded-lg px-2 py-1 text-xs" style={{ background: '#3b82f620', border: '1.5px solid #3b82f650', color: '#3b82f6' }}>👤 Alpha</div>
      </div>
      <div className="absolute" style={{ left: 160, top: 50 }}>
        <div className="rounded-lg px-2 py-1 text-xs" style={{ background: '#f59e0b20', border: '1.5px solid #f59e0b50', color: '#f59e0b' }}>🚗 Toyota</div>
      </div>
      <div className="absolute" style={{ left: 255, top: 73 }}>
        <div className="rounded-lg px-2 py-1 text-xs" style={{ background: '#8b5cf620', border: '1.5px solid #8b5cf650', color: '#8b5cf6' }}>🏢 Réseau</div>
      </div>
      <div className="absolute" style={{ left: 85, top: 95 }}>
        <div className="rounded-lg px-2 py-1 text-xs" style={{ background: '#10b98120', border: '1.5px solid #10b98150', color: '#10b981' }}>📍 Kaloum</div>
      </div>
    </div>,

    // Step 4 — Collaborate
    <div key={4} className="relative rounded-xl overflow-hidden h-36 flex items-center justify-center"
         style={{ background: '#070d1a', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center gap-4">
        {[
          { name: 'A. Diallo', corps: 'POLICE', color: '#3b82f6' },
          { name: 'M. Bah', corps: 'GENDARMERIE', color: '#10b981' },
          { name: 'F. Camara', corps: 'DOUANE', color: '#f59e0b' },
        ].map(u => (
          <div key={u.name} className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm border-2"
                 style={{ backgroundColor: u.color, borderColor: u.color }}>
              {u.name.charAt(0)}
            </div>
            <div className="text-center">
              <div className="text-xs font-medium text-white">{u.name}</div>
              <div className="text-[9px] text-slate-500">{u.corps}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-emerald-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        En direct
      </div>
    </div>,

    // Step 5 — Export
    <div key={5} className="relative rounded-xl overflow-hidden h-36 flex items-center justify-center gap-4"
         style={{ background: '#070d1a', border: '1px solid rgba(255,255,255,0.08)' }}>
      {[
        { icon: '🖨️', label: 'Imprimer', desc: 'Rapport officiel' },
        { icon: '📁', label: 'SVG', desc: 'Schéma réseau' },
        { icon: '📄', label: 'PDF', desc: 'Dossier judiciaire' },
      ].map(opt => (
        <div key={opt.label} className="flex flex-col items-center gap-2 p-3 rounded-xl"
             style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span className="text-3xl">{opt.icon}</span>
          <span className="text-xs font-bold text-white">{opt.label}</span>
          <span className="text-[9px] text-slate-500">{opt.desc}</span>
        </div>
      ))}
    </div>,
  ]
  return illustrations[step - 1] ?? null
}

// ── FAQ accordion ─────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: 'Comment créer une nouvelle affaire ?',
    a: 'Sur la page "Affaires", cliquez sur le bouton "Nouvelle affaire" (en haut à droite). Remplissez le titre, sélectionnez votre corps de sécurité, la région et le statut initial. L\'affaire apparaît immédiatement dans votre tableau de bord.',
  },
  {
    q: 'Comment ajouter une entité (personne, véhicule…) au canvas ?',
    a: 'Dans le canvas d\'investigation, utilisez la barre gauche "Ajouter une entité". Cliquez sur le type souhaité (👤 Personne, 🚗 Véhicule, 📍 Lieu, etc.), saisissez un nom ou identifiant, et appuyez sur "Ajouter au canvas". L\'entité apparaît sur le canvas et vous pouvez la déplacer librement.',
  },
  {
    q: 'Comment relier deux entités entre elles ?',
    a: 'Survolez un nœud jusqu\'à voir apparaître les points de connexion (cercles colorés en haut et en bas). Cliquez sur un point et faites glisser vers l\'autre nœud. Une boîte de dialogue s\'ouvre pour choisir le type de relation ("Propriétaire de", "Associé à", "Réside à"…). Vous pouvez aussi saisir un libellé personnalisé.',
  },
  {
    q: 'Comment modifier les détails d\'un nœud ?',
    a: 'Cliquez sur n\'importe quel nœud du canvas. Le panneau de détails s\'ouvre à droite. Remplissez les champs spécifiques au type (pour une personne : rôle, âge, pièce d\'identité, téléphone ; pour un lieu : ville avec autofill des localités guinéennes, coordonnées GPS). Cliquez sur "Enregistrer".',
  },
  {
    q: 'L\'autofill des villes et préfectures, comment ça marche ?',
    a: 'Dans les champs "Ville/Localité" et "Préfecture" des nœuds Personne, Lieu et Événement, commencez à taper les premières lettres d\'une ville ou préfecture guinéenne. Une liste déroulante apparaît avec les correspondances dans les 33 préfectures et leurs sous-préfectures. Cliquez sur une suggestion pour la sélectionner.',
  },
  {
    q: 'Comment collaborer avec des collègues d\'autres corps ?',
    a: 'Plusieurs enquêteurs peuvent travailler simultanément sur la même affaire. Chaque utilisateur connecté apparaît sous forme d\'avatar coloré dans la barre du haut et son curseur est visible en temps réel sur le canvas. Les modifications (ajout de nœuds, connexions) sont synchronisées instantanément pour tous.',
  },
  {
    q: 'Comment supprimer un nœud ou un lien ?',
    a: 'Pour supprimer un nœud : sélectionnez-le, puis appuyez sur la touche "Suppr" (Delete), ou ouvrez le panneau de détails et cliquez sur "Supprimer ce nœud". Pour supprimer un lien : cliquez sur la ligne du lien pour le sélectionner, puis appuyez sur "Suppr".',
  },
  {
    q: 'Comment exporter ou imprimer une investigation ?',
    a: 'Dans la barre du haut du canvas, vous trouverez deux boutons : "SVG" (télécharge le graphe en image vectorielle haute résolution) et "Imprimer" (ouvre la boîte de dialogue d\'impression de votre navigateur, optimisée pour générer un PDF). Le canvas s\'adapte automatiquement pour l\'impression.',
  },
  {
    q: 'Les données sont-elles sécurisées ?',
    a: 'Oui. Toutes les communications sont chiffrées (HTTPS/WSS). L\'accès est contrôlé par identifiant et mot de passe. Chaque utilisateur ne voit que les affaires auxquelles il est assigné. Les données sont hébergées sur des serveurs sécurisés. Pour un déploiement national souverain, contactez l\'équipe.',
  },
  {
    q: 'Comment réinitialiser mon mot de passe ?',
    a: 'Sur la page de connexion, cliquez sur "Mot de passe oublié ?". Saisissez votre adresse email d\'inscription et un lien de réinitialisation vous sera envoyé. Si vous n\'avez pas accès à votre email, contactez votre administrateur ou l\'équipe GuinéeEnquête via WhatsApp : +224 629 653 636.',
  },
  {
    q: 'Quels navigateurs sont supportés ?',
    a: 'GuinéeEnquête fonctionne sur Chrome (recommandé), Firefox, Edge et Safari. Pour une expérience optimale, utilisez la dernière version de Chrome ou Edge. L\'application est également accessible depuis un smartphone mais l\'édition du canvas est optimisée pour un grand écran.',
  },
  {
    q: 'Comment signaler un bug ou demander une fonctionnalité ?',
    a: 'Contactez l\'équipe directement : email golehlee@gmail.com ou WhatsApp +224 629 653 636. Décrivez le problème (page concernée, action effectuée, comportement observé). Nous répondons généralement dans les 24 heures.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden transition-all"
         style={{ background: open ? 'rgba(252,209,22,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${open ? 'rgba(252,209,22,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
      <button onClick={() => setOpen(!open)}
              className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors">
        <span className={`text-sm font-semibold transition-colors ${open ? 'text-white' : 'text-slate-300'}`}>{q}</span>
        <span className="text-lg ml-3 flex-shrink-0 transition-transform duration-200"
              style={{ color: '#FCD116', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

// ── Steps guide ───────────────────────────────────────────────────────────────
const STEPS = [
  {
    n: 1,
    title: 'Créez une affaire',
    desc: 'Depuis la page Affaires, cliquez sur "Nouvelle affaire". Donnez-lui un titre, choisissez votre corps (Police, Gendarmerie, Douanes…), la préfecture et le niveau de statut (Ouvert, Actif…).',
    tips: ['Le numéro de référence est généré automatiquement', 'Vous pouvez assigner des collègues immédiatement', 'Ajoutez une description pour contextualiser l\'enquête'],
    color: '#CE1126',
  },
  {
    n: 2,
    title: 'Ajoutez vos entités',
    desc: 'Cliquez sur une affaire pour ouvrir le canvas. Dans la barre gauche, sélectionnez un type d\'entité et saisissez son nom. Vous pouvez ajouter 8 types : Personne, Véhicule, Organisation, Lieu, Téléphone, Événement, Document et Compte Bancaire.',
    tips: ['Les suggestions IA proposent des noms courants guinéens', 'Les lieux ont l\'autofill des 33 préfectures', 'Cliquez sur un nœud pour remplir ses détails'],
    color: '#FCD116',
  },
  {
    n: 3,
    title: 'Reliez les entités',
    desc: 'Survolez un nœud pour voir ses points de connexion. Faites glisser depuis un point vers un autre nœud. Une boîte de dialogue s\'ouvre pour choisir le type de relation parmi 25 labels prédéfinis ou saisir le vôtre.',
    tips: ['25 types de relations disponibles ("Propriétaire de", "Complice de"…)', 'Vous pouvez créer votre propre libellé personnalisé', 'Les liens sont directionnels (avec flèche)'],
    color: '#009460',
  },
  {
    n: 4,
    title: 'Collaborez en temps réel',
    desc: 'Vos collègues peuvent rejoindre la même affaire simultanément. Leurs curseurs sont visibles en direct, leurs modifications apparaissent instantanément. Idéal pour les enquêtes inter-corps.',
    tips: ['Les avatars des collègues apparaissent dans la barre du haut', 'Un indicateur "En direct" confirme la connexion temps réel', 'Chaque corps a sa propre couleur d\'identification'],
    color: '#CE1126',
  },
  {
    n: 5,
    title: 'Exportez vos résultats',
    desc: 'Utilisez "SVG" pour télécharger le schéma réseau en haute résolution, ou "Imprimer" pour générer un rapport PDF officiel du canvas optimisé pour l\'impression.',
    tips: ['Format SVG = idéal pour les dossiers numériques', 'Impression = rapport visuel pour le Parquet ou la hiérarchie', 'Le minimap en bas à droite aide à naviguer les grands réseaux'],
    color: '#FCD116',
  },
]

// ── Main FAQ page ─────────────────────────────────────────────────────────────
export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#060b14] text-white">
      <NavBar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8 font-medium"
               style={{ background: 'rgba(252,209,22,0.1)', color: '#FCD116', border: '1px solid rgba(252,209,22,0.2)' }}>
            📖 GUIDE D'UTILISATION
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Comment utiliser
            <br />
            <span style={{ background: 'linear-gradient(90deg, #CE1126, #FCD116, #009460)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              GuinéeEnquête
            </span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Guide complet pour mener vos enquêtes, cartographier les réseaux criminels
            et collaborer avec vos équipes.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Link to="/login"
                  className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #CE1126, #009460)' }}>
              Accéder à l'application →
            </Link>
            <a href="#faq" className="px-6 py-3 rounded-xl font-semibold text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 transition-colors">
              FAQ ↓
            </a>
          </div>
        </div>
      </section>

      {/* Step-by-step guide */}
      <section className="py-20 px-6 bg-[#04080f]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Guide pas à pas</h2>
          <p className="text-slate-400 text-center mb-16">5 étapes pour maîtriser GuinéeEnquête</p>

          <div className="space-y-16">
            {STEPS.map((step, i) => (
              <div key={step.n} className={`grid md:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                <div className={i % 2 === 1 ? 'md:col-start-2' : ''}>
                  {/* Step number */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl"
                         style={{ background: `${step.color}20`, border: `2px solid ${step.color}50`, color: step.color }}>
                      {step.n}
                    </div>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-slate-400 leading-relaxed mb-5">{step.desc}</p>
                  <ul className="space-y-2">
                    {step.tips.map(tip => (
                      <li key={tip} className="flex items-start gap-2 text-sm text-slate-400">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ fill: step.color }}>
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={i % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}>
                  <CanvasIllustration step={step.n} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Entity types reference */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Référence des Types d'Entités</h2>
          <p className="text-slate-400 text-center mb-12">Chaque type a ses propres champs de données spécialisés</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { emoji: '👤', type: 'PERSONNE', color: '#3b82f6', fields: ['Rôle (Suspect / Victime / Témoin / Complice)', 'Prénom, Nom, Alias', 'Âge, Genre, Nationalité', 'Pièce d\'identité (CNI, Passeport…)', 'Téléphone, Adresse, Ville (autofill Guinée)', 'Notes libres'] },
              { emoji: '🚗', type: 'VÉHICULE', color: '#f59e0b', fields: ['Immatriculation', 'Type (Voiture, Camion, Moto, Bateau, Avion…)', 'Marque, Modèle, Couleur, Année', 'Propriétaire', 'Notes'] },
              { emoji: '🏢', type: 'ORGANISATION', color: '#8b5cf6', fields: ['Type (Réseau criminel, Entreprise, Association…)', 'Pays, Ville (autofill)', 'Chef / Responsable', 'Activité principale', 'Nombre de membres', 'Notes'] },
              { emoji: '📍', type: 'LIEU', color: '#10b981', fields: ['Type (Domicile, Bureau, Frontière, Port, Aéroport, Marché…)', 'Ville / Localité (autofill Guinée)', 'Préfecture (autofill)', 'Adresse complète', 'Coordonnées GPS', 'Pays, Notes'] },
              { emoji: '📱', type: 'TÉLÉPHONE', color: '#a855f7', fields: ['Numéro (+224 xxx)', 'Opérateur (Orange, MTN, Cellcom…)', 'Propriétaire déclaré', 'Numéro IMEI', 'Notes'] },
              { emoji: '📅', type: 'ÉVÉNEMENT', color: '#ef4444', fields: ['Type (Incident, Réunion, Transaction, Arrestation, Trafic…)', 'Date et heure', 'Lieu / Ville (autofill)', 'Description détaillée', 'Notes'] },
              { emoji: '📄', type: 'DOCUMENT', color: '#f97316', fields: ['Type (CNI, Passeport, Permis, Contrat, Facture, Rapport…)', 'Numéro du document', 'Émetteur (DNAFE, Préfecture…)', 'Dates d\'émission et d\'expiration', 'Propriétaire / Titulaire', 'Notes'] },
              { emoji: '🏦', type: 'COMPTE BANCAIRE', color: '#84cc16', fields: ['Type (Compte, Virement, Espèces, Crypto…)', 'Banque (BCRG, Ecobank, UBA…)', 'Numéro de compte', 'Titulaire, Montant, Devise (GNF/USD/EUR)', 'Date de transaction', 'Notes'] },
            ].map(ent => (
              <div key={ent.type} className="rounded-2xl p-5"
                   style={{ background: `${ent.color}08`, border: `1px solid ${ent.color}25` }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{ent.emoji}</span>
                  <span className="font-bold" style={{ color: ent.color }}>{ent.type}</span>
                </div>
                <ul className="space-y-1">
                  {ent.fields.map(f => (
                    <li key={f} className="text-xs text-slate-400 flex items-start gap-2">
                      <span className="flex-shrink-0" style={{ color: ent.color }}>·</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Keyboard shortcuts */}
      <section className="py-20 px-6 bg-[#04080f]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Raccourcis Clavier & Astuces</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { keys: ['Suppr'], desc: 'Supprimer le nœud ou lien sélectionné' },
              { keys: ['Shift', 'Clic'], desc: 'Sélection multiple de nœuds' },
              { keys: ['Ctrl', '+'], desc: 'Zoom avant sur le canvas' },
              { keys: ['Ctrl', '−'], desc: 'Zoom arrière sur le canvas' },
              { keys: ['Ctrl', 'Maj', '0'], desc: 'Recentrer la vue sur tous les nœuds' },
              { keys: ['Glisser fond'], desc: 'Déplacer la vue du canvas' },
              { keys: ['Point nœud → Drag'], desc: 'Créer une connexion entre nœuds' },
              { keys: ['Clic nœud'], desc: 'Ouvrir le panneau de détails' },
            ].map(sc => (
              <div key={sc.desc} className="flex items-center gap-3 p-3 rounded-xl"
                   style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex gap-1 flex-shrink-0">
                  {sc.keys.map(k => (
                    <kbd key={k} className="text-xs px-2 py-1 rounded font-mono font-bold"
                         style={{ background: 'rgba(255,255,255,0.08)', color: '#FCD116', border: '1px solid rgba(255,255,255,0.15)' }}>
                      {k}
                    </kbd>
                  ))}
                </div>
                <span className="text-sm text-slate-400">{sc.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ accordion */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Questions Fréquentes</h2>
          <p className="text-slate-400 text-center mb-12">Tout ce que vous devez savoir sur GuinéeEnquête</p>
          <div className="space-y-3">
            {FAQ_ITEMS.map(item => <FAQItem key={item.q} {...item} />)}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-6 bg-[#04080f]">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Besoin d'aide supplémentaire ?</h3>
          <p className="text-slate-400 mb-8">Notre équipe répond en moins de 24 heures</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/224629653636?text=Bonjour%20Paikoun%2C%20j'ai%20besoin%20d'aide%20avec%20Guin%C3%A9eEnqu%C3%AAte"
               target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
               style={{ background: 'rgba(37,211,102,0.15)', color: '#25D366', border: '1px solid rgba(37,211,102,0.3)' }}>
              💬 WhatsApp : +224 629 653 636
            </a>
            <a href="mailto:golehlee@gmail.com?subject=Aide%20GuinéeEnquête"
               className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
               style={{ background: 'rgba(252,209,22,0.1)', color: '#FCD116', border: '1px solid rgba(252,209,22,0.2)' }}>
              📧 golehlee@gmail.com
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
