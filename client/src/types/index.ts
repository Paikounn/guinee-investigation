export type Corps = 'POLICE' | 'GENDARMERIE' | 'DOUANE'
export type UserRole = 'ADMIN' | 'INVESTIGATOR' | 'ANALYST'
export type CaseStatus = 'OPEN' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED'
export type NodeType = 'PERSON' | 'VEHICLE' | 'ORGANIZATION' | 'LOCATION' | 'CONTAINER'

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
export interface DBNode { id: string; caseId: string; type: NodeType; label: string; data: Record<string, any>; positionX: number; positionY: number }
export interface DBEdge { id: string; caseId: string; sourceId: string; targetId: string; label?: string; edgeType: string; data?: Record<string, any> }
export interface CollabUser { userId: string; userName: string; corps: Corps; color: string; cursorX: number; cursorY: number }

export interface PersonData { nom: string; prenom?: string; alias?: string; genre?: 'M'|'F'|'Autre'; nationalite?: string; age?: number; typeId?: string; numeroId?: string; adresse?: string; telephone?: string; role: 'SUSPECT'|'VICTIME'|'TEMOIN'|'COMPLICE'|'AUTRE'; photo?: string; notes?: string }
export interface VehicleData { immatriculation: string; type: 'VOITURE'|'CAMION'|'MOTO'|'BATEAU'|'AVION'|'AUTRE'; marque?: string; modele?: string; couleur?: string; annee?: number; proprietaire?: string; notes?: string }
export interface OrganizationData { nom: string; type: 'RESEAU'|'ENTREPRISE'|'ASSOCIATION'|'AUTRE'; pays?: string; activite?: string; chef?: string; notes?: string }
export interface LocationData { nom: string; type: 'DOMICILE'|'BUREAU'|'FRONTIERE'|'PORT'|'AEROPORT'|'AUTRE'; adresse?: string; coordonnees?: string; pays?: string; notes?: string }
export interface ContainerData { reference: string; type: 'MARITIME'|'AERIEN'|'TERRESTRE'; contenu?: string; poids?: string; origine?: string; destination?: string; dateArrivee?: string; status: 'EN_TRANSIT'|'SAISI'|'DEDOUANE'|'INSPECTE'; notes?: string }

export const CORPS_CONFIG: Record<Corps, { label: string; color: string; bg: string; border: string; badge: string; dot: string }> = {
  POLICE:      { label: 'Police Nationale',       color: 'text-blue-300',    bg: 'bg-blue-500/20 border border-blue-500/40 text-blue-300',       border: 'border-blue-500/40',    badge: 'POLICE',       dot: 'bg-blue-400' },
  GENDARMERIE: { label: 'Gendarmerie Nationale',  color: 'text-slate-300',   bg: 'bg-slate-500/20 border border-slate-500/40 text-slate-300',     border: 'border-slate-500/40',   badge: 'GENDARMERIE',  dot: 'bg-slate-400' },
  DOUANE:      { label: 'Douane Nationale',       color: 'text-emerald-300', bg: 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300', border: 'border-emerald-500/40', badge: 'DOUANE',       dot: 'bg-emerald-400' },
}

export const STATUS_CONFIG: Record<CaseStatus, { label: string; color: string; dot: string }> = {
  OPEN:     { label: 'Ouvert',   color: 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300',         dot: 'bg-cyan-400' },
  ACTIVE:   { label: 'En cours', color: 'bg-amber-500/20 border border-amber-500/30 text-amber-300',      dot: 'bg-amber-400' },
  CLOSED:   { label: 'Clôturé', color: 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300', dot: 'bg-emerald-400' },
  ARCHIVED: { label: 'Archivé', color: 'bg-slate-500/20 border border-slate-500/30 text-slate-400',       dot: 'bg-slate-500' },
}
