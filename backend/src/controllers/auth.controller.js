import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import { generateOtp, sendOtpSms } from '../utils/otp.js';

const prisma = new PrismaClient();

// In-memory OTP store for simplicity. In production, use Redis or Database with expiration.
const otpStore = new Map();

export const userSignup = async (req, res, next) => {
    try {
        const { name, phoneNumber, email, location } = req.body;
        
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { phoneNumber }
        });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists with this phone number' });
        }

        const otp = generateOtp();
        otpStore.set(phoneNumber, { otp, data: { name, phoneNumber, email, location }, type: 'USER_SIGNUP', timestamp: Date.now() });
        
        await sendOtpSms(phoneNumber, otp);

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        next(error);
    }
};

export const userLogin = async (req, res, next) => {
    try {
        const { phoneNumber } = req.body;
        
        const user = await prisma.user.findUnique({ where: { phoneNumber } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const otp = generateOtp();
        otpStore.set(phoneNumber, { otp, type: 'USER_LOGIN', timestamp: Date.now() });
        
        await sendOtpSms(phoneNumber, otp);

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        next(error);
    }
};

export const userVerifyOtp = async (req, res, next) => {
    try {
        const { phoneNumber, otp } = req.body;
        
        const storeData = otpStore.get(phoneNumber);
        if (!storeData || storeData.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        let user;
        if (storeData.type === 'USER_SIGNUP') {
            user = await prisma.user.create({
                data: storeData.data
            });
        } else if (storeData.type === 'USER_LOGIN') {
            user = await prisma.user.findUnique({ where: { phoneNumber } });
        }

        // Clear OTP
        otpStore.delete(phoneNumber);

        const token = generateToken({ id: user.id, role: 'USER' });

        res.status(200).json({
            success: true,
            message: 'Authentication successful',
            data: { user, token }
        });
    } catch (error) {
        next(error);
    }
};

export const captainSignup = async (req, res, next) => {
    try {
        let { name, phoneNumber, email, password, skills, hourlyRate } = req.body;
        
        if (skills && typeof skills === 'string') {
            skills = skills.split(',').map(s => s.trim());
        } else if (!skills) {
            skills = [];
        }
        
        const existingCaptain = await prisma.captain.findUnique({
            where: { phoneNumber }
        });

        if (existingCaptain) {
            return res.status(400).json({ success: false, message: 'Captain already exists with this phone number' });
        }

        const otp = generateOtp();
        let hashedPassword = null;
        if (password) {
             hashedPassword = await bcrypt.hash(password, 10);
        }

        otpStore.set(phoneNumber, { 
            otp, 
            data: { name, phoneNumber, email, password: hashedPassword, skills, hourlyRate }, 
            type: 'CAPTAIN_SIGNUP',
            timestamp: Date.now()
        });
        
        await sendOtpSms(phoneNumber, otp);

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        next(error);
    }
};

export const captainLogin = async (req, res, next) => {
    try {
        const { phoneNumber } = req.body;
        
        const captain = await prisma.captain.findUnique({ where: { phoneNumber } });
        if (!captain) {
            return res.status(404).json({ success: false, message: 'Captain not found' });
        }

        const otp = generateOtp();
        otpStore.set(phoneNumber, { otp, type: 'CAPTAIN_LOGIN', timestamp: Date.now() });
        
        await sendOtpSms(phoneNumber, otp);

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        next(error);
    }
};

export const captainVerifyOtp = async (req, res, next) => {
    try {
        const { phoneNumber, otp } = req.body;
        
        const storeData = otpStore.get(phoneNumber);
        if (!storeData || storeData.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        let captain;
        if (storeData.type === 'CAPTAIN_SIGNUP') {
            captain = await prisma.captain.create({
                data: storeData.data
            });
        } else if (storeData.type === 'CAPTAIN_LOGIN') {
            captain = await prisma.captain.findUnique({ where: { phoneNumber } });
        }

        otpStore.delete(phoneNumber);

        const token = generateToken({ id: captain.id, role: 'CAPTAIN' });

        res.status(200).json({
            success: true,
            message: 'Authentication successful',
            data: { captain, token }
        });
    } catch (error) {
        next(error);
    }
};

export const resendOtp = async (req, res, next) => {
    try {
        const { phoneNumber } = req.body;
        const storeData = otpStore.get(phoneNumber);
        
        if (!storeData) {
            return res.status(400).json({ success: false, message: 'No active request found for this number' });
        }

        const otp = generateOtp();
        storeData.otp = otp;
        storeData.timestamp = Date.now();
        otpStore.set(phoneNumber, storeData);

        await sendOtpSms(phoneNumber, otp);
        res.status(200).json({ success: true, message: 'OTP resent successfully' });
    } catch (error) {
        next(error);
    }
};

export const forgetPassword = async (req, res, next) => {
    try {
        const { phoneNumber, type } = req.body; // type: 'USER' | 'CAPTAIN'
        let model = type === 'USER' ? prisma.user : prisma.captain;

        const person = await model.findUnique({ where: { phoneNumber } });
        if (!person) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        const otp = generateOtp();
        otpStore.set(phoneNumber, { otp, type: `${type}_FORGET_PASSWORD`, timestamp: Date.now() });
        
        await sendOtpSms(phoneNumber, otp);
        res.status(200).json({ success: true, message: 'Verification OTP sent' });
    } catch (error) {
        next(error);
    }
};

export const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Simple admin check (In production, hash password and verify properly)
        const admin = await prisma.admin.findUnique({ where: { email } });
        
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // If we're seeding an admin, it's best to bcrypt.compare. For now mock a simple check.
        const isMatch = password === admin.password || await bcrypt.compare(password, admin.password);

        if (!isMatch) {
             return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken({ id: admin.id, role: 'ADMIN' });

        res.status(200).json({
            success: true,
            message: 'Admin login successful',
            data: { admin: { id: admin.id, email: admin.email }, token }
        });

    } catch (error) {
        next(error);
    }
};
