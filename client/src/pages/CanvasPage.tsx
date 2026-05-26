import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node as FlowNode,
  type Edge as FlowEdge,
  type OnConnect,
  type OnNodesDelete,
  type OnEdgesDelete,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import {
  ArrowLeft,
  Plus,
  Download,
  Wifi,
  WifiOff,
  User,
  Car,
  Building2,
  MapPin,
  Package,
} from 'lucide-react'

import { api } from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import { useLanguage } from '../contexts/LanguageContext'
import { useCollaboration } from '../hooks/useCollaboration'
import { exportToSVG } from '../utils/exportSVG'
import { nodeTypes, type FlowNodeData } from '../components/CustomNode'
import NodePanel from '../components/NodePanel'
import { CaseFull, NodeType, DBNode, DBEdge, CORPS_CONFIG, STATUS_CONFIG } from '../types'

// ─── data converters ──────────────────────────────────────────────────────────

function dbNodeToFlow(n: DBNode): FlowNode<FlowNodeData> {
  return {
    id: n.id,
    type: n.type,
    position: { x: n.positionX, y: n.positionY },
    data: {
      label: n.label,
      nodeType: n.type,
      nodeData: n.data as Record<string, unknown>,
    },
  }
}

function dbEdgeToFlow(e: DBEdge): FlowEdge {
  return {
    id: e.id,
    source: e.sourceId,
    target: e.targetId,
    label: e.label,
    type: 'smoothstep',
    data: (e.data ?? {}) as Record<string, unknown>,
  }
}

// ─── main export ──────────────────────────────────────────────────────────────

export default function CanvasPage() {
  return <CanvasContent />
}

// ─── inner canvas component ───────────────────────────────────────────────────

