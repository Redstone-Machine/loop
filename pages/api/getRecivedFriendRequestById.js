import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function getPendingFriendRequests(req, res) {
  const { userId } = req.query

  try {
    const pendingRequests = await prisma.friend.findMany({
      where: {
        addresseeId: userId,
        status: 'pending',
      },
      select: {
        requesterId: true,
      },
    })

    res.status(200).json(pendingRequests.map(request => request.requesterId)) // Change this line
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred while retrieving pending friend requests.' })
  } finally {
    await prisma.$disconnect()
  }
}