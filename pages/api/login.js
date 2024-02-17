// import nextConnect from 'next-connect';

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// const handler = nextConnect();

// handler.post(async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         username: username,
//       },
//     });

//     if (!user) {
//       res.status(401).json({ success: false, message: 'No such user found' });
//       return;
//     }

//     // Here, you would check the password. This depends on how you are storing passwords.
//     // If you are storing hashed passwords, you would hash the provided password and compare it to the stored hash.
//     // If the passwords match, you would start a session and send a success response.
//     // If they do not match, you would send an error response.

//     if (password === user.password) { // replace this with your actual password checking logic
//       res.json({ success: true });
//     } else {
//       res.status(401).json({ success: false, message: 'Incorrect password' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

// export default handler;