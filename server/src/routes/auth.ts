import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { signToken } from '../lib/jwt'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

const RegisterSchema = z.object({
  email: z.string().email('Email invalide'),
  name: z.string().min(2, 'Nom trop court'),
  password: z.string().min(6, 'Mot de passe trop court'),
  corps: z.enum(['POLICE', 'GENDARMERIE', 'DOUANE']),
  grade: z.string().optional(),
  matricule: z.string().optional(),
})

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

router.post('/register', async (req, res) => {
  try {
    const data = RegisterSchema.parse(req.body)
    const exists = await prisma.user.findUnique({ where: { email: data.email } })
    if (exists) return res.status(400).json({ error: 'Email déjà utilisé' })

    const hashed = await bcrypt.hash(data.password, 10)
    const user = await prisma.user.create({
      data: { ...data, password: hashed },
      select: { id: true, name: true, email: true, corps: true, role: true, grade: true, matricule: true },
    })
    const token = signToken({ userId: user.id, corps: user.corps, role: user.role })
    res.json({ user, token })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = LoginSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Identifiants incorrects' })
    }
    const token = signToken({ userId: user.id, corps: user.corps, role: user.role })
    const { password: _, ...safeUser } = user
    res.json({ user: safeUser, token })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.get('/me', authenticate, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, name: true, email: true, corps: true, role: true, grade: true, matricule: true },
  })
  res.json(user)
})

export default router