// /pages/api/addFriend.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handle(req, res) {
  if (req.method === 'POST') {
    const { requesterId, addresseeId } = req.body

    try {
      // Kontrollera om det redan finns en vänskapsförfrågan där den andra personen är begäraren
      const existingFriendship = await prisma.friend.findUnique({
        where: {
          requesterId_addresseeId: {
            requesterId: addresseeId,
            addresseeId: requesterId,
          },
        },
      })

      if (existingFriendship) {
        res.status(400).json({ message: 'A friend request already exists with the other person as the requester.' })
      } else {
        // Skapa en ny användare i databasen
        const result = await prisma.friend.create({
          data: {
            requesterId: requesterId,
            addresseeId: addresseeId,
            status: 'pending',
          },
        })

        res.json(result)
      }
    } catch (error) {
      // Om ett fel uppstår (t.ex. användarnamnet redan finns), skicka tillbaka ett felmeddelande
      res.status(400).json({ message: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}