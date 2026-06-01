import { verifyToken } from '../utils/jwt.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const authMiddleware = (role = null) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ success: false, message: 'No token provided' });
            }

            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token);

            if (role && decoded.role !== role) {
                return res.status(403).json({ success: false, message: 'Forbidden' });
            }

            // Attach user data to request object
            req.user = decoded;
            
            // Optionally fetch full user/captain/admin details from DB
            if (decoded.role === 'USER') {
                req.dbUser = await prisma.user.findUnique({ where: { id: decoded.id } });
            } else if (decoded.role === 'CAPTAIN') {
                req.dbCaptain = await prisma.captain.findUnique({ where: { id: decoded.id } });
            } else if (decoded.role === 'ADMIN') {
                req.dbAdmin = await prisma.admin.findUnique({ where: { id: decoded.id } });
            }

            if (!req.dbUser && !req.dbCaptain && !req.dbAdmin) {
                 return res.status(401).json({ success: false, message: 'Invalid token: User not found' });
            }

            next();
        } catch (error) {
            console.error('Auth Error:', error);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, message: 'Token expired' });
            }
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
    };
};

export default authMiddleware;
