// pages/api/createMessage.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default async (req, res) => {

    // console.log("test")
    if (req.method === 'POST') {
      const { content, userId, recipientId } = req.body;
  
      // console.log("test2")
      if (!content || !userId || !recipientId) {
        return res.status(400).json({ error: 'Content, userId, and recipientId are required' });
      }
  
      try {
        console.log({
          data: {
            content: req.body.content,
            userId: req.body.userId,
            recipientId: req.body.recipientId,
          },
        });

        const newMessage = await prisma.message.create({
          data: {
            content,
            senderId: userId,
            recipientId,
            createdAt: new Date(),
          },
        });

        // Uppdatera lastMessageAt i Friend-modellen
        await prisma.friend.updateMany({
          where: {
            OR: [
              { requesterId: userId, addresseeId: recipientId },
              { requesterId: recipientId, addresseeId: userId },
            ],
          },
          data: {
            lastMessageAt: new Date(),
          },
        });
  
        return res.status(200).json(newMessage);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while creating the message', details: error.message });
      }
    }
    return res.status(405).json({ error: 'Method not allowed' });
  };