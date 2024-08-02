// pages/api/sendMessageNotification.js
import webPush from 'web-push';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

webPush.setVapidDetails(
  'mailto:minepost@outlook.com',
  vapidPublicKey,
  vapidPrivateKey
);

export default async (req, res) => {
  if (req.method === 'POST') {
    const { userId, message, title } = req.body;

    try {
      // Hämta prenumerationer för den angivna användaren
      const subscriptions = await prisma.pushSubscription.findMany({
        where: { userId },
      });

      const notificationPayload = JSON.stringify({
        title: title || 'Meddelande',
        body: message,
      });

      await Promise.all(subscriptions.map(async (subscription) => {
        const { endpoint, auth, p256dh } = subscription;
        const pushSubscription = {
          endpoint,
          keys: {
            auth,
            p256dh
          }
        };

        try {
          await webPush.sendNotification(pushSubscription, notificationPayload);
        } catch (error) {
          console.error(`Error sending notification to ${endpoint}:`, error);
          if (error.statusCode === 410) {
            // Om prenumerationen har gått ut, ta bort den
            await prisma.pushSubscription.delete({
              where: { endpoint },
            });
            console.log(`Prenumerationen ${endpoint} har gått ut och har tagits bort.`);
          }
        }
      }));

      res.status(200).json({ message: 'Notis skickad.' });
    } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).json({ message: 'Misslyckades att skicka notis.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
