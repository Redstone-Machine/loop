// /pages/api/getThreeLatestFriendsByLoopId.js

import { PrismaClient } from '@prisma/client'

import axios from 'axios';

const prisma = new PrismaClient()

export default async function getUsersFromLoopByLoopId(req, res) {
  const { loopId, requesterId } = req.query

  try {
    const loopWithUsers = await prisma.loop.findUnique({
      where: {
        id: loopId
      },
      select: {
        ownerId: true, // Hämta ownerId
        users: {
          select: {
            user: true
          }
        }
      }
    })
    

    if (!loopWithUsers) {
        res.status(404).json({ message: 'Loop not found.' });
        return;
      }


    const ownerId = loopWithUsers.ownerId;

    const friends = await prisma.friend.findMany({
        where: {
          OR: [
            {
              requesterId: ownerId,
              status: 'accepted',
            },
            {
              addresseeId: ownerId,
              status: 'accepted',
            },
          ],
        },
        select: {
          requesterId: true,
          addresseeId: true,
          lastMessageAt: true,
        },
    });


  
      const userIds = loopWithUsers.users.map(userLoop => userLoop.user.id);

      
  
      const users = await Promise.all(
        userIds.map(async (id) => {
          const user = await prisma.user.findUnique({
            where: {
              id: id,
            },
          });
          return user;
        })
      );

    // Lägg till väninformation till varje användare
    const usersWithFriends = users.map(user => {
        const userFriends = friends.filter(friend => 
        friend.requesterId === user.id || friend.addresseeId === user.id
        );
    
        // Hitta den senaste lastMessageAt bland användarens vänner
        const lastMessageAt = userFriends.reduce((latest, friend) => {
        const friendLastMessageAt = new Date(friend.lastMessageAt);
        return friendLastMessageAt > latest ? friendLastMessageAt : latest;
        }, new Date(0)); // Börja med ett mycket gammalt datum
    
        return {
        ...user,
        lastMessageAt: lastMessageAt !== new Date(0) ? lastMessageAt : null, // Om ingen lastMessageAt hittades, sätt till null
        };
    });

    // Kombinera användare och vänner i en enda lista
    const combinedList = [
        ...usersWithFriends,
        // ...friends.map(friend => ({
        // id: friend.requesterId === ownerId ? friend.addresseeId : friend.requesterId,
        // lastMessageAt: friend.lastMessageAt,
        // }))
    ];

    // console.log('combinedList:', combinedList);

    // Sortera den kombinerade listan baserat på lastMessageAt
    const sortedUsers = combinedList.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

    // console.log('sortedUsers:', sortedUsers);
    // Ta de tre senaste användarna
    const latestThreeUsers = sortedUsers.slice(0, 3);

    // Hämta profilbilder för de tre senaste användarna
    const usersWithProfilePictures = await Promise.all(
    latestThreeUsers.map(async (user) => {
      const profilePictureResponse = await axios.get(`http://localhost:3000/api/getProfilePictureById?id=${user.id}&userId=${requesterId}`, {
        responseType: 'arraybuffer',
        });
        const profilePicture = Buffer.from(profilePictureResponse.data, 'binary').toString('base64');

        return {
        ...user,
        profilePicture: `data:image/jpeg;base64,${profilePicture}`,
        };
    })
    );

    res.status(200).json(usersWithProfilePictures);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        await prisma.$disconnect();
    }
}