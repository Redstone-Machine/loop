// // app/api/login.js
// import { PrismaClient } from '@prisma/client';
// import nextConnect from 'next-connect';

// const prisma = new PrismaClient();

// const handler = nextConnect();

// handler.post(async (req, res) => {
//   const { username, password } = req.body;

//   const user = await prisma.user.findUnique({
//     where: {
//       username: username,
//     },
//   });

//   if (user && user.password === password) {
//     // Handle successful login
//     res.status(200).json({ success: true });
//   } else {
//     // Handle failed login
//     res.status(401).json({ success: false });
//   }
// });

// export default handler;