<<<<<<< HEAD
import { memo } from 'react'
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
=======
import { memo, type ElementType } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
>>>>>>> 91da015 (fix: resolve all TypeScript build errors for Railway deployment)
import { User, Car, Building2, MapPin, Package } from 'lucide-react'
import { NodeType } from '../types'

export interface FlowNodeData extends Record<string, unknown> {
  label: string
  nodeType: NodeType
  nodeData: Record<string, unknown>
}

const NODE_CONFIG: Record<
  NodeType,
  { icon: ElementType; bg: string; border: string; text: string; accent: string }
> = {
  PERSON: {
    icon: User,
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-900',
    accent: 'bg-blue-600',
  },
  VEHICLE: {
    icon: Car,
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-900',
    accent: 'bg-amber-500',
  },
  ORGANIZATION: {
    icon: Building2,
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    text: 'text-purple-900',
    accent: 'bg-purple-600',
  },
  LOCATION: {
    icon: MapPin,
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-900',
    accent: 'bg-green-600',
  },
  CONTAINER: {
    icon: Package,
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    text: 'text-orange-900',
    accent: 'bg-orange-500',
  },
}

function getSubtitle(nodeType: NodeType, data: Record<string, unknown>): string {
  switch (nodeType) {
    case 'PERSON': {
      const roleMap: Record<string, string> = {
        SUSPECT: 'Suspect', VICTIME: 'Victime', TEMOIN: 'Témoin',
        COMPLICE: 'Complice', AUTRE: 'Autre',
      }
      const role = data.role as string | undefined
      return role ? (roleMap[role] ?? role) : ''
    }
    case 'VEHICLE': {
      const typeMap: Record<string, string> = {
        VOITURE: 'Voiture', CAMION: 'Camion', MOTO: 'Moto',
        BATEAU: 'Bateau', AVION: 'Avion', AUTRE: 'Autre',
      }
      const t = data.type as string | undefined
      return t ? (typeMap[t] ?? t) : ''
    }
    case 'ORGANIZATION': {
      const typeMap: Record<string, string> = {
        RESEAU: 'Réseau', ENTREPRISE: 'Entreprise',
        ASSOCIATION: 'Association', AUTRE: 'Autre',
      }
      const t = data.type as string | undefined
      return t ? (typeMap[t] ?? t) : ''
    }
    case 'LOCATION': {
      const typeMap: Record<string, string> = {
        DOMICILE: 'Domicile', BUREAU: 'Bureau', FRONTIERE: 'Frontière',
        PORT: 'Port', AEROPORT: 'Aéroport', AUTRE: 'Autre',
      }
      const t = data.type as string | undefined
      return t ? (typeMap[t] ?? t) : ''
    }
    case 'CONTAINER': {
      const statusMap: Record<string, string> = {
        EN_TRANSIT: 'En transit', SAISI: 'Saisi',
        DEDOUANE: 'Dédouané', INSPECTE: 'Inspecté',
      }
      const s = data.status as string | undefined
      return s ? (statusMap[s] ?? s) : ''
    }
  }
}

<<<<<<< HEAD
function CustomNodeComponent({ data, selected }: NodeProps<Node<FlowNodeData>>) {
=======
function CustomNodeComponent({ data: rawData, selected }: NodeProps) {
  const data = rawData as FlowNodeData
>>>>>>> 91da015 (fix: resolve all TypeScript build errors for Railway deployment)
  const cfg = NODE_CONFIG[data.nodeType] ?? NODE_CONFIG.PERSON
  const Icon = cfg.icon
  const subtitle = getSubtitle(data.nodeType, data.nodeData)

  return (
    <div
      className={`relative rounded-xl border-2 shadow-sm min-w-[140px] max-w-[200px] transition-shadow ${cfg.bg} ${cfg.border} ${
        selected ? 'shadow-lg ring-2 ring-blue-400 ring-offset-1' : 'hover:shadow-md'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !border-2 !border-white !bg-gray-400"
      />

      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${cfg.accent}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-semibold truncate leading-tight ${cfg.text}`}>
            {data.label}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 truncate leading-tight mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !border-2 !border-white !bg-gray-400"
      />
    </div>
  )
}

export const CustomNode = memo(CustomNodeComponent)

export const nodeTypes = {
  PERSON: CustomNode,
  VEHICLE: CustomNode,
  ORGANIZATION: CustomNode,
  LOCATION: CustomNode,
  CONTAINER: CustomNode,
}
