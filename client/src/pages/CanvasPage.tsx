import { useCallback, useEffect, useRef, useState } from 'react'
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

// ─── node palette config ───────────────────────────────────────────────────────

const PALETTE: { type: NodeType; label: string; icon: React.ElementType; color: string }[] = [
  { type: 'PERSON',       label: 'Personne',     icon: User,      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { type: 'VEHICLE',      label: 'Véhicule',     icon: Car,       color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
  { type: 'ORGANIZATION', label: 'Organisation', icon: Building2, color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
  { type: 'LOCATION',     label: 'Lieu',         icon: MapPin,    color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { type: 'CONTAINER',    label: 'Conteneur',    icon: Package,   color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
]

// ─── main export (wraps with provider) ────────────────────────────────────────

export default function CanvasPage() {
  return <CanvasContent />
}

// ─── inner canvas component ───────────────────────────────────────────────────

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
    async (_event: React.MouseEvent, node: FlowNode) => {
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
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top bar */}
      <div className="h-12 flex-shrink-0 bg-white border-b border-gray-200 flex items-center gap-3 px-4">
        <button
          onClick={() => navigate('/cases')}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Affaires
        </button>
        <div className="w-px h-5 bg-gray-200" />
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-xs text-gray-400 font-mono">{caseData?.reference}</span>
          <span className="font-semibold text-gray-900 text-sm truncate">{caseData?.title}</span>
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
            className={`flex items-center gap-1 text-xs ${connected ? 'text-green-600' : 'text-gray-400'}`}
            title={connected ? 'Connecté en temps réel' : 'Non connecté'}
          >
            {connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-2.5 py-1 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            SVG
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar */}
        <div className="w-56 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
          <div className="px-3 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Ajouter un nœud
            </p>
            <div className="space-y-1">
              {PALETTE.map(({ type, label, icon: Icon, color }) => (
                <button
                  key={type}
                  onClick={() => {
                    setAddingType(type)
                    setSelectedNode(null)
                    setAddForm({ label: '' })
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${color} ${addingType === type ? 'ring-2 ring-offset-1 ring-blue-400' : ''}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Add form */}
          {addingType && (
            <form onSubmit={handleAddNode} className="px-3 py-3 border-b border-gray-100 space-y-2">
              <p className="text-xs font-medium text-gray-600">
                Nouveau : {PALETTE.find((p) => p.type === addingType)?.label}
              </p>
              <input
                autoFocus
                className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom / identifiant"
                value={addForm.label}
                onChange={(e) => setAddForm({ label: e.target.value })}
              />
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setAddingType(null)}
                  className="flex-1 border border-gray-200 text-gray-500 py-1.5 rounded-lg text-xs hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={addLoading || !addForm.label.trim()}
                  className="flex-1 bg-blue-600 disabled:opacity-50 text-white py-1.5 rounded-lg text-xs flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  {addLoading ? '…' : 'Ajouter'}
                </button>
              </div>
            </form>
          )}

          {/* Case members */}
          {caseData?.members && caseData.members.length > 0 && (
            <div className="px-3 py-3 mt-auto border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Enquêteurs
              </p>
              <div className="space-y-1">
                {caseData.members.map((m) => {
                  const cfg = CORPS_CONFIG[m.user.corps]
                  const isMe = m.user.id === user?.id
                  return (
                    <div key={m.user.id} className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${cfg.bg}`}>
                        {m.user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-700 truncate">
                        {m.user.name}
                        {isMe && <span className="text-gray-400 ml-1">(moi)</span>}
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
            className="bg-gray-50"
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
          <div className="w-72 flex-shrink-0 bg-white border-l border-gray-200 overflow-hidden flex flex-col">
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
