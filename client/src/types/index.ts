export type Corps = 'POLICE' | 'GENDARMERIE' | 'DOUANE'
export type UserRole = 'ADMIN' | 'INVESTIGATOR' | 'ANALYST'
export type CaseStatus = 'OPEN' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED'
export type NodeType = 'PERSON' | 'VEHICLE' | 'ORGANIZATION' | 'LOCATION' | 'PHONE' | 'EVENT' | 'DOCUMENT' | 'BANK'

export interface User {
  id: string; name: string; email: string; corps: Corps; role: UserRole; grade?: string; matricule?: string
}
export interface Case {
  id: string; reference: string; title: string; description?: string; status: CaseStatus; corps: Corps
  createdAt: string; updatedAt: string; createdBy: { name: string }; _count?: { nodes: number; members: number }
}
export interface CaseFull extends Case {
  nodes: DBNode[]; edges: DBEdge[]
  members: { user: { id: string; name: string; corps: Corps; grade?: string } }[]
}
export interface DBNode {
  id: string; caseId: string; type: NodeType; label: string
  data: Record<string, any>; positionX: number; positionY: number
}
export interface DBEdge {
  id: string; caseId: string; sourceId: string; targetId: string
  label?: string; edgeType: string; data?: Record<string, any>
}
export interface CollabUser {
  userId: string; userName: string; corps: Corps; color: string; cursorX: number; cursorY: number
}

// ── Entity data interfaces ────────────────────────────────────────────────────
export interface PersonData {
  nom: string; prenom?: string; alias?: string; genre?: 'M'|'F'|'Autre'; nationalite?: string; age?: number
  typeId?: string; numeroId?: string; adresse?: string; ville?: string; telephone?: string
  role: 'SUSPECT'|'VICTIME'|'TEMOIN'|'COMPLICE'|'AUTRE'; photo?: string; notes?: string
}
export interface VehicleData {
  immatriculation: string; type: 'VOITURE'|'CAMION'|'MOTO'|'BATEAU'|'AVION'|'AUTRE'
  marque?: string; modele?: string; couleur?: string; annee?: number; proprietaire?: string; notes?: string
}
export interface OrganizationData {
  nom: string; type: 'RESEAU'|'ENTREPRISE'|'ASSOCIATION'|'PARTI'|'AUTRE'
  pays?: string; ville?: string; activite?: string; chef?: string; membresNombre?: number; notes?: string
}
export interface LocationData {
  nom: string; type: 'DOMICILE'|'BUREAU'|'FRONTIERE'|'PORT'|'AEROPORT'|'MARCHE'|'AUTRE'
  adresse?: string; ville?: string; prefecture?: string; coordonnees?: string; pays?: string; notes?: string
}
export interface PhoneData {
  numero: string; operateur?: 'Orange'|'MTN'|'Cellcom'|'Autre'
  proprietaire?: string; imei?: string; notes?: string
}
export interface EventData {
  titre: string; date?: string; heure?: string; lieu?: string; ville?: string
  type: 'INCIDENT'|'REUNION'|'TRANSACTION'|'ARRESTATION'|'TRAFIC'|'AUTRE'
  description?: string; notes?: string
}
export interface DocumentData {
  titre: string; type: 'CNI'|'PASSEPORT'|'PERMIS'|'CONTRAT'|'FACTURE'|'RAPPORT'|'AUTRE'
  numero?: string; emetteur?: string; dateEmission?: string; dateExpiration?: string
  proprietaire?: string; notes?: string
}
export interface BankData {
  numeroCompte?: string; banque?: string; type: 'COMPTE'|'VIREMENT'|'ESPECES'|'CRYPTO'|'AUTRE'
  titulaire?: string; montant?: string; devise?: 'GNF'|'USD'|'EUR'|'Autre'
  dateTransaction?: string; description?: string; notes?: string
}

// ── Config maps ───────────────────────────────────────────────────────────────
export const CORPS_CONFIG: Record<Corps, { label: string; color: string; bg: string; border: string; badge: string; dot: string }> = {
  POLICE:      { label: 'Police Nationale',      color: 'text-blue-300',    bg: 'bg-blue-500/20 border border-blue-500/40 text-blue-300',        border: 'border-blue-500/40',    badge: 'POLICE',      dot: 'bg-blue-400' },
  GENDARMERIE: { label: 'Gendarmerie Nationale', color: 'text-slate-300',   bg: 'bg-slate-500/20 border border-slate-500/40 text-slate-300',      border: 'border-slate-500/40',   badge: 'GENDARMERIE', dot: 'bg-slate-400' },
  DOUANE:      { label: 'Douane Nationale',      color: 'text-emerald-300', bg: 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300', border: 'border-emerald-500/40', badge: 'DOUANE',      dot: 'bg-emerald-400' },
}

export const STATUS_CONFIG: Record<CaseStatus, { label: string; color: string; dot: string }> = {
  OPEN:     { label: 'Ouvert',   color: 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300',          dot: 'bg-cyan-400' },
  ACTIVE:   { label: 'En cours', color: 'bg-amber-500/20 border border-amber-500/30 text-amber-300',       dot: 'bg-amber-400' },
  CLOSED:   { label: 'Clôturé', color: 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300',  dot: 'bg-emerald-400' },
  ARCHIVED: { label: 'Archivé', color: 'bg-slate-500/20 border border-slate-500/30 text-slate-400',        dot: 'bg-slate-500' },
}

export const NODE_TYPE_CONFIG: Record<NodeType, { label: string; emoji: string; color: string; accent: string; border: string }> = {
  PERSON:       { label: 'Personne',       emoji: '👤', color: '#3b82f6', accent: 'bg-blue-500/20',   border: 'border-blue-500/40' },
  VEHICLE:      { label: 'Véhicule',       emoji: '🚗', color: '#f59e0b', accent: 'bg-amber-500/20',  border: 'border-amber-500/40' },
  ORGANIZATION: { label: 'Organisation',   emoji: '🏢', color: '#8b5cf6', accent: 'bg-purple-500/20', border: 'border-purple-500/40' },
  LOCATION:     { label: 'Lieu',           emoji: '📍', color: '#10b981', accent: 'bg-emerald-500/20',border: 'border-emerald-500/40' },
  PHONE:        { label: 'Téléphone',      emoji: '📱', color: '#a855f7', accent: 'bg-violet-500/20', border: 'border-violet-500/40' },
  EVENT:        { label: 'Événement',      emoji: '📅', color: '#ef4444', accent: 'bg-red-500/20',    border: 'border-red-500/40' },
  DOCUMENT:     { label: 'Document',       emoji: '📄', color: '#f97316', accent: 'bg-orange-500/20', border: 'border-orange-500/40' },
  BANK:         { label: 'Compte Bancaire',emoji: '🏦', color: '#84cc16', accent: 'bg-lime-500/20',   border: 'border-lime-500/40' },
}

export const RELATIONSHIP_LABELS = [
  'Associé à', 'Propriétaire de', 'Réside à', 'Contacte', 'Membre de',
  'Emploie', 'Finance', 'Présent lors de', 'Témoin de', 'Victime de',
  'Suspect principal', 'Complice de', 'Fournisseur de', 'Client de',
  'Parent de', 'Conjoint de', 'Collègue de', 'Supérieur de',
  'Utilise', 'Possède', 'Dirige', 'Contrôle', 'Surveille',
  'Transporte', 'Finance via', 'Correspond avec',
]
