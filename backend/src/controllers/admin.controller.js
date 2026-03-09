import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            include: { _count: { select: { serviceRequests: true } } }
        });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

export const getAllCaptains = async (req, res, next) => {
    try {
        const captains = await prisma.captain.findMany({
            include: { 
                _count: { select: { serviceRequests: true, reviews: true } } 
            }
        });
        res.status(200).json({ success: true, data: captains });
    } catch (error) {
        next(error);
    }
};

export const verifyCaptain = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isVerified } = req.body;

        const updatedCaptain = await prisma.captain.update({
            where: { id },
            data: { isVerified }
        });

        res.status(200).json({ success: true, data: updatedCaptain });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Note: Prisma will handle deletion based on referential actions (cascade) 
        // if configured in schema. If not, we might need manual cleanup.
        await prisma.user.delete({
            where: { id }
        });

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const getAllServiceRequests = async (req, res, next) => {
    try {
        const requests = await prisma.serviceRequest.findMany({
            include: {
                user: { select: { name: true, phoneNumber: true } },
                captain: { select: { name: true, phoneNumber: true } }
            }
        });
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        next(error);
    }
};
