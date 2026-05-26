import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ReactFlow, Background, Controls, MiniMap, addEdge,
  useNodesState, useEdgesState,
  type Connection, type Node as FlowNode, type Edge as FlowEdge,
  type OnConnect, type OnNodesDelete, type OnEdgesDelete,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  ArrowLeft, Plus, Download, Wifi, WifiOff,
  User, Car, Building2, MapPin, Package, X,
} from 'lucide-react'

import { api } from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import { useCollaboration } from '../hooks/useCollaboration'
import { exportToSVG } from '../utils/exportSVG'
import { nodeTypes, type FlowNodeData } from '../components/CustomNode'
import NodePanel from '../components/NodePanel'
import { CaseFull, NodeType, DBNode, DBEdge, CORPS_CONFIG, STATUS_CONFIG } from '../types'

function dbNodeToFlow(n: DBNode): FlowNode<FlowNodeData> {
  return { id: n.id, type: n.type, position: { x: n.positionX, y: n.positionY }, data: { label: n.label, nodeType: n.type, nodeData: n.data as Record<string, unknown> } }
}
function dbEdgeToFlow(e: DBEdge): FlowEdge {
  return { id: e.id, source: e.sourceId, target: e.targetId, label: e.label, type: 'smoothstep', data: (e.data ?? {}) as Record<string, unknown> }
}

