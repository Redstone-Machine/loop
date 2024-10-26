// pages/api/getProfilePictureById.js

import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

import fs from 'fs';
import { promisify } from 'util';
import { profile } from 'console';

const readFile = promisify(fs.readFile);

export default async function handle(req, res) {
  const { id, userId } = req.query;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { profilePicture: true },
  });

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if (user.profilePicture && userId ) {
    console.log('userId i hämta:', userId);
    console.log('id i hämta:', id);
    const profile = await prisma.personalProfilePicture.findFirst({
      where: { userId: userId, userIdOfProfilePicture: id },
      select: { profilePictureUrl: true },
    });
    console.log('profile:', profile);
    if (profile) {
      user.profilePicture = profile.profilePictureUrl;
    }
  }

  // const filePath = path.resolve("../loop_data/profile_pictures", user.profilePicture);
  // const file = await readFile(filePath);
  // res.setHeader('Content-Type', 'image/jpeg'); // Set the correct content type
  // res.send(file);
  let filePath;
  if (user.profilePicture) {
    filePath = path.resolve("../loop_data/profile_pictures", user.profilePicture);
  } else {
    filePath = path.resolve("public/standard_profile_picture.jpg");
  }

  const file = await readFile(filePath);
  res.setHeader('Content-Type', 'image/jpeg'); // Set the correct content type
  res.send(file);
}