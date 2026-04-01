import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import { generateOtp, sendOtpSms, verifyOtpCode } from '../utils/otp.js';
import { formatPhoneNumber } from '../utils/sms.js';

const prisma = new PrismaClient();

// In-memory OTP store for simplicity. In production, use Redis or Database with expiration.
const otpStore = new Map();

const getOtpStoreKey = (phoneNumber) => formatPhoneNumber(phoneNumber);

export const userSignup = async (req, res, next) => {
    try {
        const { name, phoneNumber, email, location } = req.body;
        const normalizedPhoneNumber = formatPhoneNumber(phoneNumber);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { phoneNumber: normalizedPhoneNumber }
        });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists with this phone number' });
        }

        const otp = generateOtp();
        console.log(`Generated OTP for ${normalizedPhoneNumber}: ${otp}`);
        otpStore.set(getOtpStoreKey(normalizedPhoneNumber), {
            otp,
            data: { name, phoneNumber: normalizedPhoneNumber, email, location },
            type: 'USER_SIGNUP',
            timestamp: Date.now()
        });

        await sendOtpSms(normalizedPhoneNumber, otp);

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        next(error);
    }
};

export const userLogin = async (req, res, next) => {
    try {
        const { phoneNumber } = req.body;
        const normalizedPhoneNumber = formatPhoneNumber(phoneNumber);

        const user = await prisma.user.findUnique({ where: { phoneNumber: normalizedPhoneNumber } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const otp = generateOtp();
        console.log(`Generated OTP for ${normalizedPhoneNumber}: ${otp}`);
        otpStore.set(getOtpStoreKey(normalizedPhoneNumber), { otp, type: 'USER_LOGIN', timestamp: Date.now() });

        await sendOtpSms(normalizedPhoneNumber, otp);

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        next(error);
    }
};

export const userVerifyOtp = async (req, res, next) => {
    try {
        const { phoneNumber, otp } = req.body;
        const normalizedPhoneNumber = formatPhoneNumber(phoneNumber);

        const storeData = otpStore.get(getOtpStoreKey(normalizedPhoneNumber));
        if (!storeData) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        const isVerified = await verifyOtpCode(normalizedPhoneNumber, otp, storeData.otp);
        if (!isVerified) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        let user;
        if (storeData.type === 'USER_SIGNUP') {
            user = await prisma.user.create({
                data: storeData.data
            });
        } else if (storeData.type === 'USER_LOGIN') {
            user = await prisma.user.findUnique({ where: { phoneNumber: normalizedPhoneNumber } });
        }

        // Clear OTP
        otpStore.delete(getOtpStoreKey(normalizedPhoneNumber));

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
        const normalizedPhoneNumber = formatPhoneNumber(phoneNumber);

        if (skills && typeof skills === 'string') {
            skills = skills.split(',').map(s => s.trim());
        } else if (!skills) {
            skills = [];
        }

        const existingCaptain = await prisma.captain.findUnique({
            where: { phoneNumber: normalizedPhoneNumber }
        });

        if (existingCaptain) {
            return res.status(400).json({ success: false, message: 'Captain already exists with this phone number' });
        }

        const otp = generateOtp();
        console.log(`Generated OTP for ${normalizedPhoneNumber}: ${otp}`);
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        otpStore.set(getOtpStoreKey(normalizedPhoneNumber), {
            otp,
            data: { name, phoneNumber: normalizedPhoneNumber, email, password: hashedPassword, skills, hourlyRate },
            type: 'CAPTAIN_SIGNUP',
            timestamp: Date.now()
        });

        await sendOtpSms(normalizedPhoneNumber, otp);

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        next(error);
    }
};

export const captainLogin = async (req, res, next) => {
    try {
        const { phoneNumber } = req.body;
        const normalizedPhoneNumber = formatPhoneNumber(phoneNumber);

        const captain = await prisma.captain.findUnique({ where: { phoneNumber: normalizedPhoneNumber } });
        if (!captain) {
            return res.status(404).json({ success: false, message: 'Captain not found' });
        }

        const otp = generateOtp();
        console.log(`Generated OTP for ${normalizedPhoneNumber}: ${otp}`);
        otpStore.set(getOtpStoreKey(normalizedPhoneNumber), { otp, type: 'CAPTAIN_LOGIN', timestamp: Date.now() });

        await sendOtpSms(normalizedPhoneNumber, otp);

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        next(error);
    }
};

export const captainVerifyOtp = async (req, res, next) => {
    try {
        const { phoneNumber, otp } = req.body;
        const normalizedPhoneNumber = formatPhoneNumber(phoneNumber);

        const storeData = otpStore.get(getOtpStoreKey(normalizedPhoneNumber));
        if (!storeData) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        const isVerified = await verifyOtpCode(normalizedPhoneNumber, otp, storeData.otp);
        if (!isVerified) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        let captain;
        if (storeData.type === 'CAPTAIN_SIGNUP') {
            captain = await prisma.captain.create({
                data: storeData.data
            });
        } else if (storeData.type === 'CAPTAIN_LOGIN') {
            captain = await prisma.captain.findUnique({ where: { phoneNumber: normalizedPhoneNumber } });
        }

        otpStore.delete(getOtpStoreKey(normalizedPhoneNumber));

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
        const normalizedPhoneNumber = formatPhoneNumber(phoneNumber);
        const storeData = otpStore.get(getOtpStoreKey(normalizedPhoneNumber));

        if (!storeData) {
            return res.status(400).json({ success: false, message: 'No active request found for this number' });
        }

        const otp = generateOtp();
        console.log(`Resent OTP for ${normalizedPhoneNumber}: ${otp}`);
        storeData.otp = otp;
        storeData.timestamp = Date.now();
        otpStore.set(getOtpStoreKey(normalizedPhoneNumber), storeData);

        await sendOtpSms(normalizedPhoneNumber, otp);
        res.status(200).json({ success: true, message: 'OTP resent successfully' });
    } catch (error) {
        next(error);
    }
};

export const forgetPassword = async (req, res, next) => {
    try {
        const { phoneNumber, type } = req.body; // type: 'USER' | 'CAPTAIN'
        const normalizedPhoneNumber = formatPhoneNumber(phoneNumber);
        let model = type === 'USER' ? prisma.user : prisma.captain;

        const person = await model.findUnique({ where: { phoneNumber: normalizedPhoneNumber } });
        if (!person) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        const otp = generateOtp();
        console.log(`Forget password OTP for ${normalizedPhoneNumber}: ${otp}`);
        otpStore.set(getOtpStoreKey(normalizedPhoneNumber), { otp, type: `${type}_FORGET_PASSWORD`, timestamp: Date.now() });

        await sendOtpSms(normalizedPhoneNumber, otp);
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
