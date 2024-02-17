import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default async function getUserUsernameById(req, res) {
  const { id } = req.query;
  prisma.user.findUnique({
    where: {
      id: id,
    },
  })
  .then(user => {
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }
    res.status(200).json(user.userName);
  })
  .catch(error => {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error.' });
  });
}