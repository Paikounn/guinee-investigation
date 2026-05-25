import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET || 'dev-secret-change-in-production'

export interface JWTPayload {
  userId: string
  corps: string
  role: string
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, secret, { expiresIn: '24h' })
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, secret) as JWTPayload
}