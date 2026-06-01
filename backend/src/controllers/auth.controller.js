import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import { generateOtp, sendOtpEmail, verifyOtpCode } from '../utils/otp.js';
import { maskEmail, normalizeEmail } from '../utils/mailer.js';
import { formatPhoneNumber } from '../utils/phone.js';

const prisma = new PrismaClient();

const otpStore = new Map();

const getOtpStoreKey = (email) => normalizeEmail(email);

const OTP_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes

const buildOtpResponse = (deliveryEmail) => ({
    success: true,
    message: 'OTP sent successfully',
    data: {
        deliveryMethod: 'email',
        deliveryTarget: maskEmail(deliveryEmail)
    }
});

const getDeliveryEmail = (res, email, message) => {
    const normalized = normalizeEmail(email);

    if (!normalized) {
        res.status(400).json({ success: false, message });
        return null;
    }

    return normalized;
};

export const userSignup = async (req, res, next) => {
    try {
        const { name, phoneNumber, email, location } = req.body;
        const normalizedPhoneNumber = formatPhoneNumber(phoneNumber);
        const normalizedEmail = getDeliveryEmail(res, email, 'Email is required for user signup verification.');

        if (!normalizedEmail) {
            return;
        }

        const existingUser = await prisma.user.findUnique({
            where: { phoneNumber: normalizedPhoneNumber }
        });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists with this phone number' });
        }

        const otp = generateOtp();
        console.log(`Generated OTP for ${normalizedEmail}: ${otp}`);
        otpStore.set(getOtpStoreKey(normalizedEmail), {
            otp,
            deliveryEmail: normalizedEmail,
            data: { name, phoneNumber: normalizedPhoneNumber, email: normalizedEmail, location },
            type: 'USER_SIGNUP',
            timestamp: Date.now()
        });

        await sendOtpEmail(normalizedEmail, otp);

        res.status(200).json(buildOtpResponse(normalizedEmail));
    } catch (error) {
        next(error);
    }
};

export const userLogin = async (req, res, next) => {
    try {
        const { email } = req.body;
        const normalizedEmail = getDeliveryEmail(res, email, 'A valid email address is required.');

        if (!normalizedEmail) {
            return;
        }

        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const otp = generateOtp();
        console.log(`Generated OTP for ${normalizedEmail}: ${otp}`);
        otpStore.set(getOtpStoreKey(normalizedEmail), {
            otp,
            deliveryEmail: normalizedEmail,
            type: 'USER_LOGIN',
            timestamp: Date.now()
        });

        await sendOtpEmail(normalizedEmail, otp);

        res.status(200).json(buildOtpResponse(normalizedEmail));
    } catch (error) {
        next(error);
    }
};

export const userVerifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const normalizedEmail = normalizeEmail(email);

        const storeData = otpStore.get(getOtpStoreKey(normalizedEmail));
        if (!storeData) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        if (Date.now() - storeData.timestamp > OTP_EXPIRATION_MS) {
            otpStore.delete(getOtpStoreKey(normalizedEmail));
            return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        const isVerified = await verifyOtpCode(otp, storeData.otp);
        if (!isVerified) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        let user;
        if (storeData.type === 'USER_SIGNUP') {
            user = await prisma.user.create({
                data: storeData.data
            });
        } else if (storeData.type === 'USER_LOGIN') {
            user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        }

        otpStore.delete(getOtpStoreKey(normalizedEmail));

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
        const normalizedEmail = getDeliveryEmail(res, email, 'Email is required for captain signup verification.');

        if (!normalizedEmail) {
            return;
        }

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
        console.log(`Generated OTP for ${normalizedEmail}: ${otp}`);
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        otpStore.set(getOtpStoreKey(normalizedEmail), {
            otp,
            deliveryEmail: normalizedEmail,
            data: {
                name,
                phoneNumber: normalizedPhoneNumber,
                email: normalizedEmail,
                password: hashedPassword,
                skills,
                hourlyRate
            },
            type: 'CAPTAIN_SIGNUP',
            timestamp: Date.now()
        });

        await sendOtpEmail(normalizedEmail, otp);

        res.status(200).json(buildOtpResponse(normalizedEmail));
    } catch (error) {
        next(error);
    }
};

