// /pages/api/getAllLoopsById.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function getAllLoopsById(req, res) {
    const { userId } = req.query
    console.log('userId in find Loops', userId);
    try {
        const loops = await prisma.loop.findMany({
        where: {
            ownerId: userId,
        },
        })
    
        if (!loops.length) {
        return res.status(404).json({ error: 'Loops not found' })
        }
    
        res.status(200).json(loops)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'An error occurred while retrieving loops.' })
    } finally {
        await prisma.$disconnect()
    }
}