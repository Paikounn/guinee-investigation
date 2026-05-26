export type Corps = 'POLICE' | 'GENDARMERIE' | 'DOUANE'
export type UserRole = 'ADMIN' | 'INVESTIGATOR' | 'ANALYST'
export type CaseStatus = 'OPEN' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED'
export type NodeType = 'PERSON' | 'VEHICLE' | 'ORGANIZATION' | 'LOCATION' | 'CONTAINER'
export type Language = 'fr' | 'en'

export interface User {
  id: string
  name: string
  email: string
  corps: Corps
  role: UserRole
  grade?: string
  matricule?: string
}

export interface Case {
  id: string
  reference: string
  title: string
  description?: string
  status: CaseStatus
  corps: Corps
  createdAt: string
  updatedAt: string
  createdBy: { name: string }
  _count?: { nodes: number; members: number }
}

export interface CaseFull extends Case {
  nodes: DBNode[]
  edges: DBEdge[]
  members: { user: { id: string; name: string; corps: Corps; grade?: string } }[]
}

export interface DBNode {
  id: string
  caseId: string
  type: NodeType
  label: string
  data: Record<string, any>
  positionX: number
  positionY: number
}

export interface DBEdge {
  id: string
  caseId: string
  sourceId: string
  targetId: string
  label?: string
  edgeType: string
  data?: Record<string, any>
}

export interface CollabUser {
  userId: string
  userName: string
  corps: Corps
  color: string
  cursorX: number
  cursorY: number
}

export interface PersonData {
  nom: string
  prenom?: string
  alias?: string
  genre?: 'M' | 'F' | 'Autre'
  nationalite?: string
  age?: number
  typeId?: string
  numeroId?: string
  adresse?: string
  telephone?: string
  role: 'SUSPECT' | 'VICTIME' | 'TEMOIN' | 'COMPLICE' | 'AUTRE'
  photo?: string
  notes?: string
}

export interface VehicleData {
  immatriculation: string
  type: 'VOITURE' | 'CAMION' | 'MOTO' | 'BATEAU' | 'AVION' | 'AUTRE'
  marque?: string
  modele?: string
  couleur?: string
  annee?: number
  proprietaire?: string
  notes?: string
}

export interface OrganizationData {
  nom: string
  type: 'RESEAU' | 'ENTREPRISE' | 'ASSOCIATION' | 'AUTRE'
  pays?: string
  activite?: string
  chef?: string
  notes?: string
}

export interface LocationData {
  nom: string
  type: 'DOMICILE' | 'BUREAU' | 'FRONTIERE' | 'PORT' | 'AEROPORT' | 'AUTRE'
  adresse?: string
  coordonnees?: string
  pays?: string
  notes?: string
}

export interface ContainerData {
  reference: string
  type: 'MARITIME' | 'AERIEN' | 'TERRESTRE'
  contenu?: string
  poids?: string
  origine?: string
  destination?: string
  dateArrivee?: string
  status: 'EN_TRANSIT' | 'SAISI' | 'DEDOUANE' | 'INSPECTE'
  notes?: string
}

export const CORPS_CONFIG: Record<Corps, { label: string; color: string; bg: string; border: string; badge: string }> = {
  POLICE: {
    label: 'Police Nationale',
    color: 'text-blue-800',
    bg: 'bg-blue-700',
    border: 'border-blue-600',
    badge: 'POLICE',
  },
  GENDARMERIE: {
    label: 'Gendarmerie Nationale',
    color: 'text-slate-800',
    bg: 'bg-slate-700',
    border: 'border-slate-600',
    badge: 'GENDARMERIE',
  },
  DOUANE: {
    label: 'Douane Nationale',
    color: 'text-green-800',
    bg: 'bg-green-700',
    border: 'border-green-600',
    badge: 'DOUANE',
  },
}

export const STATUS_CONFIG: Record<CaseStatus, { label: string; color: string }> = {
  OPEN: { label: 'Ouvert', color: 'bg-blue-100 text-blue-800' },
  ACTIVE: { label: 'En cours', color: 'bg-yellow-100 text-yellow-800' },
  CLOSED: { label: 'Clôturé', color: 'bg-green-100 text-green-800' },
  ARCHIVED: { label: 'Archivé', color: 'bg-gray-100 text-gray-600' },
}