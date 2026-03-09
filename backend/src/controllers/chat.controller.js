import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMessages = async (req, res, next) => {
    try {
        const { serviceRequestId } = req.params;
        const messages = await prisma.message.findMany({
            where: { serviceRequestId },
            orderBy: { createdAt: 'asc' }
        });
        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        next(error);
    }
};

export const sendMessage = async (req, res, next) => {
    try {
        const { id: senderId } = req.user;
        const { serviceRequestId, receiverId, text } = req.body;

        const message = await prisma.message.create({
            data: {
                text,
                senderId,
                receiverId,
                serviceRequest: { connect: { id: serviceRequestId } }
            }
        });

        res.status(201).json({ success: true, data: message });
    } catch (error) {
        next(error);
    }
};
