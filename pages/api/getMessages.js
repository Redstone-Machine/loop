import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const { senderId, recipientId } = req.query;



  const messages = await prisma.message.findMany({
    where: {
      OR: [
        {
          AND: [
            { senderId: senderId },
            { recipientId: recipientId }
          ]
        },
        {
          AND: [
            { senderId: recipientId },
            { recipientId: senderId }
          ]
        }
      ]
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  // Uppdatera alla meddelanden som skickats av recipientId till status 'READ'
  await prisma.message.updateMany({
    where: {
      senderId: recipientId,
      recipientId: senderId,
      status: 'SENT' // Om du bara vill uppdatera meddelanden som är 'SENT'
    },
    data: {
      status: 'READ'
    }
  });

  res.json(messages);
}