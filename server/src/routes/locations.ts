import express, { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

// Autocomplete districts
router.get('/districts', async (req: Request, res: Response) => {
  try {
    const { q } = req.query
    const query = (q as string)?.toLowerCase() || ''

    const districts = await prisma.district.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, name: true, code: true },
      take: 10,
    })

    res.json(districts)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch districts' })
  }
})

// Autocomplete prefectures by district
router.get('/districts/:districtId/prefectures', async (req: Request, res: Response) => {
  try {
    const { districtId } = req.params
    const { q } = req.query
    const query = (q as string)?.toLowerCase() || ''

    const prefectures = await prisma.prefecture.findMany({
      where: {
        districtId,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, name: true, code: true },
      take: 10,
    })

    res.json(prefectures)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prefectures' })
  }
})

// Autocomplete subprefectures by prefecture
router.get('/prefectures/:prefectureId/subprefectures', async (req: Request, res: Response) => {
  try {
    const { prefectureId } = req.params
    const { q } = req.query
    const query = (q as string)?.toLowerCase() || ''

    const subprefectures = await prisma.subprefecture.findMany({
      where: {
        prefectureId,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, name: true, code: true },
      take: 10,
    })

    res.json(subprefectures)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subprefectures' })
  }
})

// Get full hierarchy for a location
router.get('/hierarchy/:districtId/:prefectureId/:subprefectureId', async (req: Request, res: Response) => {
  try {
    const { districtId, prefectureId, subprefectureId } = req.params

    const [district, prefecture, subprefecture] = await Promise.all([
      prisma.district.findUnique({ where: { id: districtId } }),
      prisma.prefecture.findUnique({ where: { id: prefectureId } }),
      prisma.subprefecture.findUnique({ where: { id: subprefectureId } }),
    ])

    res.json({ district, prefecture, subprefecture })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch location hierarchy' })
  }
})

export default router

