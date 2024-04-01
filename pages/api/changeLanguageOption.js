// /pages/api/changeLanguageOption.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handle(req, res) {
  if (req.method === 'POST') {
    const { userId, newLanguage } = req.body

    console.log("userId ny: ", userId)
    console.log("newLanguage ny: ", newLanguage)

    try {
      // Kontrollera om det finns en matchande post
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      console.log("user change language: ", user)

      if (user.language != newLanguage) {
        // Uppdatera statusen på vänskapsförfrågan till 'accepted'
        const result = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            language: newLanguage,
          },
        })

        res.json(result)
      } else {
        res.status(200).json({ message: 'Nothing to change' })
      }
    } catch (error) {
        console.log("error: ", error)
      res.status(400).json({ message: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}