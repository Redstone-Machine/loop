import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function getUserLanguageById(req, res) {
  const { id } = req.query;
  console.log('Received id:', id);
  prisma.user.findUnique({
    where: {
      id: id,
    },
  })
  .then(user => {
    console.log('User from database:', user);
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }
    console.log('User language i api:', user.language);
    res.status(200).json(user.language);
  })
  .catch(error => {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error.' });
  });
}