// pages/api/getCurrentProfilePictureById.js

import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

export default async function handle(req, res) {
  const { id } = req.query;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { profilePicture: true },
  });

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const filePath = path.resolve("../loop_data/profile_pictures", user.profilePicture);
  const file = await readFile(filePath);
  res.setHeader('Content-Type', 'image/jpeg'); // Set the correct content type
  res.send(file);
}