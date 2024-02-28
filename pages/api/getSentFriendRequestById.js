import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function getPendingFriendRequests(req, res) {
  // const { id } = req.query

  const { userId } = req.query // Change this line

  // console.log('userId', userId); // Log the id to see if it's what you expect
  try {
    const pendingRequests = await prisma.friend.findMany({
      where: {
        requesterId: userId,
        status: 'pending',
      },
      select: {
        addresseeId: true,
      },
    })

    res.status(200).json(pendingRequests.map(request => request.addresseeId))
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred while retrieving pending friend requests.' })
  } finally {
    await prisma.$disconnect()
  }
}