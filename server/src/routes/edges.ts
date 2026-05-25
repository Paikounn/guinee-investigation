import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate } from '../middleware/auth'

const router = Router({ mergeParams: true })
router.use(authenticate)

router.post('/', async (req, res) => {
  try {
    const edge = await prisma.edge.create({
      data: {
        caseId: (req.params as any).caseId,
        sourceId: req.body.sourceId,
        targetId: req.body.targetId,
        label: req.body.label,
        edgeType: req.body.edgeType || 'default',
        data: req.body.data || {},
      },
    })
    res.json(edge)
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.patch('/:edgeId', async (req, res) => {
  try {
    const edge = await prisma.edge.update({
      where: { id: req.params.edgeId },
      data: { label: req.body.label, data: req.body.data },
    })
    res.json(edge)
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/:edgeId', async (req, res) => {
  try {
    await prisma.edge.delete({ where: { id: req.params.edgeId } })
    res.json({ ok: true })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

export default router