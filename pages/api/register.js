// /pages/api/register.js
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default async function handle(req, res) {
  if (req.method === 'POST') {
    const { username, firstname, surname, email, password, language, theme } = req.body

//     // Skapa en ny användare i databasen
//     const user = await prisma.user.create({
//       data: {
//         username: username,
//         password: password, // Kom ihåg att hash lösenordet innan du sparar det!
//       },
//     })

//     res.json(user)
//   } else {
//     res.status(405).json({ message: 'Method not allowed' })
//   }


    try {
        // Hasha lösenordet innan du sparar det i databasen
        const hashedPassword = await bcrypt.hash(password, 10)

        // Skapa en ny användare i databasen
        const user = await prisma.user.create({
        data: {
            userName: username,
            firstName: firstname,
            surName: surname,
            email: email,
            password: hashedPassword,
            language: language,
            theme: theme,
        },
        })

        res.json(user)
    } catch (error) {
        // Om ett fel uppstår (t.ex. användarnamnet redan finns), skicka tillbaka ett felmeddelande
        res.status(400).json({ message: 'Användarnamnet är redan taget' })
    }
    } else {
    res.status(405).json({ message: 'Method not allowed' })
    }

}