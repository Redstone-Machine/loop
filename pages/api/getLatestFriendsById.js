// /pages/api/getLatestFriendsById.js

import { PrismaClient } from '@prisma/client'
import axios from 'axios';

const prisma = new PrismaClient()

export default async function getFriendsRequests(req, res) {
  const { userId } = req.query 

  console.log('userId in getLatestFriend', userId);
  try {
    const friends = await prisma.friend.findMany({
      where: {
        OR: [
          {
            requesterId: userId,
            status: 'accepted',
          },
          {
            addresseeId: userId,
            status: 'accepted',
          },
        ],
      },
      select: {
        requesterId: true,
        addresseeId: true,
        lastMessageAt: true,
      },
    })

    console.log('friends latest:', friends);

    // Sortera listan manuellt efter lastMessageAt
    const sortedFriends = friends.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

    const friendIds = sortedFriends.map(friend => ({
      id: friend.requesterId === userId ? friend.addresseeId : friend.requesterId,
      lastMessageAt: friend.lastMessageAt,
    }));

    console.log('friendIds:', friendIds);

    // Hämta all information om användarna baserat på friendIds
    const userIds = friendIds.map(friend => friend.id);
    const users = await prisma.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
        select: {
          id: true,
          userName: true,
          firstName: true,
          surName: true,
        },
      });
          // Hämta profilbilder och senaste meddelanden för varje användare
    const friendsWithUserInfo = await Promise.all(friendIds.map(async friend => {
        const user = users.find(user => user.id === friend.id);
        const profilePictureResponse = await axios.get(`http://localhost:3000/api/getProfilePictureById?id=${friend.id}`, {
          responseType: 'arraybuffer',
        });
        const profilePicture = Buffer.from(profilePictureResponse.data, 'binary').toString('base64');

        // Hämta senaste meddelandet
        const latestMessage = await prisma.message.findFirst({
            where: {
              OR: [
                {
                  senderId: userId,
                  recipientId: friend.id,
                },
                {
                  recipientId: userId,
                  senderId: friend.id,
                },
              ],
            },
            orderBy: {
              createdAt: 'desc',
            },
            select: {
              content: true,
            },
          });

        console.log('latestMessage:', latestMessage);
  
        return {
          ...friend,
          user: {
            ...user,
            profilePicture: `data:image/jpeg;base64,${profilePicture}`,
          },
          latestMessage: latestMessage ? latestMessage.content : null,
        };
      }));

    console.log('friendsWithUserInfo:', friendsWithUserInfo);

        // console.log('friendsWithUserInfo:', friendsWithUserInfo);
        // console.log('friendsWithUserInfo:', friendsWithUserInfo.);


    res.status(200).json(friendsWithUserInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving friends.' });
  } finally {
    await prisma.$disconnect();
  }
}