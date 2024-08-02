// pages/api/save-subscription.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === 'POST') {
    const { endpoint, keys: { auth, p256dh }, userId } = req.body;

    try {
      // Spara prenumerationen i databasen med userId
      await prisma.pushSubscription.create({
        data: {
          endpoint,
          auth,
          p256dh,
          userId,
        },
      });
      res.status(201).json({ message: 'Prenumeration mottagen och sparad i databasen.' });
    } catch (error) {
      console.error('Error saving subscription:', error);
      res.status(500).json({ message: 'Kunde inte spara prenumerationen.', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