function CanvasContent() {
  const { caseId } = useParams<{ caseId: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { t } = useLanguage()

  const canvasRef = useRef<HTMLDivElement>(null)

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode<FlowNodeData>>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([])
  const [selectedNode, setSelectedNode] = useState<FlowNode<FlowNodeData> | null>(null)
  const [addingType, setAddingType] = useState<NodeType | null>(null)
  const [addForm, setAddForm] = useState({ label: '' })
  const [addLoading, setAddLoading] = useState(false)

  // Node palette — labels from i18n
  const PALETTE: { type: NodeType; icon: React.ElementType; color: string }[] = [
    { type: 'PERSON',       icon: User,      color: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200' },
    { type: 'VEHICLE',      icon: Car,       color: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200' },
    { type: 'ORGANIZATION', icon: Building2, color: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200' },
    { type: 'LOCATION',     icon: MapPin,    color: 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200' },
    { type: 'CONTAINER',    icon: Package,   color: 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200' },
  ]

  // ─── load case data ──────────────────────────────────────────────────────────

  const { data: caseData } = useQuery({
    queryKey: ['case', caseId],
    queryFn: () => api.get<CaseFull>(`/cases/${caseId}`),
    staleTime: Infinity,
    enabled: !!caseId,
  })

  useEffect(() => {
    if (!caseData) return
    setNodes(caseData.nodes.map(dbNodeToFlow))
    setEdges(caseData.edges.map(dbEdgeToFlow))
  }, [caseData?.id])

  // ─── collaboration ───────────────────────────────────────────────────────────

  const {
    connected,
    collabUsers,
    sendNodeMove,
    sendCursorMove,
    sendNodeCreate,
    sendNodeUpdate,
    sendNodeDelete,
    sendEdgeCreate,
    sendEdgeDelete,
  } = useCollaboration({
    caseId: caseId ?? null,
    onNodeMove: (nodeId, x, y) => {
      setNodes((ns) =>
        ns.map((n) => (n.id === nodeId ? { ...n, position: { x, y } } : n))
      )
    },
    onNodeCreate: (node) => {
      setNodes((ns) => [...ns, dbNodeToFlow(node as DBNode)])
    },
    onNodeUpdate: (nodeId, data) => {
      setNodes((ns) =>
        ns.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, label: data.label, nodeData: data.data } } : n
        )
      )
    },
    onNodeDelete: (nodeId) => {
      setNodes((ns) => ns.filter((n) => n.id !== nodeId))
      setEdges((es) => es.filter((e) => e.source !== nodeId && e.target !== nodeId))
      setSelectedNode((s) => (s?.id === nodeId ? null : s))
    },
    onEdgeCreate: (edge) => {
      setEdges((es) => [...es, dbEdgeToFlow(edge as DBEdge)])
    },
    onEdgeDelete: (edgeId) => {
      setEdges((es) => es.filter((e) => e.id !== edgeId))
    },
  })

  // ─── cursor tracking ─────────────────────────────────────────────────────────

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    sendCursorMove(e.clientX - rect.left, e.clientY - rect.top)
  }

  // ─── connect edge ────────────────────────────────────────────────────────────

  const onConnect: OnConnect = useCallback(
    async (connection: Connection) => {
      if (!caseId || !connection.source || !connection.target) return
      try {
        const edge = await api.post<DBEdge>(`/cases/${caseId}/edges`, {
          sourceId: connection.source,
          targetId: connection.target,
          edgeType: 'smoothstep',
        })
        const flowEdge = dbEdgeToFlow(edge)
        setEdges((es) => addEdge(flowEdge, es))
        sendEdgeCreate(edge)
      } catch (e) {
        console.error('Failed to create edge', e)
      }
    },
    [caseId, setEdges, sendEdgeCreate]
  )

  // ─── drag stop → save position ───────────────────────────────────────────────

  const onNodeDragStop = useCallback(
    async (_event: ReactMouseEvent, node: FlowNode<FlowNodeData>) => {
      if (!caseId) return
      try {
        await api.patch(`/cases/${caseId}/nodes/${node.id}`, {
          positionX: node.position.x,
          positionY: node.position.y,
        })
        sendNodeMove(node.id, node.position.x, node.position.y)
      } catch (e) {
        console.error('Failed to save node position', e)
      }
    },
    [caseId, sendNodeMove]
  )

  // ─── delete nodes ─────────────────────────────────────────────────────────────

  const onNodesDelete: OnNodesDelete = useCallback(
    async (deleted) => {
      if (!caseId) return
      for (const node of deleted) {
        try {
          await api.delete(`/cases/${caseId}/nodes/${node.id}`)
          sendNodeDelete(node.id)
          if (selectedNode?.id === node.id) setSelectedNode(null)
        } catch (e) {
          console.error('Failed to delete node', e)
        }
      }
    },
    [caseId, selectedNode, sendNodeDelete]
  )

  // ─── delete edges ─────────────────────────────────────────────────────────────

  const onEdgesDelete: OnEdgesDelete = useCallback(
    async (deleted) => {
      if (!caseId) return
      for (const edge of deleted) {
        try {
          await api.delete(`/cases/${caseId}/edges/${edge.id}`)
          sendEdgeDelete(edge.id)
        } catch (e) {
          console.error('Failed to delete edge', e)
        }
      }
    },
    [caseId, sendEdgeDelete]
  )

  // ─── select node ─────────────────────────────────────────────────────────────

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: FlowNode) => {
      setSelectedNode(node as FlowNode<FlowNodeData>)
      setAddingType(null)
    },
    []
  )

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  // ─── add new node ─────────────────────────────────────────────────────────────

  async function handleAddNode(e: React.FormEvent) {
    e.preventDefault()
    if (!caseId || !addingType || !addForm.label.trim()) return
    setAddLoading(true)
    try {
      const node = await api.post<DBNode>(`/cases/${caseId}/nodes`, {
        type: addingType,
        label: addForm.label.trim(),
        data: {},
        positionX: 200 + Math.random() * 400,
        positionY: 100 + Math.random() * 300,
      })
      const flowNode = dbNodeToFlow(node)
      setNodes((ns) => [...ns, flowNode])
      sendNodeCreate(node)
      setAddingType(null)
      setAddForm({ label: '' })
      setSelectedNode(flowNode)
    } catch (err) {
      console.error('Failed to create node', err)
    } finally {
      setAddLoading(false)
    }
  }

  // ─── node panel update ────────────────────────────────────────────────────────

  async function handleNodeUpdate(nodeId: string, label: string, data: Record<string, unknown>) {
    if (!caseId) return
    const updated = await api.patch<DBNode>(`/cases/${caseId}/nodes/${nodeId}`, { label, data })
    setNodes((ns) =>
      ns.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, label: updated.label, nodeData: updated.data as Record<string, unknown> } }
          : n
      )
    )
    sendNodeUpdate(nodeId, { label: updated.label, data: updated.data })
    setSelectedNode((s) =>
      s?.id === nodeId
        ? { ...s, data: { ...s.data, label: updated.label, nodeData: updated.data as Record<string, unknown> } }
        : s
    )
  }

  // ─── node panel delete ────────────────────────────────────────────────────────

  async function handleNodeDelete(nodeId: string) {
    if (!caseId) return
    await api.delete(`/cases/${caseId}/nodes/${nodeId}`)
    setNodes((ns) => ns.filter((n) => n.id !== nodeId))
    setEdges((es) => es.filter((e) => e.source !== nodeId && e.target !== nodeId))
    sendNodeDelete(nodeId)
    setSelectedNode(null)
  }

  // ─── export SVG ───────────────────────────────────────────────────────────────

  function handleExport() {
    exportToSVG(canvasRef.current, caseData?.title ?? 'investigation')
  }

  const corps = caseData?.corps ? CORPS_CONFIG[caseData.corps] : null
  const status = caseData?.status ? STATUS_CONFIG[caseData.status] : null

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="h-14 flex-shrink-0 bg-white border-b border-slate-200 flex items-center gap-3 px-4 shadow-sm">
        <button
          onClick={() => navigate('/cases')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{t.canvas.backToCases}</span>
        </button>
        <div className="w-px h-5 bg-slate-200" />

        {/* Case info */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">{caseData?.reference}</span>
          <span className="font-semibold text-slate-900 text-sm truncate">{caseData?.title}</span>
          {status && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${status.color}`}>
              {status.label}
            </span>
          )}
          {corps && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium text-white flex-shrink-0 ${corps.bg}`}>
              {corps.badge}
            </span>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Collab users */}
          {collabUsers.length > 0 && (
            <div className="flex -space-x-1.5">
              {collabUsers.slice(0, 5).map((u) => (
                <div
                  key={u.userId}
                  title={u.userName}
                  className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: u.color }}
                >
                  {u.userName.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          )}

          {/* Connection status */}
          <div
            className={`flex items-center gap-1 text-xs ${connected ? 'text-green-600' : 'text-slate-400'}`}
            title={connected ? t.canvas.connected : t.canvas.disconnected}
          >
            {connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          </div>

          {/* Export */}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.canvas.exportSVG}</span>
          </button>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left sidebar */}
        <div className="w-52 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col shadow-sm">
          <div className="px-3 py-3 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
              {t.canvas.addNode}
            </p>
            <div className="space-y-1">
              {PALETTE.map(({ type, icon: Icon, color }) => (
                <button
                  key={type}
                  onClick={() => {
                    setAddingType(type)
                    setSelectedNode(null)
                    setAddForm({ label: '' })
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${color} ${
                    addingType === type ? 'ring-2 ring-offset-1 ring-guinea-red' : ''
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {t.canvas.nodeTypes[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Add form */}
          {addingType && (
            <form onSubmit={handleAddNode} className="px-3 py-3 border-b border-slate-100 space-y-2">
              <p className="text-xs font-medium text-slate-600">
                {t.canvas.newNode}: {t.canvas.nodeTypes[addingType]}
              </p>
              <input
                autoFocus
                className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:border-transparent bg-white"
                style={{ '--tw-ring-color': '#CE1126' } as React.CSSProperties}
                placeholder={t.canvas.nameLabel}
                value={addForm.label}
                onChange={(e) => setAddForm({ label: e.target.value })}
              />
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setAddingType(null)}
                  className="flex-1 border border-slate-200 text-slate-500 py-1.5 rounded-lg text-xs hover:bg-slate-50 transition-colors"
                >
                  {t.canvas.cancel}
                </button>
                <button
                  type="submit"
                  disabled={addLoading || !addForm.label.trim()}
                  className="flex-1 text-white py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 disabled:opacity-50 transition-all"
                  style={{ background: 'linear-gradient(135deg, #CE1126, #A50D1E)' }}
                >
                  <Plus className="w-3 h-3" />
                  {addLoading ? t.canvas.adding : t.canvas.add}
                </button>
              </div>
            </form>
          )}

          {/* Case members */}
          {caseData?.members && caseData.members.length > 0 && (
            <div className="px-3 py-3 mt-auto border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                {t.canvas.investigators}
              </p>
              <div className="space-y-1.5">
                {caseData.members.map((m) => {
                  const cfg = CORPS_CONFIG[m.user.corps]
                  const isMe = m.user.id === user?.id
                  return (
                    <div key={m.user.id} className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${cfg.bg}`}>
                        {m.user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-slate-700 truncate">
                        {m.user.name}
                        {isMe && <span className="text-slate-400 ml-1">{t.canvas.me}</span>}
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
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDragStop={onNodeDragStop}
            onNodesDelete={onNodesDelete}
            onEdgesDelete={onEdgesDelete}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            deleteKeyCode="Delete"
            multiSelectionKeyCode="Shift"
            className="bg-slate-50"
          >
            <Background color="#e2e8f0" gap={20} />
            <Controls />
            <MiniMap
              nodeColor={(n) => {
                const t = (n.data as FlowNodeData).nodeType
                const map: Record<NodeType, string> = {
                  PERSON: '#3b82f6',
                  VEHICLE: '#f59e0b',
                  ORGANIZATION: '#8b5cf6',
                  LOCATION: '#22c55e',
                  CONTAINER: '#f97316',
                }
                return map[t] ?? '#94a3b8'
              }}
            />
          </ReactFlow>

          {/* Collaboration cursors */}
          {collabUsers.map((u) => (
            <CollabCursor key={u.userId} user={u} />
          ))}
        </div>

        {/* Right panel — selected node */}
        {selectedNode && (
          <div className="w-72 flex-shrink-0 bg-white border-l border-slate-200 overflow-hidden flex flex-col shadow-sm">
            <NodePanel
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
              onUpdate={handleNodeUpdate}
              onDelete={handleNodeDelete}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── collaboration cursor ─────────────────────────────────────────────────────

interface CollabCursorProps {
  user: { userId: string; userName: string; color: string; cursorX: number; cursorY: number }
}

function CollabCursor({ user: u }: CollabCursorProps) {
  return (
    <div
      className="absolute pointer-events-none z-50 transition-transform duration-75"
      style={{ left: u.cursorX, top: u.cursorY, transform: 'translate(-2px, -2px)' }}
    >
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
        <path d="M0 0L16 8L8 10L6 20L0 0Z" fill={u.color} stroke="white" strokeWidth="1.5" />
      </svg>
      <span
        className="absolute left-4 top-4 text-xs text-white px-1.5 py-0.5 rounded whitespace-nowrap font-medium"
        style={{ backgroundColor: u.color }}
      >
        {u.userName}
      </span>
    </div>
  )
}
