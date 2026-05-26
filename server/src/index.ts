import 'dotenv/config'
import path from 'path'
import fs from 'fs'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { setupWebSocket } from './websocket/handler'
import authRouter from './routes/auth'
import casesRouter from './routes/cases'
import nodesRouter from './routes/nodes'
import edgesRouter from './routes/edges'

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })

app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true,
}))
app.use(express.json())

// API routes
app.use('/api/auth', authRouter)
app.use('/api/cases', casesRouter)
app.use('/api/cases/:caseId/nodes', nodesRouter)
app.use('/api/cases/:caseId/edges', edgesRouter)
app.get('/api/health', (_req, res) => res.json({ ok: true }))

setupWebSocket(wss)

// Serve React frontend — always, if the dist folder exists
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist')
if (fs.existsSync(clientDist)) {
  console.log(`Serving static files from: ${clientDist}`)
  app.use(express.static(clientDist))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
} else {
  console.warn(`Static dist not found at ${clientDist} — running API-only mode`)
}

const PORT = Number(process.env.PORT) || 3001
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`)
})
