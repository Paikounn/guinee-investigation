import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../middleware/auth'
import { requireAdmin } from '../middleware/adminAuth'

const router = Router()
router.use(authenticate)
router.use(requireAdmin)

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20))
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          corps: true,
          role: true,
          grade: true,
          matricule: true,
          active: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { cases: true, createdCases: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ])

    res.json({ users, total, page })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// ─── GET /api/admin/users/:userId ─────────────────────────────────────────────
router.get('/users/:userId', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      select: {
        id: true,
        email: true,
        name: true,
        corps: true,
        role: true,
        grade: true,
        matricule: true,
        active: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { cases: true, createdCases: true } },
      },
    })
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' })
    res.json(user)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// ─── PATCH /api/admin/users/:userId ───────────────────────────────────────────
const UpdateUserSchema = z.object({
  role: z.enum(['ADMIN', 'INVESTIGATOR', 'ANALYST']).optional(),
  corps: z.enum(['POLICE', 'GENDARMERIE', 'DOUANE']).optional(),
  active: z.boolean().optional(),
})

router.patch('/users/:userId', async (req, res) => {
  try {
    const data = UpdateUserSchema.parse(req.body)
    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        corps: true,
        role: true,
        grade: true,
        matricule: true,
        active: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    res.json(user)
  } catch (e: any) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Utilisateur non trouvé' })
    res.status(400).json({ error: e.message })
  }
})

// ─── DELETE /api/admin/users/:userId ──────────────────────────────────────────
router.delete('/users/:userId', async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.params.userId },
      data: { active: false },
    })
    res.json({ success: true })
  } catch (e: any) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Utilisateur non trouvé' })
    res.status(500).json({ error: e.message })
  }
})

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────
router.get('/stats', async (_req, res) => {
  try {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const [
      totalUsers,
      totalCases,
      adminCount,
      investigatorCount,
      analystCount,
      policeCount,
      gendarmerieCount,
      douaneCount,
      openCases,
      activeCases,
      closedCases,
      archivedCases,
      activeUsers24h,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.case.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'INVESTIGATOR' } }),
      prisma.user.count({ where: { role: 'ANALYST' } }),
      prisma.user.count({ where: { corps: 'POLICE' } }),
      prisma.user.count({ where: { corps: 'GENDARMERIE' } }),
      prisma.user.count({ where: { corps: 'DOUANE' } }),
      prisma.case.count({ where: { status: 'OPEN' } }),
      prisma.case.count({ where: { status: 'ACTIVE' } }),
      prisma.case.count({ where: { status: 'CLOSED' } }),
      prisma.case.count({ where: { status: 'ARCHIVED' } }),
      prisma.user.count({ where: { lastLogin: { gte: since24h } } }),
    ])

    res.json({
      totalUsers,
      totalCases,
      usersByRole: {
        ADMIN: adminCount,
        INVESTIGATOR: investigatorCount,
        ANALYST: analystCount,
      },
      usersByCorps: {
        POLICE: policeCount,
        GENDARMERIE: gendarmerieCount,
        DOUANE: douaneCount,
      },
      casesByStatus: {
        OPEN: openCases,
        ACTIVE: activeCases,
        CLOSED: closedCases,
        ARCHIVED: archivedCases,
      },
      activeUsers24h,
      systemStatus: 'operational',
    })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// ─── GET /api/admin/activity ──────────────────────────────────────────────────
router.get('/activity', async (_req, res) => {
  try {
    const [recentLogins, recentCases] = await Promise.all([
      prisma.user.findMany({
        where: { lastLogin: { not: null } },
        select: { id: true, name: true, corps: true, role: true, lastLogin: true },
        orderBy: { lastLogin: 'desc' },
        take: 20,
      }),
      prisma.case.findMany({
        select: {
          id: true,
          reference: true,
          title: true,
          status: true,
          createdAt: true,
          createdBy: { select: { id: true, name: true, corps: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ])

    const activity = [
      ...recentLogins.map((u) => ({
        type: 'login' as const,
        userId: u.id,
        userName: u.name,
        corps: u.corps,
        role: u.role,
        timestamp: u.lastLogin!,
        detail: `Connexion de ${u.name}`,
      })),
      ...recentCases.map((c) => ({
        type: 'case_created' as const,
        userId: c.createdBy.id,
        userName: c.createdBy.name,
        corps: c.createdBy.corps,
        timestamp: c.createdAt,
        detail: `Affaire créée : ${c.reference} — ${c.title}`,
        caseId: c.id,
        caseReference: c.reference,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 40)

    res.json(activity)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

export default router
