import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ReactFlow, Background, Controls, MiniMap, addEdge,
  useNodesState, useEdgesState,
  type Connection, type Node as FlowNode, type Edge as FlowEdge,
  type OnConnect, type OnNodesDelete, type OnEdgesDelete,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { api } from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import { useCollaboration } from '../hooks/useCollaboration'
import { nodeTypes, type FlowNodeData } from '../components/CustomNode'
import NodePanel from '../components/NodePanel'
import { type CorpsId } from '../components/CorpsLogos'
import { CaseFull, NodeType, DBNode, DBEdge, CORPS_CONFIG, STATUS_CONFIG, NODE_TYPE_CONFIG, RELATIONSHIP_LABELS } from '../types'

function dbNodeToFlow(n: DBNode): FlowNode<FlowNodeData> {
  return {
    id: n.id, type: n.type,
    position: { x: n.positionX, y: n.positionY },
    data: { label: n.label, nodeType: n.type, nodeData: n.data as Record<string, unknown> },
  }
}
function dbEdgeToFlow(e: DBEdge): FlowEdge {
  return {
    id: e.id, source: e.sourceId, target: e.targetId,
    label: e.label ?? '', type: 'smoothstep',
    style: { stroke: '#475569', strokeWidth: 1.5, strokeDasharray: '6 3' },
    labelStyle: { fill: '#94a3b8', fontSize: 10, fontWeight: 600 },
    labelBgStyle: { fill: '#0d1b2e', fillOpacity: 0.95 },
    labelBgPadding: [6, 3] as [number, number],
    markerEnd: { type: MarkerType.ArrowClosed, color: '#475569', width: 12, height: 12 },
    data: (e.data ?? {}) as Record<string, unknown>,
  }
}

const PALETTE: { type: NodeType; emoji: string; label: string; color: string }[] = [
  { type: 'PERSON',       emoji: '👤', label: 'Personne',       color: '#3b82f6' },
  { type: 'VEHICLE',      emoji: '🚗', label: 'Véhicule',       color: '#f59e0b' },
  { type: 'ORGANIZATION', emoji: '🏢', label: 'Organisation',   color: '#8b5cf6' },
  { type: 'LOCATION',     emoji: '📍', label: 'Lieu',           color: '#10b981' },
  { type: 'PHONE',        emoji: '📱', label: 'Téléphone',      color: '#a855f7' },
  { type: 'EVENT',        emoji: '📅', label: 'Événement',      color: '#ef4444' },
  { type: 'DOCUMENT',     emoji: '📄', label: 'Document',       color: '#f97316' },
  { type: 'BANK',         emoji: '🏦', label: 'Compte Bancaire',color: '#84cc16' },
]

