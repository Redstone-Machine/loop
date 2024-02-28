// /pages/api/getUsersFromLoopById.js

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function getUsersFromLoopByLoopId(req, res) {
  const { loopId } = req.query

  try {
    const loopWithUsers = await prisma.loop.findUnique({
      where: {
        id: loopId
      },
      include: {
        users: {
          include: {
            user: true
          }
        }
      }
    })

    const userIds = loopWithUsers.users.map(userLoop => userLoop.user.id);

    res.status(200).json(userIds);

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred while retrieving users from the loop.' })
  } finally {
    await prisma.$disconnect()
  }
}