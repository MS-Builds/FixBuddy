import { formatPhoneNumber, sendOtpMessage, verifyOTP } from './sms.js';

// Mock OTP generation (Only used for legacy Programmable SMS)
export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Sends an OTP. If TWILIO_VERIFY_SERVICE_SID is present, uses Twilio Verify.
 * Otherwise falls back to Programmable SMS (requires a valid Twilio 'From' number).
 */
export const sendOtpSms = async (phoneNumber, otp) => {
    try {
        const normalizedPhoneNumber = formatPhoneNumber(phoneNumber);
        await sendOtpMessage(normalizedPhoneNumber, otp);
        console.log(`[OTP] Verification initiated for ${normalizedPhoneNumber}`);
        return true;
    } catch (error) {
        console.error(`Error logging OTP for ${phoneNumber}: ${error.message}`);
        return false;
    }
};

/**
 * Verifies an OTP. If TWILIO_VERIFY_SERVICE_SID is present, checks with Twilio.
 * Otherwise performs a manual comparison.
 */
export const verifyOtpCode = async (phoneNumber, receivedOtp, storedOtp) => {
    const normalizedPhoneNumber = formatPhoneNumber(phoneNumber);

    if (process.env.TWILIO_VERIFY_SERVICE_SID) {
        const result = await verifyOTP(normalizedPhoneNumber, receivedOtp);
        return result.success;
    }

    return receivedOtp === storedOtp;
};
