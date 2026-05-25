import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate } from '../middleware/auth'

const router = Router({ mergeParams: true })
router.use(authenticate)

router.post('/', async (req, res) => {
  try {
    const node = await prisma.node.create({
      data: {
        caseId: (req.params as any).caseId,
        type: req.body.type,
        label: req.body.label,
        data: req.body.data || {},
        positionX: req.body.positionX ?? 0,
        positionY: req.body.positionY ?? 0,
      },
    })
    res.json(node)
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.patch('/:nodeId', async (req, res) => {
  try {
    const { label, data, positionX, positionY } = req.body
    const node = await prisma.node.update({
      where: { id: req.params.nodeId },
      data: {
        ...(label !== undefined && { label }),
        ...(data !== undefined && { data }),
        ...(positionX !== undefined && { positionX }),
        ...(positionY !== undefined && { positionY }),
      },
    })
    res.json(node)
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/:nodeId', async (req, res) => {
  try {
    await prisma.node.delete({ where: { id: req.params.nodeId } })
    res.json({ ok: true })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

export default router