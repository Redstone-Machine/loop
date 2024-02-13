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

  res.json(messages);
}