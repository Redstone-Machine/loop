// pages/api/sendMessageNotification.js
import webPush from 'web-push';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

const baseUrl = 'http://localhost:3000';

webPush.setVapidDetails(
  'mailto:minepost@outlook.com',
  vapidPublicKey,
  vapidPrivateKey
);

export default async (req, res) => {
  if (req.method === 'POST') {
    const { userId, message, title, chatId } = req.body;

    try {
      // Hämta prenumerationer för den angivna användaren
      const subscriptions = await prisma.pushSubscription.findMany({
        where: { userId },
      });

      // console.log('Den här titeln kommer visas på notisen:', title);

      // console.log('chatId:', chatId);

      fetch(`${baseUrl}/icon_72.png`)
        .then(response => {
          if (response.ok) {
            console.log('icon_72.png is accessible');
          } else {
            console.error('icon_72.png is not accessible');
          }
        })
        .catch(error => console.error('Error fetching icon_72.png:', error));

      fetch(`${baseUrl}/Icon_512.png`)
        .then(response => {
          if (response.ok) {
            console.log('Icon_512.png is accessible');
          } else {
            console.error('Icon_512.png is not accessible');
          }
        })
        .catch(error => console.error('Error fetching Icon_512.png:', error));

      // Hämta profilbilden för användaren
      const profilePictureResponse = await fetch(`${baseUrl}/api/getProfilePictureById?id=${userId}`);
      let profilePictureUrl = `${baseUrl}/public/standard_profile_picture.jpg`; // Standardbild om profilbilden inte hittas

      if (profilePictureResponse.ok) {
        const profilePictureData = await profilePictureResponse.json();
        profilePictureUrl = profilePictureData.url;
      }
      
      

      const notificationPayload = JSON.stringify({
        title: title || 'Meddelande',
        body: message,
        icon: profilePictureUrl,
        badge: `${baseUrl}/icon_72.png`,

        // icon: `${baseUrl}/Icon_512.png`,
        data: {
          chatId: chatId
        }
      });

      console.log('Notification Payload:', notificationPayload);


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
