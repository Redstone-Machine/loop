// /pages/api/getFriendsById.js

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function getFriendsRequests(req, res) {
  const { userId } = req.query 

  console.log('userId', userId);
  try {
    const friends = await prisma.friend.findMany({
      where: {
        OR: [
          {
            requesterId: userId,
            status: 'accepted',
          },
          {
            addresseeId: userId,
            status: 'accepted',
          },
        ],
      },
      select: {
        requesterId: true,
        addresseeId: true,
      },
    })

    const friendIds = friends.map(friend => friend.requesterId === userId ? friend.addresseeId : friend.requesterId);

    res.status(200).json(friendIds)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred while retrieving friends.' })
  } finally {
    await prisma.$disconnect()
  }
}