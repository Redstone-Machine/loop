// pages/api/send-notification.js
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
    const { userId, message } = req.body;

    try {
      const subscriptions = await prisma.pushSubscription.findMany({
        where: { userId },
      });

      const notificationPayload = JSON.stringify({
        title: 'Notis',
        body: message,
      });

      await Promise.all(subscriptions.map(subscription => {
        const { endpoint, auth, p256dh } = subscription;
        const pushSubscription = {
          endpoint,
          keys: {
            auth,
            p256dh
          }
        };
        return webPush.sendNotification(pushSubscription, notificationPayload);
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
