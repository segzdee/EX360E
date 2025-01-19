import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const shifts = await prisma.shift.findMany({
        select: {
          id: true,
          position: true,
          hourlyRate: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10, // Limit to the 10 most recent shifts
      })

      // Calculate a mock change percentage (you may want to implement a real calculation based on historical data)
      const shiftsWithChange = shifts.map(shift => ({
        ...shift,
        change: (Math.random() * 10) - 5, // Random change between -5% and 5%
      }))

      res.status(200).json(shiftsWithChange)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching shift data' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

