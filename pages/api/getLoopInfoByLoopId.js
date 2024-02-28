// /pages/api/getLoopInfoByLoopId.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function getLoopInfoByLoopId(req, res) {
  const { loopId } = req.query
//   console.log('loopId', loopId)

  try {
    const loop = await prisma.loop.findUnique({
      where: {
        id: loopId,
      },
    })

    if (!loop) {
      return res.status(404).json({ error: 'Loop not found' })
    }

    res.status(200).json(loop)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred while retrieving loop information.' })
  } finally {
    await prisma.$disconnect()
  }
}