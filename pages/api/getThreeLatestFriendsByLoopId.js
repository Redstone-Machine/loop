// /pages/api/getThreeLatestFriendsByLoopId.js

import { PrismaClient } from '@prisma/client'

import axios from 'axios';

const prisma = new PrismaClient()

export default async function getUsersFromLoopByLoopId(req, res) {
  const { loopId } = req.query

  try {
    const loopWithUsers = await prisma.loop.findUnique({
      where: {
        id: loopId
      },
      include: {
        users: {
          include: {
            user: true
          }
        }
      }
    })

    if (!loopWithUsers) {
        res.status(404).json({ message: 'Loop not found.' });
        return;
      }
  
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

    // Sortera användarna baserat på lastMessageAt
    const sortedUsers = users.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

    // Ta de tre senaste användarna
    const latestThreeUsers = sortedUsers.slice(0, 3);

    // Hämta profilbilder för de tre senaste användarna
    const usersWithProfilePictures = await Promise.all(
    latestThreeUsers.map(async (user) => {
        const profilePictureResponse = await axios.get(`http://localhost:3000/api/getProfilePictureById?id=${user.id}`, {
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