const PALETTE: { type: NodeType; label: string; icon: React.ElementType; accent: string; dot: string }[] = [
  { type: 'PERSON',       label: 'Personne',     icon: User,      accent: 'text-blue-400 bg-blue-500/10 border-blue-500/30 hover:border-blue-400/60',    dot: 'bg-blue-400' },
  { type: 'VEHICLE',      label: 'Véhicule',     icon: Car,       accent: 'text-amber-400 bg-amber-500/10 border-amber-500/30 hover:border-amber-400/60', dot: 'bg-amber-400' },
  { type: 'ORGANIZATION', label: 'Organisation', icon: Building2, accent: 'text-purple-400 bg-purple-500/10 border-purple-500/30 hover:border-purple-400/60', dot: 'bg-purple-400' },
  { type: 'LOCATION',     label: 'Lieu',         icon: MapPin,    accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-400/60', dot: 'bg-emerald-400' },
  { type: 'CONTAINER',    label: 'Conteneur',    icon: Package,   accent: 'text-orange-400 bg-orange-500/10 border-orange-500/30 hover:border-orange-400/60', dot: 'bg-orange-400' },
]

export default function CanvasPage() { return <CanvasContent /> }

function CanvasContent() {
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
    onNodeMove: (nodeId, x, y) => setNodes((ns) => ns.map((n) => n.id === nodeId ? { ...n, position: { x, y } } : n)),
    onNodeCreate: (node) => setNodes((ns) => [...ns, dbNodeToFlow(node as DBNode)]),
    onNodeUpdate: (nodeId, data) => setNodes((ns) => ns.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, label: data.label, nodeData: data.data } } : n)),
    onNodeDelete: (nodeId) => { setNodes((ns) => ns.filter((n) => n.id !== nodeId)); setEdges((es) => es.filter((e) => e.source !== nodeId && e.target !== nodeId)); setSelectedNode((s) => s?.id === nodeId ? null : s) },
    onEdgeCreate: (edge) => setEdges((es) => [...es, dbEdgeToFlow(edge as DBEdge)]),
    onEdgeDelete: (edgeId) => setEdges((es) => es.filter((e) => e.id !== edgeId)),
  })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    sendCursorMove(e.clientX - rect.left, e.clientY - rect.top)
  }

  const onConnect: OnConnect = useCallback(async (connection: Connection) => {
    if (!caseId || !connection.source || !connection.target) return
    try {
      const edge = await api.post<DBEdge>(`/cases/${caseId}/edges`, { sourceId: connection.source, targetId: connection.target, edgeType: 'smoothstep' })
      setEdges((es) => addEdge(dbEdgeToFlow(edge), es))
      sendEdgeCreate(edge)
    } catch (e) { console.error('Failed to create edge', e) }
  }, [caseId, setEdges, sendEdgeCreate])

  const onNodeDragStop = useCallback(async (_event: ReactMouseEvent, node: FlowNode<FlowNodeData>) => {
    if (!caseId) return
    try {
      await api.patch(`/cases/${caseId}/nodes/${node.id}`, { positionX: node.position.x, positionY: node.position.y })
      sendNodeMove(node.id, node.position.x, node.position.y)
    } catch (e) { console.error('Failed to save node position', e) }
  }, [caseId, sendNodeMove])

  const onNodesDelete: OnNodesDelete = useCallback(async (deleted) => {
    if (!caseId) return
    for (const node of deleted) {
      try { await api.delete(`/cases/${caseId}/nodes/${node.id}`); sendNodeDelete(node.id); if (selectedNode?.id === node.id) setSelectedNode(null) }
      catch (e) { console.error('Failed to delete node', e) }
    }
  }, [caseId, selectedNode, sendNodeDelete])

  const onEdgesDelete: OnEdgesDelete = useCallback(async (deleted) => {
    if (!caseId) return
    for (const edge of deleted) {
      try { await api.delete(`/cases/${caseId}/edges/${edge.id}`); sendEdgeDelete(edge.id) }
      catch (e) { console.error('Failed to delete edge', e) }
    }
  }, [caseId, sendEdgeDelete])

  const onNodeClick = useCallback((_: React.MouseEvent, node: FlowNode) => { setSelectedNode(node as FlowNode<FlowNodeData>); setAddingType(null) }, [])
  const onPaneClick = useCallback(() => setSelectedNode(null), [])

  async function handleAddNode(e: React.FormEvent) {
    e.preventDefault()
    if (!caseId || !addingType || !addForm.label.trim()) return
    setAddLoading(true)
    try {
      const node = await api.post<DBNode>(`/cases/${caseId}/nodes`, { type: addingType, label: addForm.label.trim(), data: {}, positionX: 200 + Math.random() * 400, positionY: 100 + Math.random() * 300 })
      const flowNode = dbNodeToFlow(node)
      setNodes((ns) => [...ns, flowNode])
      sendNodeCreate(node)
      setAddingType(null); setAddForm({ label: '' }); setSelectedNode(flowNode)
    } catch (err) { console.error('Failed to create node', err) }
    finally { setAddLoading(false) }
  }

  async function handleNodeUpdate(nodeId: string, label: string, data: Record<string, unknown>) {
    if (!caseId) return
    const updated = await api.patch<DBNode>(`/cases/${caseId}/nodes/${nodeId}`, { label, data })
    setNodes((ns) => ns.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, label: updated.label, nodeData: updated.data as Record<string, unknown> } } : n))
    sendNodeUpdate(nodeId, { label: updated.label, data: updated.data })
    setSelectedNode((s) => s?.id === nodeId ? { ...s, data: { ...s.data, label: updated.label, nodeData: updated.data as Record<string, unknown> } } : s)
  }

  async function handleNodeDelete(nodeId: string) {
    if (!caseId) return
    await api.delete(`/cases/${caseId}/nodes/${nodeId}`)
    setNodes((ns) => ns.filter((n) => n.id !== nodeId))
    setEdges((es) => es.filter((e) => e.source !== nodeId && e.target !== nodeId))
    sendNodeDelete(nodeId)
    setSelectedNode(null)
  }

  function handleExport() { exportToSVG(canvasRef.current, caseData?.title ?? 'investigation') }

  const corps = caseData?.corps ? CORPS_CONFIG[caseData.corps] : null
  const status = caseData?.status ? STATUS_CONFIG[caseData.status] : null

  return (
    <div className="h-screen flex flex-col bg-[#080c14]">
      {/* Top bar */}
      <div className="h-12 flex-shrink-0 bg-[#0b1020] border-b border-slate-800/60 flex items-center gap-3 px-4">
        <button
          onClick={() => navigate('/cases')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-200 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Affaires</span>
        </button>
        <div className="w-px h-5 bg-slate-800" />
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-xs text-slate-600 font-mono tracking-wider">{caseData?.reference}</span>
          <span className="font-semibold text-white text-sm truncate">{caseData?.title}</span>
          {status && (
            <span className={`hidden sm:inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${status.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          )}
          {corps && (
            <span className={`hidden sm:inline text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${corps.bg}`}>
              {corps.badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 ml-auto">
          {collabUsers.length > 0 && (
            <div className="flex -space-x-1.5">
              {collabUsers.slice(0, 5).map((u) => (
                <div key={u.userId} title={u.userName} className="w-6 h-6 rounded-full border-2 border-[#0b1020] flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: u.color }}>
                  {u.userName.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          )}
          <div className={`flex items-center gap-1 text-xs ${connected ? 'text-emerald-400' : 'text-slate-600'}`} title={connected ? 'Connecté en temps réel' : 'Non connecté'}>
            {connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-xs">{connected ? 'En direct' : 'Hors ligne'}</span>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            SVG
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar */}
        <div className="w-56 flex-shrink-0 bg-[#0b1020] border-r border-slate-800/60 flex flex-col">
          <div className="px-3 py-3 border-b border-slate-800/60">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2">Ajouter</p>
            <div className="space-y-1">
              {PALETTE.map(({ type, label, icon: Icon, accent }) => (
                <button
                  key={type}
                  onClick={() => { setAddingType(type); setSelectedNode(null); setAddForm({ label: '' }) }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${accent} ${addingType === type ? 'ring-1 ring-cyan-400/50' : ''}`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {addingType && (
            <form onSubmit={handleAddNode} className="px-3 py-3 border-b border-slate-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-400">
                  {PALETTE.find((p) => p.type === addingType)?.label}
                </p>
                <button type="button" onClick={() => setAddingType(null)} className="text-slate-600 hover:text-slate-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                autoFocus
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40"
                placeholder="Nom / identifiant"
                value={addForm.label}
                onChange={(e) => setAddForm({ label: e.target.value })}
              />
              <button
                type="submit"
                disabled={addLoading || !addForm.label.trim()}
                className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-900 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                {addLoading ? '…' : 'Ajouter'}
              </button>
            </form>
          )}

          {caseData?.members && caseData.members.length > 0 && (
            <div className="px-3 py-3 mt-auto border-t border-slate-800/60">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2">Enquêteurs</p>
              <div className="space-y-1.5">
                {caseData.members.map((m) => {
                  const cfg = CORPS_CONFIG[m.user.corps]
                  const isMe = m.user.id === user?.id
                  return (
                    <div key={m.user.id} className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 border ${cfg.border} bg-slate-800`}>
                        {m.user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-slate-400 truncate">
                        {m.user.name}
                        {isMe && <span className="text-slate-600 ml-1">(moi)</span>}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div ref={canvasRef} className="flex-1 relative" onMouseMove={handleMouseMove}>
          <ReactFlow
            nodes={nodes} edges={edges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={onConnect} onNodeDragStop={onNodeDragStop}
            onNodesDelete={onNodesDelete} onEdgesDelete={onEdgesDelete}
            onNodeClick={onNodeClick} onPaneClick={onPaneClick}
            nodeTypes={nodeTypes} fitView
            deleteKeyCode="Delete" multiSelectionKeyCode="Shift"
            className="bg-[#080c14]"
          >
            <Background color="#1e293b" gap={24} size={1} />
            <Controls className="[&>button]:bg-slate-900 [&>button]:border-slate-700 [&>button]:text-slate-400" />
            <MiniMap
              className="!bg-slate-900 !border-slate-700"
              nodeColor={(n) => {
                const t = (n.data as FlowNodeData).nodeType
                const map: Record<NodeType, string> = { PERSON: '#60a5fa', VEHICLE: '#fbbf24', ORGANIZATION: '#a78bfa', LOCATION: '#34d399', CONTAINER: '#fb923c' }
                return map[t] ?? '#64748b'
              }}
            />
          </ReactFlow>
          {collabUsers.map((u) => <CollabCursor key={u.userId} user={u} />)}
        </div>

        {selectedNode && (
          <div className="w-72 flex-shrink-0 bg-[#0b1020] border-l border-slate-800/60 overflow-hidden flex flex-col">
            <NodePanel node={selectedNode} onClose={() => setSelectedNode(null)} onUpdate={handleNodeUpdate} onDelete={handleNodeDelete} />
          </div>
        )}
      </div>
    </div>
  )
}

interface CollabCursorProps {
  user: { userId: string; userName: string; color: string; cursorX: number; cursorY: number }
}
function CollabCursor({ user: u }: CollabCursorProps) {
  return (
    <div className="absolute pointer-events-none z-50 transition-transform duration-75" style={{ left: u.cursorX, top: u.cursorY, transform: 'translate(-2px, -2px)' }}>
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
        <path d="M0 0L16 8L8 10L6 20L0 0Z" fill={u.color} stroke="#0b1020" strokeWidth="1.5" />
      </svg>
      <span className="absolute left-4 top-4 text-xs text-white px-1.5 py-0.5 rounded whitespace-nowrap font-medium" style={{ backgroundColor: u.color }}>
        {u.userName}
      </span>
    </div>
  )
}
