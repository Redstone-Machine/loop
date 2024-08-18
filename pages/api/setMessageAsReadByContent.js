import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const {
        query: { messageUserId, messageRecipientId, messageContent },
        
    } = req;

    console.log('uppdaterar messageId till read', messageContent);

    // Uppdatera alla meddelanden som skickats av recipientId till status 'READ'
    await prisma.message.updateMany({
        where: {
            senderId: messageUserId,
            recipientId: messageRecipientId,
            content: messageContent,
            status: 'SENT' // Om du bara vill uppdatera meddelanden som är 'SENT'
        },
        data: {
            status: 'READ'
        }
    });

    console.log('uppdaterat messageId till read', messageContent);

}