// ── Edge Label Dialog ──────────────────────────────────────────────────────────
interface EdgeLabelDialogProps {
  onConfirm: (label: string) => void
  onCancel: () => void
}
function EdgeLabelDialog({ onConfirm, onCancel }: EdgeLabelDialogProps) {
  const [label, setLabel] = useState('')
  const [custom, setCustom] = useState(false)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="rounded-2xl p-6 w-full max-w-md shadow-2xl"
           style={{ background: '#0d1b2e', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 className="text-lg font-bold text-white mb-1">🔗 Lien entre entités</h3>
        <p className="text-sm text-slate-500 mb-5">Choisissez la nature de la relation</p>

        <div className="flex flex-wrap gap-2 mb-4 max-h-52 overflow-y-auto pr-1">
          {RELATIONSHIP_LABELS.map(r => (
            <button key={r} onClick={() => { setLabel(r); setCustom(false) }}
                    className="text-xs px-3 py-1.5 rounded-full transition-all font-medium"
                    style={label === r && !custom
                      ? { background: 'rgba(206,17,38,0.3)', color: '#fff', border: '1px solid rgba(206,17,38,0.6)' }
                      : { background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
              {r}
            </button>
          ))}
          <button onClick={() => { setCustom(true); setLabel('') }}
                  className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                  style={custom
                    ? { background: 'rgba(252,209,22,0.2)', color: '#FCD116', border: '1px solid rgba(252,209,22,0.4)' }
                    : { background: 'rgba(255,255,255,0.05)', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)' }}>
            ✏️ Personnalisé
          </button>
        </div>

        {custom && (
          <input
            autoFocus
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="Décrivez la relation…"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-500 mb-4"
          />
        )}

        <div className="flex gap-3">
          <button onClick={onCancel}
                  className="flex-1 py-2.5 rounded-xl text-sm text-slate-400 border border-slate-700 hover:border-slate-600 transition-colors">
            Annuler
          </button>
          <button onClick={() => onConfirm(label)}
                  disabled={!label.trim()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #CE1126, #009460)' }}>
            Créer le lien
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Collab cursor ──────────────────────────────────────────────────────────────
function CollabCursor({ user: u }: { user: { userId: string; userName: string; color: string; cursorX: number; cursorY: number } }) {
  return (
    <div className="absolute pointer-events-none z-50 transition-transform duration-75" style={{ left: u.cursorX, top: u.cursorY }}>
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
        <path d="M0 0L16 8L8 10L6 20L0 0Z" fill={u.color} stroke="#0b1020" strokeWidth="1.5" />
      </svg>
      <span className="absolute left-4 top-4 text-xs text-white px-1.5 py-0.5 rounded whitespace-nowrap font-medium"
            style={{ backgroundColor: u.color }}>
        {u.userName}
      </span>
    </div>
  )
}

// ── Main Canvas ────────────────────────────────────────────────────────────────
export default function CanvasPage() {
  const { caseId } = useParams<{ caseId: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const canvasRef = useRef<HTMLDivElement>(null)

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode<FlowNodeData>>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([])
  const [selectedNode, setSelectedNode] = useState<FlowNode<FlowNodeData> | null>(null)
  const [addingType, setAddingType] = useState<NodeType | null>(null)
  const [addForm, setAddForm] = useState({ label: '' })
  const [addLoading, setAddLoading] = useState(false)
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const { data: caseData } = useQuery({
    queryKey: ['case', caseId],
    queryFn: () => api.get<CaseFull>(`/cases/${caseId}`),
    staleTime: Infinity, enabled: !!caseId,
  })

  useEffect(() => {
    if (!caseData) return
    setNodes(caseData.nodes.map(dbNodeToFlow))
    setEdges(caseData.edges.map(dbEdgeToFlow))
  }, [caseData?.id])

  const { connected, collabUsers, sendNodeMove, sendCursorMove, sendNodeCreate, sendNodeUpdate, sendNodeDelete, sendEdgeCreate, sendEdgeDelete } = useCollaboration({
    caseId: caseId ?? null,
    onNodeMove: (nodeId, x, y) => setNodes(ns => ns.map(n => n.id === nodeId ? { ...n, position: { x, y } } : n)),
    onNodeCreate: node => setNodes(ns => [...ns, dbNodeToFlow(node as DBNode)]),
    onNodeUpdate: (nodeId, data) => setNodes(ns => ns.map(n => n.id === nodeId ? { ...n, data: { ...n.data, label: data.label, nodeData: data.data } } : n)),
    onNodeDelete: nodeId => { setNodes(ns => ns.filter(n => n.id !== nodeId)); setEdges(es => es.filter(e => e.source !== nodeId && e.target !== nodeId)); setSelectedNode(s => s?.id === nodeId ? null : s) },
    onEdgeCreate: edge => setEdges(es => [...es, dbEdgeToFlow(edge as DBEdge)]),
    onEdgeDelete: edgeId => setEdges(es => es.filter(e => e.id !== edgeId)),
  })

  // ── Handlers ────────────────────────────────────────────────────────────────
  const onConnect: OnConnect = useCallback((connection: Connection) => {
    setPendingConnection(connection)
  }, [])

  async function confirmEdge(label: string) {
    if (!pendingConnection || !caseId || !pendingConnection.source || !pendingConnection.target) {
      setPendingConnection(null); return
    }
    try {
      const edge = await api.post<DBEdge>(`/cases/${caseId}/edges`, {
        sourceId: pendingConnection.source,
        targetId: pendingConnection.target,
        label, edgeType: 'smoothstep',
      })
      setEdges(es => addEdge(dbEdgeToFlow(edge), es))
      sendEdgeCreate(edge)
    } catch (e) { console.error('Edge error', e) }
    finally { setPendingConnection(null) }
  }

  const onNodeDragStop = useCallback(async (_e: ReactMouseEvent, node: FlowNode<FlowNodeData>) => {
    if (!caseId) return
    try {
      await api.patch(`/cases/${caseId}/nodes/${node.id}`, { positionX: node.position.x, positionY: node.position.y })
      sendNodeMove(node.id, node.position.x, node.position.y)
    } catch {}
  }, [caseId, sendNodeMove])

  const onNodesDelete: OnNodesDelete = useCallback(async deleted => {
    if (!caseId) return
    for (const n of deleted) {
      try { await api.delete(`/cases/${caseId}/nodes/${n.id}`); sendNodeDelete(n.id) } catch {}
    }
  }, [caseId, sendNodeDelete])

  const onEdgesDelete: OnEdgesDelete = useCallback(async deleted => {
    if (!caseId) return
    for (const e of deleted) {
      try { await api.delete(`/cases/${caseId}/edges/${e.id}`); sendEdgeDelete(e.id) } catch {}
    }
  }, [caseId, sendEdgeDelete])

  async function handleAddNode(e: React.FormEvent) {
    e.preventDefault()
    if (!caseId || !addingType || !addForm.label.trim()) return
    setAddLoading(true)
    try {
      const n = await api.post<DBNode>(`/cases/${caseId}/nodes`, {
        type: addingType, label: addForm.label.trim(), data: {},
        positionX: 200 + Math.random() * 400, positionY: 150 + Math.random() * 300,
      })
      const flowNode = dbNodeToFlow(n)
      setNodes(ns => [...ns, flowNode])
      sendNodeCreate(n)
      setAddForm({ label: '' })
      setAddingType(null)
    } catch (err) { console.error(err) }
    finally { setAddLoading(false) }
  }

  async function handleNodeUpdate(nodeId: string, label: string, data: Record<string, unknown>) {
    if (!caseId) return
    const updated = await api.patch<DBNode>(`/cases/${caseId}/nodes/${nodeId}`, { label, data })
    setNodes(ns => ns.map(n => n.id === nodeId ? { ...n, data: { ...n.data, label: updated.label, nodeData: updated.data as Record<string, unknown> } } : n))
    sendNodeUpdate(nodeId, { label: updated.label, data: updated.data })
    setSelectedNode(s => s?.id === nodeId ? { ...s, data: { ...s.data, label: updated.label, nodeData: updated.data as Record<string, unknown> } } : s)
  }

  async function handleNodeDelete(nodeId: string) {
    if (!caseId) return
    await api.delete(`/cases/${caseId}/nodes/${nodeId}`)
    setNodes(ns => ns.filter(n => n.id !== nodeId))
    setEdges(es => es.filter(e => e.source !== nodeId && e.target !== nodeId))
    sendNodeDelete(nodeId)
    setSelectedNode(null)
  }

  function handlePrint() {
    window.print()
  }

  function handleExportSVG() {
    const svgEl = canvasRef.current?.querySelector('.react-flow__renderer svg') as SVGElement | null
    if (!svgEl) { alert('Canvas vide — ajoutez des nœuds d\'abord'); return }
    const clone = svgEl.cloneNode(true) as SVGElement
    clone.setAttribute('style', 'background:#080c14')
    const blob = new Blob([clone.outerHTML], { type: 'image/svg+xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${caseData?.title ?? 'affaire'}-reseau.svg`
    a.click()
  }

  const corps = caseData?.corps ? CORPS_CONFIG[caseData.corps] : null
  const status = caseData?.status ? STATUS_CONFIG[caseData.status] : null
  const activePalette = PALETTE.find(p => p.type === addingType)

  return (
    <div className="h-screen flex flex-col bg-[#080c14] print:bg-white">
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="h-13 flex-shrink-0 bg-[#0b1020] border-b border-slate-800/60 flex items-center gap-3 px-4 print:hidden">
        {/* Back */}
        <button onClick={() => navigate('/cases')}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-200 text-sm transition-colors flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          <span className="hidden sm:inline">Affaires</span>
        </button>
        <div className="w-px h-5 bg-slate-800 flex-shrink-0" />

        {/* Case info */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-xs text-slate-600 font-mono hidden sm:block">{caseData?.reference}</span>
          <span className="font-semibold text-white text-sm truncate">{caseData?.title ?? '…'}</span>
          {status && (
            <span className={`hidden md:inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          )}
          {corps && (
            <span className={`hidden md:inline text-xs px-2 py-0.5 rounded-full font-medium ${corps.bg}`}>
              {corps.badge}
            </span>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          {/* Collab users */}
          {collabUsers.length > 0 && (
            <div className="flex -space-x-1.5">
              {collabUsers.slice(0, 4).map(u => (
                <div key={u.userId} title={u.userName}
                     className="w-6 h-6 rounded-full border-2 border-[#0b1020] flex items-center justify-center text-white text-xs font-bold"
                     style={{ backgroundColor: u.color }}>
                  {u.userName.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          )}

          {/* Connection status */}
          <div className={`flex items-center gap-1 text-xs ${connected ? 'text-emerald-400' : 'text-slate-600'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-slate-600'}`} />
            <span className="hidden sm:inline">{connected ? 'En direct' : 'Hors ligne'}</span>
          </div>

          <div className="w-px h-5 bg-slate-800" />

          {/* Stats */}
          <span className="text-xs text-slate-600 hidden md:block">{nodes.length} entités · {edges.length} liens</span>

          {/* Export SVG */}
          <button onClick={handleExportSVG}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-slate-800 hover:border-slate-600 px-2.5 py-1.5 rounded-lg transition-colors">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            <span className="hidden sm:inline">SVG</span>
          </button>

          {/* Print */}
          <button onClick={handlePrint}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-slate-800 hover:border-slate-600 px-2.5 py-1.5 rounded-lg transition-colors">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
            <span className="hidden sm:inline">Imprimer</span>
          </button>

          {/* FAQ Help */}
          <Link to="/faq"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-yellow-400 border border-slate-800 hover:border-yellow-500/40 px-2.5 py-1.5 rounded-lg transition-colors"
                title="Guide d'utilisation">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
            <span className="hidden md:inline">Aide</span>
          </Link>

          {/* Sidebar toggle */}
          <button onClick={() => setSidebarOpen(o => !o)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-slate-800 hover:border-slate-600 px-2.5 py-1.5 rounded-lg transition-colors">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
          </button>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left sidebar */}
        {sidebarOpen && (
          <div className="w-52 flex-shrink-0 bg-[#0b1020] border-r border-slate-800/60 flex flex-col print:hidden">

            {/* Entity palette */}
            <div className="px-3 py-3 border-b border-slate-800/60">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Ajouter une entité</p>
              <div className="space-y-1">
                {PALETTE.map(({ type, emoji, label, color }) => (
                  <button key={type}
                          onClick={() => { setAddingType(type); setSelectedNode(null); setAddForm({ label: '' }) }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                          style={addingType === type
                            ? { background: `${color}25`, border: `1px solid ${color}60`, color }
                            : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#64748b' }}>
                    <span className="text-base">{emoji}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add form */}
            {addingType && activePalette && (
              <form onSubmit={handleAddNode} className="px-3 py-3 border-b border-slate-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold" style={{ color: activePalette.color }}>
                    {activePalette.emoji} {activePalette.label}
                  </p>
                  <button type="button" onClick={() => setAddingType(null)} className="text-slate-600 hover:text-slate-400 text-lg leading-none">×</button>
                </div>
                <input
                  autoFocus
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:border-slate-500 transition-colors"
                  style={{ '--tw-ring-color': activePalette.color } as React.CSSProperties}
                  placeholder="Nom / identifiant…"
                  value={addForm.label}
                  onChange={e => setAddForm({ label: e.target.value })}
                />
                <button type="submit" disabled={addLoading || !addForm.label.trim()}
                        className="w-full py-1.5 rounded-lg text-xs font-bold text-white transition-all disabled:opacity-40"
                        style={{ background: activePalette.color }}>
                  {addLoading ? '…' : '＋ Ajouter au canvas'}
                </button>
              </form>
            )}

            {/* Quick tips */}
            {!addingType && (
              <div className="px-3 py-3 space-y-2">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Raccourcis</p>
                {[
                  ['Suppr', 'Supprimer nœud sélectionné'],
                  ['Shift+clic', 'Sélection multiple'],
                  ['Scroll', 'Zoom in/out'],
                  ['Glisser', 'Déplacer le canvas'],
                  ['Connecter', 'Tirer depuis le point du nœud'],
                ].map(([key, desc]) => (
                  <div key={key} className="flex items-start gap-2">
                    <kbd className="text-[9px] px-1.5 py-0.5 rounded font-mono flex-shrink-0"
                         style={{ background: 'rgba(255,255,255,0.07)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {key}
                    </kbd>
                    <span className="text-[10px] text-slate-600 leading-tight">{desc}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Members */}
            {caseData?.members && caseData.members.length > 0 && (
              <div className="mt-auto px-3 py-3 border-t border-slate-800/60">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Enquêteurs</p>
                <div className="space-y-1.5">
                  {caseData.members.map(m => {
                    const cfg = CORPS_CONFIG[m.user.corps]
                    const isMe = m.user.id === user?.id
                    return (
                      <div key={m.user.id} className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold border ${cfg.border} bg-slate-800 flex-shrink-0`}>
                          {m.user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-slate-400 truncate">
                          {m.user.name}{isMe && <span className="text-slate-600"> (moi)</span>}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── React Flow canvas ──────────────────────────────────────────────── */}
        <div ref={canvasRef} className="flex-1 relative"
             onMouseMove={e => { const r = canvasRef.current?.getBoundingClientRect(); if (r) sendCursorMove(e.clientX - r.left, e.clientY - r.top) }}>
          <ReactFlow
            nodes={nodes} edges={edges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDragStop={onNodeDragStop}
            onNodesDelete={onNodesDelete} onEdgesDelete={onEdgesDelete}
            onNodeClick={(_, node) => { setSelectedNode(node as FlowNode<FlowNodeData>); setAddingType(null) }}
            onPaneClick={() => setSelectedNode(null)}
            nodeTypes={nodeTypes}
            fitView deleteKeyCode="Delete" multiSelectionKeyCode="Shift"
            className="bg-[#080c14]"
            defaultEdgeOptions={{
              type: 'smoothstep',
              style: { stroke: '#475569', strokeWidth: 1.5, strokeDasharray: '6 3' },
              markerEnd: { type: MarkerType.ArrowClosed, color: '#475569', width: 12, height: 12 },
            }}
          >
            <Background color="#1a2640" gap={28} size={1} variant={'dots' as any} />
            <Controls
              className="[&>button]:bg-[#0d1b2e] [&>button]:border-slate-700 [&>button]:text-slate-400 [&>button:hover]:bg-slate-800"
              style={{ bottom: 12, left: 12 }}
            />
            <MiniMap
              className="!bg-[#0d1b2e] !border-slate-700 !rounded-xl"
              nodeColor={n => {
                const cfg = NODE_TYPE_CONFIG[(n.data as FlowNodeData).nodeType]
                return cfg?.color ?? '#64748b'
              }}
              maskColor="rgba(8,12,20,0.7)"
              style={{ bottom: 12, right: 12 }}
            />
          </ReactFlow>

          {/* Collab cursors */}
          {collabUsers.map(u => <CollabCursor key={u.userId} user={u} />)}

          {/* Empty state */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-6xl mb-4 opacity-20">🗺️</div>
              <p className="text-slate-600 text-sm font-medium mb-1">Canvas vide</p>
              <p className="text-slate-700 text-xs text-center max-w-xs">
                Sélectionnez un type d'entité à gauche et ajoutez votre premier nœud d'investigation
              </p>
            </div>
          )}
        </div>

        {/* Right panel — node details (fixed position) */}
        {selectedNode && (
          <NodePanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onSave={(id, data) => { handleNodeUpdate(id, data.label || selectedNode.data?.label || '', data); }}
            activeCorps={(user?.corps as CorpsId) || 'POLICE'}
          />
        )}
      </div>

      {/* Edge label dialog */}
      {pendingConnection && (
        <EdgeLabelDialog
          onConfirm={confirmEdge}
          onCancel={() => setPendingConnection(null)}
        />
      )}

      {/* Print styles */}
      <style>{`
        @media print {
          .react-flow__controls, .react-flow__minimap { display: none !important; }
          .react-flow__edge-label { color: #000 !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  )
}
