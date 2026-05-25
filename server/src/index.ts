import 'dotenv/config'
import path from 'path'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { setupWebSocket } from './websocket/handler'
import authRouter from './routes/auth'
import casesRouter from './routes/cases'
import nodesRouter from './routes/nodes'
import edgesRouter from './routes/edges'

const isProd = process.env.NODE_ENV === 'production'

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })

const corsOrigin = isProd
  ? (process.env.CLIENT_URL || true)
  : (process.env.CLIENT_URL || 'http://localhost:5173')

app.use(cors({ origin: corsOrigin, credentials: true }))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/cases', casesRouter)
app.use('/api/cases/:caseId/nodes', nodesRouter)
app.use('/api/cases/:caseId/edges', edgesRouter)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

setupWebSocket(wss)

if (isProd) {
  const clientDist = path.join(__dirname, '..', '..', 'client', 'dist')
  app.use(express.static(clientDist))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

const PORT = Number(process.env.PORT) || 3001
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`)
})