import { WebSocket, WebSocketServer } from 'ws'
import { verifyToken } from '../lib/jwt'

interface Client {
  ws: WebSocket
  userId: string
  userName: string
  corps: string
  caseId: string | null
  cursorX: number
  cursorY: number
  color: string
}

const CURSOR_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
]

let colorIndex = 0
const clients = new Map<WebSocket, Client>()

function getRoom(caseId: string): Client[] {
  return Array.from(clients.values()).filter((c) => c.caseId === caseId)
}

function broadcast(caseId: string, message: object, excludeWs?: WebSocket) {
  const msg = JSON.stringify(message)
  for (const client of getRoom(caseId)) {
    if (client.ws !== excludeWs && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(msg)
    }
  }
}

function broadcastUsers(caseId: string) {
  const users = getRoom(caseId).map((c) => ({
    userId: c.userId,
    userName: c.userName,
    corps: c.corps,
    color: c.color,
    cursorX: c.cursorX,
    cursorY: c.cursorY,
  }))
  for (const client of getRoom(caseId)) {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify({ type: 'USERS_UPDATE', users }))
    }
  }
}

export function setupWebSocket(wss: WebSocketServer) {
  wss.on('connection', (ws, req) => {
    const url = new URL(req.url!, 'http://localhost')
    const token = url.searchParams.get('token')

    if (!token) { ws.close(1008, 'Token manquant'); return }

    let payload
    try { payload = verifyToken(token) } catch { ws.close(1008, 'Token invalide'); return }

    const client: Client = {
      ws,
      userId: payload.userId,
      userName: '',
      corps: payload.corps,
      caseId: null,
      cursorX: 0,
      cursorY: 0,
      color: CURSOR_COLORS[colorIndex++ % CURSOR_COLORS.length],
    }
    clients.set(ws, client)

    ws.on('message', (raw) => {
      let msg: any
      try { msg = JSON.parse(raw.toString()) } catch { return }

      const c = clients.get(ws)!

      switch (msg.type) {
        case 'JOIN_CASE':
          c.caseId = msg.caseId
          c.userName = msg.userName || 'Utilisateur'
          broadcastUsers(msg.caseId)
          break

        case 'LEAVE_CASE':
          if (c.caseId) {
            const oldCaseId = c.caseId
            c.caseId = null
            broadcastUsers(oldCaseId)
          }
          break

        case 'CURSOR_MOVE':
          if (!c.caseId) break
          c.cursorX = msg.x
          c.cursorY = msg.y
          broadcast(c.caseId, { type: 'CURSOR_MOVE', userId: c.userId, x: msg.x, y: msg.y }, ws)
          break

        case 'NODE_MOVE':
          if (!c.caseId) break
          broadcast(c.caseId, { type: 'NODE_MOVE', nodeId: msg.nodeId, x: msg.x, y: msg.y, userId: c.userId }, ws)
          break

        case 'NODE_CREATE':
        case 'NODE_UPDATE':
        case 'NODE_DELETE':
        case 'EDGE_CREATE':
        case 'EDGE_DELETE':
          if (!c.caseId) break
          broadcast(c.caseId, { ...msg, userId: c.userId }, ws)
          break
      }
    })

    ws.on('close', () => {
      const c = clients.get(ws)
      if (c?.caseId) broadcastUsers(c.caseId)
      clients.delete(ws)
    })

    ws.on('error', () => {
      const c = clients.get(ws)
      if (c?.caseId) broadcastUsers(c.caseId)
      clients.delete(ws)
    })
  })
}