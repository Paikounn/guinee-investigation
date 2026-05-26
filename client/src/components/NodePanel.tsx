import { useState, useEffect, useRef } from 'react'
import type { Node as FlowNode } from '@xyflow/react'
import type { FlowNodeData } from './CustomNode'
import { NodeType, NODE_TYPE_CONFIG, RELATIONSHIP_LABELS } from '../types'
import { suggestLocations } from '../data/guinea'

interface NodePanelProps {
  node: FlowNode<FlowNodeData>
  onClose: () => void
  onUpdate: (nodeId: string, label: string, data: Record<string, unknown>) => Promise<void>
  onDelete: (nodeId: string) => Promise<void>
}

const inp = 'w-full bg-slate-900/80 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors'
const sel = inp + ' appearance-none cursor-pointer'

// ── Location autocomplete ─────────────────────────────────────────────────────
function LocationInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  function handleChange(v: string) {
    onChange(v)
    const s = suggestLocations(v)
    setSuggestions(s)
    setOpen(s.length > 0)
  }

  useEffect(() => {
    function onClick(e: MouseEvent) { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <input className={inp} value={value} onChange={e => handleChange(e.target.value)}
             onFocus={() => value.length >= 2 && setOpen(suggestions.length > 0)}
             placeholder={placeholder ?? 'Ville, préfecture…'} />
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl overflow-hidden shadow-2xl"
             style={{ background: '#0d1b2a', border: '1px solid rgba(255,255,255,0.1)' }}>
          {suggestions.map(s => (
            <button key={s} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-white/10 transition-colors flex items-center gap-2"
                    onMouseDown={() => { onChange(s); setOpen(false) }}>
              <span className="text-base">📍</span> {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}

// ── Type-specific fields ──────────────────────────────────────────────────────
function PersonFields({ data, set }: { data: Record<string, unknown>; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Rôle judiciaire">
        <select className={sel} value={(data.role as string) ?? 'AUTRE'} onChange={e => set('role', e.target.value)}>
          <option value="SUSPECT">🔴 Suspect</option>
          <option value="COMPLICE">🟠 Complice</option>
          <option value="TEMOIN">🟡 Témoin</option>
          <option value="VICTIME">🔵 Victime</option>
          <option value="AUTRE">⚪ Autre</option>
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prénom"><input className={inp} value={(data.prenom as string) ?? ''} onChange={e => set('prenom', e.target.value)} placeholder="Mamadou" /></Field>
        <Field label="Nom"><input className={inp} value={(data.nom as string) ?? ''} onChange={e => set('nom', e.target.value)} placeholder="Diallo" /></Field>
      </div>
      <Field label="Alias / Surnom"><input className={inp} value={(data.alias as string) ?? ''} onChange={e => set('alias', e.target.value)} placeholder="Surnom…" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Genre">
          <select className={sel} value={(data.genre as string) ?? ''} onChange={e => set('genre', e.target.value)}>
            <option value="">—</option>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
            <option value="Autre">Autre</option>
          </select>
        </Field>
        <Field label="Âge"><input className={inp} type="number" min={0} max={120} value={(data.age as number) ?? ''} onChange={e => set('age', e.target.value ? Number(e.target.value) : '')} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Type pièce ID"><input className={inp} value={(data.typeId as string) ?? ''} onChange={e => set('typeId', e.target.value)} placeholder="CNI, Passeport…" /></Field>
        <Field label="N° pièce ID"><input className={inp} value={(data.numeroId as string) ?? ''} onChange={e => set('numeroId', e.target.value)} /></Field>
      </div>
      <Field label="Nationalité"><input className={inp} value={(data.nationalite as string) ?? ''} onChange={e => set('nationalite', e.target.value)} placeholder="Guinéen(ne)" /></Field>
      <Field label="Téléphone"><input className={inp} value={(data.telephone as string) ?? ''} onChange={e => set('telephone', e.target.value)} placeholder="+224 6xx xxx xxx" /></Field>
      <Field label="Ville / Localité">
        <LocationInput value={(data.ville as string) ?? ''} onChange={v => set('ville', v)} />
      </Field>
      <Field label="Adresse complète"><input className={inp} value={(data.adresse as string) ?? ''} onChange={e => set('adresse', e.target.value)} /></Field>
      <Field label="Notes"><textarea className={inp + ' resize-none'} rows={3} value={(data.notes as string) ?? ''} onChange={e => set('notes', e.target.value)} /></Field>
    </>
  )
}

function VehicleFields({ data, set }: { data: Record<string, unknown>; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Immatriculation"><input className={inp} value={(data.immatriculation as string) ?? ''} onChange={e => set('immatriculation', e.target.value)} placeholder="RC-1234-C" /></Field>
      <Field label="Type">
        <select className={sel} value={(data.type as string) ?? 'VOITURE'} onChange={e => set('type', e.target.value)}>
          <option value="VOITURE">🚗 Voiture</option>
          <option value="CAMION">🚛 Camion</option>
          <option value="MOTO">🏍️ Moto</option>
          <option value="BATEAU">🚢 Bateau</option>
          <option value="AVION">✈️ Avion</option>
          <option value="AUTRE">🚌 Autre</option>
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Marque"><input className={inp} value={(data.marque as string) ?? ''} onChange={e => set('marque', e.target.value)} placeholder="Toyota" /></Field>
        <Field label="Modèle"><input className={inp} value={(data.modele as string) ?? ''} onChange={e => set('modele', e.target.value)} placeholder="Land Cruiser" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Couleur"><input className={inp} value={(data.couleur as string) ?? ''} onChange={e => set('couleur', e.target.value)} placeholder="Blanc" /></Field>
        <Field label="Année"><input className={inp} type="number" min={1900} max={2100} value={(data.annee as number) ?? ''} onChange={e => set('annee', e.target.value ? Number(e.target.value) : '')} /></Field>
      </div>
      <Field label="Propriétaire"><input className={inp} value={(data.proprietaire as string) ?? ''} onChange={e => set('proprietaire', e.target.value)} /></Field>
      <Field label="Notes"><textarea className={inp + ' resize-none'} rows={2} value={(data.notes as string) ?? ''} onChange={e => set('notes', e.target.value)} /></Field>
    </>
  )
}

function OrgFields({ data, set }: { data: Record<string, unknown>; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Type">
        <select className={sel} value={(data.type as string) ?? 'AUTRE'} onChange={e => set('type', e.target.value)}>
          <option value="RESEAU">🔴 Réseau criminel</option>
          <option value="ENTREPRISE">🏢 Entreprise</option>
          <option value="ASSOCIATION">🤝 Association</option>
          <option value="PARTI">⚖️ Parti politique</option>
          <option value="AUTRE">⚪ Autre</option>
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Pays"><input className={inp} value={(data.pays as string) ?? ''} onChange={e => set('pays', e.target.value)} placeholder="Guinée" /></Field>
        <Field label="Membres">
          <input className={inp} type="number" min={0} value={(data.membresNombre as number) ?? ''} onChange={e => set('membresNombre', e.target.value ? Number(e.target.value) : '')} />
        </Field>
      </div>
      <Field label="Ville / Localité">
        <LocationInput value={(data.ville as string) ?? ''} onChange={v => set('ville', v)} />
      </Field>
      <Field label="Chef / Responsable"><input className={inp} value={(data.chef as string) ?? ''} onChange={e => set('chef', e.target.value)} /></Field>
      <Field label="Activité"><input className={inp} value={(data.activite as string) ?? ''} onChange={e => set('activite', e.target.value)} placeholder="Trafic, blanchiment…" /></Field>
      <Field label="Notes"><textarea className={inp + ' resize-none'} rows={2} value={(data.notes as string) ?? ''} onChange={e => set('notes', e.target.value)} /></Field>
    </>
  )
}

function LocationFields({ data, set }: { data: Record<string, unknown>; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Type de lieu">
        <select className={sel} value={(data.type as string) ?? 'AUTRE'} onChange={e => set('type', e.target.value)}>
          <option value="DOMICILE">🏠 Domicile</option>
          <option value="BUREAU">🏢 Bureau</option>
          <option value="FRONTIERE">🚧 Frontière</option>
          <option value="PORT">⚓ Port</option>
          <option value="AEROPORT">✈️ Aéroport</option>
          <option value="MARCHE">🛒 Marché</option>
          <option value="AUTRE">📍 Autre</option>
        </select>
      </Field>
      <Field label="Ville / Localité (autofill Guinée)">
        <LocationInput value={(data.ville as string) ?? ''} onChange={v => set('ville', v)} placeholder="Conakry, Kankan, Labé…" />
      </Field>
      <Field label="Préfecture">
        <LocationInput value={(data.prefecture as string) ?? ''} onChange={v => set('prefecture', v)} placeholder="Préfecture…" />
      </Field>
      <Field label="Adresse complète"><input className={inp} value={(data.adresse as string) ?? ''} onChange={e => set('adresse', e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Pays"><input className={inp} value={(data.pays as string) ?? ''} onChange={e => set('pays', e.target.value)} placeholder="Guinée" /></Field>
        <Field label="Coordonnées GPS"><input className={inp} value={(data.coordonnees as string) ?? ''} onChange={e => set('coordonnees', e.target.value)} placeholder="9.54, -13.67" /></Field>
      </div>
      <Field label="Notes"><textarea className={inp + ' resize-none'} rows={2} value={(data.notes as string) ?? ''} onChange={e => set('notes', e.target.value)} /></Field>
    </>
  )
}

function PhoneFields({ data, set }: { data: Record<string, unknown>; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Numéro"><input className={inp} value={(data.numero as string) ?? ''} onChange={e => set('numero', e.target.value)} placeholder="+224 6xx xxx xxx" /></Field>
      <Field label="Opérateur">
        <select className={sel} value={(data.operateur as string) ?? ''} onChange={e => set('operateur', e.target.value)}>
          <option value="">—</option>
          <option value="Orange">Orange Guinée</option>
          <option value="MTN">MTN Guinée</option>
          <option value="Cellcom">Cellcom</option>
          <option value="Autre">Autre</option>
        </select>
      </Field>
      <Field label="Propriétaire déclaré"><input className={inp} value={(data.proprietaire as string) ?? ''} onChange={e => set('proprietaire', e.target.value)} /></Field>
      <Field label="IMEI"><input className={inp} value={(data.imei as string) ?? ''} onChange={e => set('imei', e.target.value)} placeholder="123456789012345" /></Field>
      <Field label="Notes"><textarea className={inp + ' resize-none'} rows={2} value={(data.notes as string) ?? ''} onChange={e => set('notes', e.target.value)} /></Field>
    </>
  )
}

function EventFields({ data, set }: { data: Record<string, unknown>; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Type d'événement">
        <select className={sel} value={(data.type as string) ?? 'AUTRE'} onChange={e => set('type', e.target.value)}>
          <option value="INCIDENT">🚨 Incident</option>
          <option value="REUNION">👥 Réunion</option>
          <option value="TRANSACTION">💰 Transaction</option>
          <option value="ARRESTATION">🔒 Arrestation</option>
          <option value="TRAFIC">🚛 Trafic</option>
          <option value="AUTRE">📅 Autre</option>
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date"><input className={inp} type="date" value={(data.date as string) ?? ''} onChange={e => set('date', e.target.value)} /></Field>
        <Field label="Heure"><input className={inp} type="time" value={(data.heure as string) ?? ''} onChange={e => set('heure', e.target.value)} /></Field>
      </div>
      <Field label="Lieu / Ville">
        <LocationInput value={(data.ville as string) ?? ''} onChange={v => set('ville', v)} placeholder="Où s'est passé l'événement…" />
      </Field>
      <Field label="Description"><textarea className={inp + ' resize-none'} rows={3} value={(data.description as string) ?? ''} onChange={e => set('description', e.target.value)} placeholder="Décrivez l'événement…" /></Field>
      <Field label="Notes"><textarea className={inp + ' resize-none'} rows={2} value={(data.notes as string) ?? ''} onChange={e => set('notes', e.target.value)} /></Field>
    </>
  )
}

function DocumentFields({ data, set }: { data: Record<string, unknown>; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Type de document">
        <select className={sel} value={(data.type as string) ?? 'AUTRE'} onChange={e => set('type', e.target.value)}>
          <option value="CNI">🪪 CNI</option>
          <option value="PASSEPORT">📕 Passeport</option>
          <option value="PERMIS">🚗 Permis</option>
          <option value="CONTRAT">📋 Contrat</option>
          <option value="FACTURE">🧾 Facture</option>
          <option value="RAPPORT">📊 Rapport</option>
          <option value="AUTRE">📄 Autre</option>
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Numéro"><input className={inp} value={(data.numero as string) ?? ''} onChange={e => set('numero', e.target.value)} /></Field>
        <Field label="Émetteur"><input className={inp} value={(data.emetteur as string) ?? ''} onChange={e => set('emetteur', e.target.value)} placeholder="DNAFE, Préfecture…" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date d'émission"><input className={inp} type="date" value={(data.dateEmission as string) ?? ''} onChange={e => set('dateEmission', e.target.value)} /></Field>
        <Field label="Date d'expiration"><input className={inp} type="date" value={(data.dateExpiration as string) ?? ''} onChange={e => set('dateExpiration', e.target.value)} /></Field>
      </div>
      <Field label="Propriétaire / Titulaire"><input className={inp} value={(data.proprietaire as string) ?? ''} onChange={e => set('proprietaire', e.target.value)} /></Field>
      <Field label="Notes"><textarea className={inp + ' resize-none'} rows={2} value={(data.notes as string) ?? ''} onChange={e => set('notes', e.target.value)} /></Field>
    </>
  )
}

function BankFields({ data, set }: { data: Record<string, unknown>; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <Field label="Type">
        <select className={sel} value={(data.type as string) ?? 'COMPTE'} onChange={e => set('type', e.target.value)}>
          <option value="COMPTE">🏦 Compte bancaire</option>
          <option value="VIREMENT">💸 Virement</option>
          <option value="ESPECES">💵 Espèces</option>
          <option value="CRYPTO">₿ Crypto</option>
          <option value="AUTRE">💳 Autre</option>
        </select>
      </Field>
      <Field label="Banque"><input className={inp} value={(data.banque as string) ?? ''} onChange={e => set('banque', e.target.value)} placeholder="BCRG, Ecobank, UBA…" /></Field>
      <Field label="Numéro de compte"><input className={inp} value={(data.numeroCompte as string) ?? ''} onChange={e => set('numeroCompte', e.target.value)} /></Field>
      <Field label="Titulaire"><input className={inp} value={(data.titulaire as string) ?? ''} onChange={e => set('titulaire', e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Montant">
          <input className={inp} value={(data.montant as string) ?? ''} onChange={e => set('montant', e.target.value)} placeholder="5 000 000" />
        </Field>
        <Field label="Devise">
          <select className={sel} value={(data.devise as string) ?? 'GNF'} onChange={e => set('devise', e.target.value)}>
            <option value="GNF">GNF</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="Autre">Autre</option>
          </select>
        </Field>
      </div>
      <Field label="Date transaction"><input className={inp} type="date" value={(data.dateTransaction as string) ?? ''} onChange={e => set('dateTransaction', e.target.value)} /></Field>
      <Field label="Notes"><textarea className={inp + ' resize-none'} rows={2} value={(data.notes as string) ?? ''} onChange={e => set('notes', e.target.value)} /></Field>
    </>
  )
}

// ── AI Suggestions panel ──────────────────────────────────────────────────────
function AISuggestions({ nodeType, onSuggest }: { nodeType: NodeType; onSuggest: (label: string) => void }) {
  const suggestions: Record<NodeType, string[]> = {
    PERSON: ['Alpha Diallo', 'Mamadou Bah', 'Fatoumata Camara', 'Ibrahima Sow', 'Mariama Barry'],
    VEHICLE: ['Toyota Land Cruiser', 'Bache blanche', 'Moto Jakarta', 'Camion Iveco', 'Toyota Hilux'],
    ORGANIZATION: ['Réseau Kankan', 'Société Fictive SARL', 'Groupe armé', 'Coopérative minière'],
    LOCATION: ['Conakry - Kaloum', 'Frontière Faranah', 'Port Kamsar', 'Aéroport Conakry', 'Marché Madina'],
    PHONE: ['+224 622 00 00 00', '+224 631 00 00 00', '+224 664 00 00 00'],
    EVENT: ['Réunion secrète', 'Transfert de fonds', 'Passage frontière', 'Arrestation', 'Transaction suspecte'],
    DOCUMENT: ['CNI falsifiée', 'Passeport frauduleux', 'Contrat fictif', 'Facture gonflée'],
    BANK: ['Compte Ecobank', 'Virement suspect', 'Espèces non déclarées', 'Compte offshore'],
  }

  const list = suggestions[nodeType] ?? []
  if (!list.length) return null

  return (
    <div className="rounded-xl p-3" style={{ background: 'rgba(252,209,22,0.05)', border: '1px solid rgba(252,209,22,0.15)' }}>
      <p className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: '#FCD116' }}>
        <span>🤖</span> Suggestions IA
      </p>
      <div className="flex flex-wrap gap-1.5">
        {list.map(s => (
          <button key={s} onClick={() => onSuggest(s)}
                  className="text-xs px-2 py-1 rounded-full transition-colors hover:opacity-80"
                  style={{ background: 'rgba(252,209,22,0.1)', color: '#FCD116', border: '1px solid rgba(252,209,22,0.2)' }}>
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Main NodePanel ────────────────────────────────────────────────────────────
export default function NodePanel({ node, onClose, onUpdate, onDelete }: NodePanelProps) {
  const [label, setLabel] = useState(node.data.label)
  const [nodeData, setNodeData] = useState<Record<string, unknown>>(node.data.nodeData ?? {})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [showRelLabels, setShowRelLabels] = useState(false)

  useEffect(() => {
    setLabel(node.data.label)
    setNodeData(node.data.nodeData ?? {})
    setError('')
  }, [node.id])

  function set(key: string, value: unknown) {
    setNodeData(d => ({ ...d, [key]: value }))
  }

  async function handleSave() {
    setSaving(true); setError('')
    try { await onUpdate(node.id, label, nodeData) }
    catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm('Supprimer ce nœud et toutes ses connexions ?')) return
    setDeleting(true)
    try { await onDelete(node.id) }
    catch (e: any) { setError(e.message); setDeleting(false) }
  }

  const nodeType = node.data.nodeType
  const cfg = NODE_TYPE_CONFIG[nodeType] ?? NODE_TYPE_CONFIG.PERSON

  return (
    <div className="flex flex-col h-full bg-[#0b1020]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800/60 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
               style={{ background: `${cfg.color}25`, border: `1px solid ${cfg.color}40` }}>
            {cfg.emoji}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{cfg.label}</h3>
            <p className="text-xs text-slate-500 truncate max-w-[160px]">{node.data.label}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-600 hover:text-slate-300 transition-colors p-1 rounded">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* AI Suggestions */}
        <AISuggestions nodeType={nodeType} onSuggest={s => setLabel(s)} />

        {/* Main label */}
        <Field label="Identifiant / Nom affiché">
          <input className={inp} value={label} onChange={e => setLabel(e.target.value)}
                 placeholder="Nom visible sur le canvas…" />
        </Field>

        {/* Separator */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Détails</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Type-specific fields */}
        {nodeType === 'PERSON'       && <PersonFields   data={nodeData} set={set} />}
        {nodeType === 'VEHICLE'      && <VehicleFields  data={nodeData} set={set} />}
        {nodeType === 'ORGANIZATION' && <OrgFields      data={nodeData} set={set} />}
        {nodeType === 'LOCATION'     && <LocationFields data={nodeData} set={set} />}
        {nodeType === 'PHONE'        && <PhoneFields    data={nodeData} set={set} />}
        {nodeType === 'EVENT'        && <EventFields    data={nodeData} set={set} />}
        {nodeType === 'DOCUMENT'     && <DocumentFields data={nodeData} set={set} />}
        {nodeType === 'BANK'         && <BankFields     data={nodeData} set={set} />}

        {/* Relationship labels quick reference */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={() => setShowRelLabels(!showRelLabels)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
            <span>🔗 Labels de connexion suggérés</span>
            <span>{showRelLabels ? '▲' : '▼'}</span>
          </button>
          {showRelLabels && (
            <div className="p-3 flex flex-wrap gap-1.5">
              {RELATIONSHIP_LABELS.map(r => (
                <span key={r} className="text-xs px-2 py-0.5 rounded-full text-slate-400"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-800/60 space-y-2 flex-shrink-0">
        <button onClick={handleSave} disabled={saving}
                className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: `linear-gradient(135deg, ${cfg.color}cc, ${cfg.color}99)` }}>
          {saving ? 'Enregistrement…' : '💾 Enregistrer'}
        </button>
        <button onClick={handleDelete} disabled={deleting}
                className="w-full py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all disabled:opacity-50 border border-transparent hover:border-red-500/20">
          {deleting ? 'Suppression…' : '🗑️ Supprimer ce nœud'}
        </button>
      </div>
    </div>
  )
}
