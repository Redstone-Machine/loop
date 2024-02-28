// /pages/api/acceptFriendRequest.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handle(req, res) {
  if (req.method === 'POST') {
    const { requesterId, addresseeId } = req.body

    console.log("requesterId ny: ", requesterId)
    console.log("addresseeId ny: ", addresseeId)
    try {
      // Kontrollera om det finns en matchande post
      const friend = await prisma.friend.findUnique({
        where: {
          requesterId_addresseeId: {
            requesterId: requesterId,
            addresseeId: addresseeId,
          },
        },
      })

      console.log("friend: ", friend)

      if (friend && friend.status === 'pending') {
        // Uppdatera statusen på vänskapsförfrågan till 'accepted'
        const result = await prisma.friend.update({
          where: {
            requesterId_addresseeId: {
              requesterId: requesterId,
              addresseeId: addresseeId,
            },
          },
          data: {
            status: 'accepted',
          },
        })

        res.json(result)
      } else {
        res.status(400).json({ message: 'No pending friend request found.' })
      }
    } catch (error) {
        console.log("error: ", error)
      // Om ett fel uppstår (t.ex. vänskapsförfrågan finns inte), skicka tillbaka ett felmeddelande
      res.status(400).json({ message: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}