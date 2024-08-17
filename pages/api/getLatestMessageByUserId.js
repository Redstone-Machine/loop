// pages/getLatestMessageByUserId.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function getLatestMessageByUserId(req, res) {
  const { userId, recipientId } = req.query;

  try {
    const latestMessage = await prisma.message.findFirst({
      where: {
        OR: [
          {
            senderId: userId,
            recipientId: recipientId,
          },
          {
            recipientId: userId,
            senderId: recipientId,
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('latestMessage found', latestMessage);
    res.json(latestMessage);
  } catch (error) {
    console.error('Error fetching latest message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}