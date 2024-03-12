// pages/api/uploadProfilePicture.js

const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const sharp = require('sharp');

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Important for NextJS!
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    // Parse request with formidable
    const form = new formidable.IncomingForm();
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    // Files are always arrays (formidable v3+)
    const file = files.file;

    if (!file || file.length === 0) {
      throw new Error('No file was sent');
    }

    // Get the user id from the fields
    const userId = fields.userId[0];


    // Save file in the public folder
    const newFilePath = saveFile(file, "./public/uploads");

    // Extract the filename from the new file path
    const filename = path.basename(newFilePath);

    // Get the user's current profile picture
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { profilePicture: true },
    });

    // Delete the old profile picture file if it exists
    if (user.profilePicture) {
      const oldFilePath = path.join("../loop_data/profile_pictures", user.profilePicture);
      // console.log("Old file path: ", oldFilePath);
      if (fs.existsSync(oldFilePath)) {
        // console.log("Old profile picture found, deleting...");
        fs.unlinkSync(oldFilePath);
      } else {
        // console.log("Old profile picture not found");
      }
    }


    // Update the user's profile picture
    await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: filename },
    });

    // Return success
    return res.status(201).json({ Message: "Success" });
  } catch (error) {
    console.log("Error occured ", error);
    return res.status(500).json({ error: error.message });
  }
};

function saveFile(file, publicFolder) {
  const fileExt = path.extname(file[0].originalFilename || "").toLowerCase();
  // const filename = Date.now() + fileExt;
  const filename = Date.now() + '.jpg';
  const maxSize = 10 * 1024 * 1024; // 10MB

  // Check if file is a .jpg, .jpeg, .png or .heic
  if (fileExt !== '.jpg' && fileExt !== '.jpeg' && fileExt !== '.png' && fileExt !== '.heic') {
    throw new Error('Only .jpg, .jpeg, .png and .heic files are allowed');
  }

  // Check if file size is less than 10MB
  if (file[0].size > maxSize) {
    throw new Error('File size must be less than 10MB');
  }

  // Move the file to the desired location
  const newFilePath = path.join(publicFolder, '..', '..', '..', 'loop_data', 'profile_pictures', filename);
  fs.renameSync(file[0].filepath, newFilePath);

  // Create a temporary file path for the output
  const tempFilePath = path.join(publicFolder, '..', '..', '..', 'loop_data', 'profile_pictures', `temp_${filename}`);

  // Crop the image to a square and convert to jpg
  sharp(newFilePath)
    .resize(1000, 1000, {
      fit: 'cover',
    })
    .jpeg() // Add this to convert to jpg
    .toFile(tempFilePath, (err) => {
      if (err) {
        throw err;
      }

      // Replace the original file with the new one
      fs.renameSync(tempFilePath, newFilePath);
    });

  // Return the new file path
  return newFilePath;
}