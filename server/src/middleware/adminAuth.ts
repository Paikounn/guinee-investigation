import { Response, NextFunction } from 'express'
import { AuthRequest } from './auth'

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Non authentifié' })
  }
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs' })
  }
  next()
}
