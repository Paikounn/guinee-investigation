import { useEffect, useRef, useCallback, useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { CollabUser } from '../types'

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
const WS_URL = import.meta.env.VITE_WS_URL || `${protocol}//${window.location.host}`

interface UseCollaborationProps {
  caseId: string | null
  onNodeMove?: (nodeId: string, x: number, y: number) => void
  onNodeCreate?: (node: any) => void
  onNodeUpdate?: (nodeId: string, data: any) => void
  onNodeDelete?: (nodeId: string) => void
  onEdgeCreate?: (edge: any) => void
  onEdgeDelete?: (edgeId: string) => void
}

export function useCollaboration({
  caseId,
  onNodeMove,
  onNodeCreate,
  onNodeUpdate,
  onNodeDelete,
  onEdgeCreate,
  onEdgeDelete,
}: UseCollaborationProps) {
  const { token, user } = useAuthStore()
  const wsRef = useRef<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)
  const [collabUsers, setCollabUsers] = useState<CollabUser[]>([])
  const lastCursorSend = useRef(0)

  useEffect(() => {
    if (!token || !caseId) return

    const ws = new WebSocket(`${WS_URL}?token=${token}`)
    wsRef.current = ws

    ws.onopen = () => {
      setConnected(true)
      ws.send(JSON.stringify({ type: 'JOIN_CASE', caseId, userName: user?.name }))
    }

    ws.onclose = () => {
      setConnected(false)
      wsRef.current = null
    }

    ws.onerror = () => setConnected(false)

    ws.onmessage = (event) => {
      let msg: any
      try { msg = JSON.parse(event.data) } catch { return }

      switch (msg.type) {
        case 'USERS_UPDATE':
          setCollabUsers(msg.users.filter((u: CollabUser) => u.userId !== user?.id))
          break
        case 'CURSOR_MOVE':
          setCollabUsers((prev) =>
            prev.map((u) =>
              u.userId === msg.userId ? { ...u, cursorX: msg.x, cursorY: msg.y } : u
            )
          )
          break
        case 'NODE_MOVE':
          onNodeMove?.(msg.nodeId, msg.x, msg.y)
          break
        case 'NODE_CREATE':
          onNodeCreate?.(msg.node)
          break
        case 'NODE_UPDATE':
          onNodeUpdate?.(msg.nodeId, msg.data)
          break
        case 'NODE_DELETE':
          onNodeDelete?.(msg.nodeId)
          break
        case 'EDGE_CREATE':
          onEdgeCreate?.(msg.edge)
          break
        case 'EDGE_DELETE':
          onEdgeDelete?.(msg.edgeId)
          break
      }
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'LEAVE_CASE', caseId }))
      }
      ws.close()
    }
  }, [caseId, token])

  const send = useCallback((msg: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg))
    }
  }, [])

  const sendNodeMove = useCallback(
    (nodeId: string, x: number, y: number) => send({ type: 'NODE_MOVE', nodeId, x, y }),
    [send]
  )

  const sendCursorMove = useCallback(
    (x: number, y: number) => {
      const now = Date.now()
      if (now - lastCursorSend.current < 50) return
      lastCursorSend.current = now
      send({ type: 'CURSOR_MOVE', x, y })
    },
    [send]
  )

  const sendNodeCreate = useCallback((node: any) => send({ type: 'NODE_CREATE', node }), [send])
  const sendNodeUpdate = useCallback((nodeId: string, data: any) => send({ type: 'NODE_UPDATE', nodeId, data }), [send])
  const sendNodeDelete = useCallback((nodeId: string) => send({ type: 'NODE_DELETE', nodeId }), [send])
  const sendEdgeCreate = useCallback((edge: any) => send({ type: 'EDGE_CREATE', edge }), [send])
  const sendEdgeDelete = useCallback((edgeId: string) => send({ type: 'EDGE_DELETE', edgeId }), [send])

  return {
    connected,
    collabUsers,
    sendNodeMove,
    sendCursorMove,
    sendNodeCreate,
    sendNodeUpdate,
    sendNodeDelete,
    sendEdgeCreate,
    sendEdgeDelete,
  }
}