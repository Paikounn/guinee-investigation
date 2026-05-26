import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { NodeType, NODE_TYPE_CONFIG } from '../types'

export interface FlowNodeData extends Record<string, unknown> {
  label: string
  nodeType: NodeType
  nodeData: Record<string, unknown>
}

function getSubtitle(nodeType: NodeType, data: Record<string, unknown>): string {
  switch (nodeType) {
    case 'PERSON': {
      const roleMap: Record<string, string> = { SUSPECT: 'Suspect', VICTIME: 'Victime', TEMOIN: 'Témoin', COMPLICE: 'Complice', AUTRE: '' }
      return (data.role as string) ? (roleMap[data.role as string] ?? '') : ''
    }
    case 'VEHICLE': {
      const m: Record<string, string> = { VOITURE: 'Voiture', CAMION: 'Camion', MOTO: 'Moto', BATEAU: 'Bateau', AVION: 'Avion', AUTRE: '' }
      const parts = [m[data.type as string] ?? '', data.marque as string ?? ''].filter(Boolean)
      return parts.join(' · ')
    }
    case 'ORGANIZATION': {
      const m: Record<string, string> = { RESEAU: 'Réseau criminel', ENTREPRISE: 'Entreprise', ASSOCIATION: 'Association', PARTI: 'Parti', AUTRE: '' }
      return m[data.type as string] ?? ''
    }
    case 'LOCATION':
      return (data.ville as string) || (data.prefecture as string) || ''
    case 'PHONE':
      return (data.operateur as string) ?? ''
    case 'EVENT': {
      const m: Record<string, string> = { INCIDENT: 'Incident', REUNION: 'Réunion', TRANSACTION: 'Transaction', ARRESTATION: 'Arrestation', TRAFIC: 'Trafic', AUTRE: '' }
      return [m[data.type as string] ?? '', data.date as string ?? ''].filter(Boolean).join(' · ')
    }
    case 'DOCUMENT': {
      const m: Record<string, string> = { CNI: 'CNI', PASSEPORT: 'Passeport', PERMIS: 'Permis', CONTRAT: 'Contrat', FACTURE: 'Facture', RAPPORT: 'Rapport', AUTRE: 'Doc.' }
      return m[data.type as string] ?? ''
    }
    case 'BANK':
      return (data.banque as string) || (data.type as string) || ''
    default:
      return ''
  }
}

function CustomNodeComponent({ data: rawData, selected }: NodeProps) {
  const data = rawData as FlowNodeData
  const cfg = NODE_TYPE_CONFIG[data.nodeType] ?? NODE_TYPE_CONFIG.PERSON
  const subtitle = getSubtitle(data.nodeType, data.nodeData ?? {})

  return (
    <div
      className={`relative rounded-xl border-2 shadow-lg min-w-[130px] max-w-[190px] transition-all duration-150 ${
        selected
          ? 'ring-2 ring-offset-1 ring-offset-[#080c14] shadow-xl'
          : 'hover:shadow-xl hover:scale-[1.02]'
      }`}
      style={{
        background: `${cfg.color}18`,
        borderColor: selected ? cfg.color : `${cfg.color}55`,
        boxShadow: selected ? `0 0 20px ${cfg.color}40` : undefined,
        ...(selected ? { '--tw-ring-color': cfg.color } as React.CSSProperties : {}),
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3.5 !h-3.5 !border-2 !border-[#080c14] !rounded-full"
        style={{ background: cfg.color }}
      />

      <div className="flex items-center gap-2 px-3 py-2.5">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-base shadow-inner"
          style={{ background: `${cfg.color}30`, border: `1px solid ${cfg.color}50` }}
        >
          {cfg.emoji}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate leading-tight text-white">
            {data.label}
          </p>
          {subtitle && (
            <p className="text-xs truncate leading-tight mt-0.5" style={{ color: `${cfg.color}cc` }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Bottom type badge */}
      <div
        className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider whitespace-nowrap"
        style={{ background: `${cfg.color}30`, color: cfg.color, border: `1px solid ${cfg.color}50` }}
      >
        {cfg.label}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3.5 !h-3.5 !border-2 !border-[#080c14] !rounded-full"
        style={{ background: cfg.color, marginBottom: '-2px' }}
      />
    </div>
  )
}

export const CustomNode = memo(CustomNodeComponent)

export const nodeTypes: Record<NodeType, typeof CustomNode> = {
  PERSON: CustomNode,
  VEHICLE: CustomNode,
  ORGANIZATION: CustomNode,
  LOCATION: CustomNode,
  PHONE: CustomNode,
  EVENT: CustomNode,
  DOCUMENT: CustomNode,
  BANK: CustomNode,
}
