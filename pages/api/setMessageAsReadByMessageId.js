import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const {
        query: { messageId },
    } = req;

    // Uppdatera alla meddelanden som skickats av recipientId till status 'READ'
    await prisma.message.updateMany({
        where: {
            id: messageId,
            status: 'SENT' // Om du bara vill uppdatera meddelanden som är 'SENT'
        },
        data: {
            status: 'READ'
        }
    });

}