export const captainLogin = async (req, res, next) => {
    try {
        const { email } = req.body;
        const normalizedEmail = getDeliveryEmail(res, email, 'A valid email address is required.');

        if (!normalizedEmail) {
            return;
        }

        const captain = await prisma.captain.findUnique({ where: { email: normalizedEmail } });
        if (!captain) {
            return res.status(404).json({ success: false, message: 'Captain not found' });
        }

        const otp = generateOtp();
        console.log(`Generated OTP for ${normalizedEmail}: ${otp}`);
        otpStore.set(getOtpStoreKey(normalizedEmail), {
            otp,
            deliveryEmail: normalizedEmail,
            type: 'CAPTAIN_LOGIN',
            timestamp: Date.now()
        });

        await sendOtpEmail(normalizedEmail, otp);

        res.status(200).json(buildOtpResponse(normalizedEmail));
    } catch (error) {
        next(error);
    }
};

export const captainVerifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const normalizedEmail = normalizeEmail(email);

        const storeData = otpStore.get(getOtpStoreKey(normalizedEmail));
        if (!storeData) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        if (Date.now() - storeData.timestamp > OTP_EXPIRATION_MS) {
            otpStore.delete(getOtpStoreKey(normalizedEmail));
            return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        const isVerified = await verifyOtpCode(otp, storeData.otp);
        if (!isVerified) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        let captain;
        if (storeData.type === 'CAPTAIN_SIGNUP') {
            captain = await prisma.captain.create({
                data: storeData.data
            });
        } else if (storeData.type === 'CAPTAIN_LOGIN') {
            captain = await prisma.captain.findUnique({ where: { email: normalizedEmail } });
        }

        otpStore.delete(getOtpStoreKey(normalizedEmail));

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
        const { email } = req.body;
        const normalizedEmail = normalizeEmail(email);

        if (!normalizedEmail) {
            return res.status(400).json({ success: false, message: 'A valid email address is required.' });
        }

        const storeData = otpStore.get(getOtpStoreKey(normalizedEmail));

        if (!storeData) {
            return res.status(400).json({ success: false, message: 'No active OTP request found for this email' });
        }

        const otp = generateOtp();
        console.log(`Resent OTP for ${normalizedEmail}: ${otp}`);
        storeData.otp = otp;
        storeData.timestamp = Date.now();
        otpStore.set(getOtpStoreKey(normalizedEmail), storeData);

        await sendOtpEmail(normalizedEmail, otp);
        res.status(200).json({
            success: true,
            message: 'OTP resent successfully',
            data: {
                deliveryMethod: 'email',
                deliveryTarget: maskEmail(normalizedEmail)
            }
        });
    } catch (error) {
        next(error);
    }
};

export const forgetPassword = async (req, res, next) => {
    try {
        const { email, type } = req.body;
        const normalizedEmail = normalizeEmail(email);
        const normalizedType = String(type || '').toUpperCase();
        const model = normalizedType === 'USER' ? prisma.user : normalizedType === 'CAPTAIN' ? prisma.captain : null;

        if (!model) {
            return res.status(400).json({ success: false, message: 'Invalid account type' });
        }

        if (!normalizedEmail) {
            return res.status(400).json({ success: false, message: 'A valid email address is required.' });
        }

        const person = await model.findUnique({ where: { email: normalizedEmail } });
        if (!person) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        const otp = generateOtp();
        console.log(`Forget password OTP for ${normalizedEmail}: ${otp}`);
        otpStore.set(getOtpStoreKey(normalizedEmail), {
            otp,
            deliveryEmail: normalizedEmail,
            type: `${normalizedType}_FORGET_PASSWORD`,
            timestamp: Date.now()
        });

        await sendOtpEmail(normalizedEmail, otp);
        res.status(200).json({
            success: true,
            message: 'Verification OTP sent',
            data: {
                deliveryMethod: 'email',
                deliveryTarget: maskEmail(normalizedEmail)
            }
        });
    } catch (error) {
        next(error);
    }
};

export const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const admin = await prisma.admin.findUnique({ where: { email } });

        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

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
