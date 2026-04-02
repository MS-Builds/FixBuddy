import { normalizeEmail, sendOtpEmail as sendOtpEmailMessage } from './mailer.js';

export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOtpEmail = async (email, otp) => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
        throw new Error('A valid email address is required to send an OTP.');
    }

    await sendOtpEmailMessage({ to: normalizedEmail, otp });
    console.log(`[OTP] Verification initiated for ${normalizedEmail}`);
    return true;
};

export const verifyOtpCode = async (receivedOtp, storedOtp) => {
    return receivedOtp === storedOtp;
};
