import { useState, useEffect } from 'react'
import { X, Trash2, Save } from 'lucide-react'
import type { Node as FlowNode } from '@xyflow/react'
import type { FlowNodeData } from './CustomNode'
import { NodeType } from '../types'

interface NodePanelProps {
  node: FlowNode<FlowNodeData>
  onClose: () => void
  onUpdate: (nodeId: string, label: string, data: Record<string, unknown>) => Promise<void>
  onDelete: (nodeId: string) => Promise<void>
}

export default function NodePanel({ node, onClose, onUpdate, onDelete }: NodePanelProps) {
  const [label, setLabel] = useState(node.data.label)
  const [nodeData, setNodeData] = useState<Record<string, unknown>>(node.data.nodeData ?? {})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLabel(node.data.label)
    setNodeData(node.data.nodeData ?? {})
    setError('')
  }, [node.id])

  function setField(key: string, value: unknown) {
    setNodeData((d) => ({ ...d, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      await onUpdate(node.id, label, nodeData)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Supprimer ce nœud et toutes ses connexions ?')) return
    setDeleting(true)
    try {
      await onDelete(node.id)
    } catch (e: any) {
      setError(e.message)
      setDeleting(false)
    }
  }

  const nodeType = node.data.nodeType

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 text-sm">{nodeTypeLabel(nodeType)}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <Field label="Label (identifiant)">
          <input className={inp} value={label} onChange={(e) => setLabel(e.target.value)} />
        </Field>

        {nodeType === 'PERSON' && <PersonFields data={nodeData} set={setField} />}
        {nodeType === 'VEHICLE' && <VehicleFields data={nodeData} set={setField} />}
        {nodeType === 'ORGANIZATION' && <OrgFields data={nodeData} set={setField} />}
        {nodeType === 'LOCATION' && <LocationFields data={nodeData} set={setField} />}
        {nodeType === 'CONTAINER' && <ContainerFields data={nodeData} set={setField} />}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 space-y-2">
        {error && (
          <p className="text-xs text-red-600 bg-red-50 rounded px-2 py-1">{error}</p>
        )}
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {deleting ? '…' : 'Supprimer'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  )
}

type FieldsProps = { data: Record<string, unknown>; set: (k: string, v: unknown) => void }

function PersonFields({ data, set }: FieldsProps) {
  return (
    <>
      <Field label="Rôle">
        <select className={inp} value={(data.role as string) ?? 'AUTRE'} onChange={(e) => set('role', e.target.value)}>
          <option value="SUSPECT">Suspect</option>
          <option value="VICTIME">Victime</option>
          <option value="TEMOIN">Témoin</option>
          <option value="COMPLICE">Complice</option>
          <option value="AUTRE">Autre</option>
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prénom">
          <input className={inp} value={(data.prenom as string) ?? ''} onChange={(e) => set('prenom', e.target.value)} />
        </Field>
        <Field label="Genre">
          <select className={inp} value={(data.genre as string) ?? ''} onChange={(e) => set('genre', e.target.value)}>
            <option value="">—</option>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
            <option value="Autre">Autre</option>
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nationalité">
          <input className={inp} value={(data.nationalite as string) ?? ''} onChange={(e) => set('nationalite', e.target.value)} placeholder="Guinéen" />
        </Field>
        <Field label="Âge">
          <input className={inp} type="number" min={0} value={(data.age as number) ?? ''} onChange={(e) => set('age', e.target.value ? Number(e.target.value) : '')} />
        </Field>
      </div>
      <Field label="Alias / Surnom">
        <input className={inp} value={(data.alias as string) ?? ''} onChange={(e) => set('alias', e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Type pièce d'identité">
          <input className={inp} value={(data.typeId as string) ?? ''} onChange={(e) => set('typeId', e.target.value)} placeholder="CNI, Passeport…" />
        </Field>
        <Field label="Numéro">
          <input className={inp} value={(data.numeroId as string) ?? ''} onChange={(e) => set('numeroId', e.target.value)} />
        </Field>
      </div>
      <Field label="Adresse">
        <input className={inp} value={(data.adresse as string) ?? ''} onChange={(e) => set('adresse', e.target.value)} />
      </Field>
      <Field label="Téléphone">
        <input className={inp} value={(data.telephone as string) ?? ''} onChange={(e) => set('telephone', e.target.value)} placeholder="+224 6xx xxx xxx" />
      </Field>
      <Field label="Notes">
        <textarea className={inp + ' resize-none'} rows={3} value={(data.notes as string) ?? ''} onChange={(e) => set('notes', e.target.value)} />
      </Field>
    </>
  )
}

function VehicleFields({ data, set }: FieldsProps) {
  return (
    <>
      <Field label="Type de véhicule">
        <select className={inp} value={(data.type as string) ?? 'VOITURE'} onChange={(e) => set('type', e.target.value)}>
          <option value="VOITURE">Voiture</option>
          <option value="CAMION">Camion</option>
          <option value="MOTO">Moto</option>
          <option value="BATEAU">Bateau</option>
          <option value="AVION">Avion</option>
          <option value="AUTRE">Autre</option>
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Marque">
          <input className={inp} value={(data.marque as string) ?? ''} onChange={(e) => set('marque', e.target.value)} placeholder="Toyota" />
        </Field>
        <Field label="Modèle">
          <input className={inp} value={(data.modele as string) ?? ''} onChange={(e) => set('modele', e.target.value)} placeholder="Land Cruiser" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Couleur">
          <input className={inp} value={(data.couleur as string) ?? ''} onChange={(e) => set('couleur', e.target.value)} placeholder="Blanc" />
        </Field>
        <Field label="Année">
          <input className={inp} type="number" min={1900} max={2100} value={(data.annee as number) ?? ''} onChange={(e) => set('annee', e.target.value ? Number(e.target.value) : '')} />
        </Field>
      </div>
      <Field label="Propriétaire">
        <input className={inp} value={(data.proprietaire as string) ?? ''} onChange={(e) => set('proprietaire', e.target.value)} />
      </Field>
      <Field label="Notes">
        <textarea className={inp + ' resize-none'} rows={3} value={(data.notes as string) ?? ''} onChange={(e) => set('notes', e.target.value)} />
      </Field>
    </>
  )
}

function OrgFields({ data, set }: FieldsProps) {
  return (
    <>
      <Field label="Type d'organisation">
        <select className={inp} value={(data.type as string) ?? 'AUTRE'} onChange={(e) => set('type', e.target.value)}>
          <option value="RESEAU">Réseau criminel</option>
          <option value="ENTREPRISE">Entreprise</option>
          <option value="ASSOCIATION">Association</option>
          <option value="AUTRE">Autre</option>
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Pays">
          <input className={inp} value={(data.pays as string) ?? ''} onChange={(e) => set('pays', e.target.value)} placeholder="Guinée" />
        </Field>
        <Field label="Chef">
          <input className={inp} value={(data.chef as string) ?? ''} onChange={(e) => set('chef', e.target.value)} />
        </Field>
      </div>
      <Field label="Activité">
        <input className={inp} value={(data.activite as string) ?? ''} onChange={(e) => set('activite', e.target.value)} placeholder="Trafic de marchandises…" />
      </Field>
      <Field label="Notes">
        <textarea className={inp + ' resize-none'} rows={3} value={(data.notes as string) ?? ''} onChange={(e) => set('notes', e.target.value)} />
      </Field>
    </>
  )
}

function LocationFields({ data, set }: FieldsProps) {
  return (
    <>
      <Field label="Type de lieu">
        <select className={inp} value={(data.type as string) ?? 'AUTRE'} onChange={(e) => set('type', e.target.value)}>
          <option value="DOMICILE">Domicile</option>
          <option value="BUREAU">Bureau</option>
          <option value="FRONTIERE">Frontière</option>
          <option value="PORT">Port</option>
          <option value="AEROPORT">Aéroport</option>
          <option value="AUTRE">Autre</option>
        </select>
      </Field>
      <Field label="Adresse">
        <input className={inp} value={(data.adresse as string) ?? ''} onChange={(e) => set('adresse', e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Pays">
          <input className={inp} value={(data.pays as string) ?? ''} onChange={(e) => set('pays', e.target.value)} placeholder="Guinée" />
        </Field>
        <Field label="Coordonnées GPS">
          <input className={inp} value={(data.coordonnees as string) ?? ''} onChange={(e) => set('coordonnees', e.target.value)} placeholder="9.5370, -13.6773" />
        </Field>
      </div>
      <Field label="Notes">
        <textarea className={inp + ' resize-none'} rows={3} value={(data.notes as string) ?? ''} onChange={(e) => set('notes', e.target.value)} />
      </Field>
    </>
  )
}

function ContainerFields({ data, set }: FieldsProps) {
  return (
    <>
      <Field label="Type de transport">
        <select className={inp} value={(data.type as string) ?? 'MARITIME'} onChange={(e) => set('type', e.target.value)}>
          <option value="MARITIME">Maritime</option>
          <option value="AERIEN">Aérien</option>
          <option value="TERRESTRE">Terrestre</option>
        </select>
      </Field>
      <Field label="Statut">
        <select className={inp} value={(data.status as string) ?? 'EN_TRANSIT'} onChange={(e) => set('status', e.target.value)}>
          <option value="EN_TRANSIT">En transit</option>
          <option value="SAISI">Saisi</option>
          <option value="DEDOUANE">Dédouané</option>
          <option value="INSPECTE">Inspecté</option>
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Origine">
          <input className={inp} value={(data.origine as string) ?? ''} onChange={(e) => set('origine', e.target.value)} />
        </Field>
        <Field label="Destination">
          <input className={inp} value={(data.destination as string) ?? ''} onChange={(e) => set('destination', e.target.value)} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Contenu">
          <input className={inp} value={(data.contenu as string) ?? ''} onChange={(e) => set('contenu', e.target.value)} />
        </Field>
        <Field label="Poids">
          <input className={inp} value={(data.poids as string) ?? ''} onChange={(e) => set('poids', e.target.value)} placeholder="2500 kg" />
        </Field>
      </div>
      <Field label="Date d'arrivée">
        <input className={inp} type="date" value={(data.dateArrivee as string) ?? ''} onChange={(e) => set('dateArrivee', e.target.value)} />
      </Field>
      <Field label="Notes">
        <textarea className={inp + ' resize-none'} rows={3} value={(data.notes as string) ?? ''} onChange={(e) => set('notes', e.target.value)} />
      </Field>
    </>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  )
}

function nodeTypeLabel(t: NodeType): string {
  const map: Record<NodeType, string> = {
    PERSON: 'Personne',
    VEHICLE: 'Véhicule',
    ORGANIZATION: 'Organisation',
    LOCATION: 'Lieu',
    CONTAINER: 'Conteneur',
  }
  return map[t] ?? t
}

const inp =
  'w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
