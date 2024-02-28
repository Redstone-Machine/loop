// /pages/api/createLoop.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handle(req, res) {
  if (req.method === 'POST') {
    const { name, color, friends, ownerId } = req.body

    console.log('name in api: ', name)
    console.log('color in api: ', color)
    console.log('friends in api: ', friends)
    console.log('ownerId in api: ', ownerId)

    try {
        // Skapa en ny Loop
        const loop = await prisma.loop.create({
        data: {
            name: name,
            color: color,
            ownerId: ownerId,
        },
        })

        // Skapa UserLoop poster för varje vän
        await Promise.all(friends.map(friendId => {
        return prisma.userLoop.create({
            data: {
            userId: friendId,
            loopId: loop.id,
            },
        })
        }))

        // Returnera den skapade loopen
        res.json(loop)

    } catch (error) {
      // Om ett fel uppstår (t.ex. Loopen redan finns), skicka tillbaka ett felmeddelande
      console.error(error)
      res.status(400).json({ message: 'Loopnamnet är redan taget' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}