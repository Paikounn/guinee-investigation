import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(authenticate)

const CreateCaseSchema = z.object({
  title: z.string().min(3, 'Titre trop court'),
  description: z.string().optional(),
  reference: z.string().min(3, 'Référence trop courte'),
})

router.get('/', async (req: AuthRequest, res) => {
  const { corps, role } = req.user!
  const cases = await prisma.case.findMany({
    where: role === 'ADMIN' ? {} : { corps: corps as any },
    include: {
      createdBy: { select: { name: true } },
      _count: { select: { nodes: true, members: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })
  res.json(cases)
})

router.post('/', async (req: AuthRequest, res) => {
  try {
    const data = CreateCaseSchema.parse(req.body)
    const { corps, userId } = req.user!
    const case_ = await prisma.case.create({
      data: {
        ...data,
        corps: corps as any,
        createdById: userId,
        members: { create: { userId } },
      },
      include: { createdBy: { select: { name: true } } },
    })
    res.json(case_)
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.get('/:id', async (req: AuthRequest, res) => {
  const { corps, role } = req.user!
  const case_ = await prisma.case.findFirst({
    where: { id: req.params.id, ...(role === 'ADMIN' ? {} : { corps: corps as any }) },
    include: {
      nodes: true,
      edges: true,
      members: { include: { user: { select: { id: true, name: true, corps: true, grade: true } } } },
    },
  })
  if (!case_) return res.status(404).json({ error: 'Affaire non trouvée' })
  res.json(case_)
})

router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const { status, title, description } = req.body
    const case_ = await prisma.case.update({
      where: { id: req.params.id },
      data: { status, title, description },
    })
    res.json(case_)
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/:id', async (req: AuthRequest, res) => {
  if (req.user!.role !== 'ADMIN') return res.status(403).json({ error: 'Accès refusé' })
  await prisma.case.delete({ where: { id: req.params.id } })
  res.json({ ok: true })
})

export default router