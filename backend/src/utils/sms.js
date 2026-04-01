import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

/**
 * Formats a phone number to E.164 standard (e.g., +919741624929).
 * Defaults to +91 if country code is missing and number is 10 digits.
 * @param {string} phone - The raw phone number string
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
    if (!phone) return phone;

    const normalizedPhone = String(phone).trim();
    const cleaned = normalizedPhone.replace(/\D/g, '');

    // If it starts with 00, treat as international (e.g., 0091 -> +91...)
    if (normalizedPhone.startsWith('00')) {
        return `+${cleaned}`;
    }

    // Already has a + prefix — just clean and return (no spaces)
    if (normalizedPhone.startsWith('+')) {
        return `+${cleaned}`;
    }

    // 10 digits -> assume India, prepend +91
    if (cleaned.length === 10) {
        return `+91${cleaned}`;
    }

    // 12 digits starting with 91 -> already has country code
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
        return `+${cleaned}`;
    }

    // Fallback
    return cleaned.length > 5 ? `+${cleaned}` : `+91${cleaned}`;
};

const hasSmsCredentials = () => {
    if (!accountSid || !authToken || !fromPhoneNumber) {
        console.warn('[TWILIO] Missing SMS credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_PHONE_NUMBER).');
        return false;
    }

    return true;
};

const hasVerifyCredentials = () => {
    if (!accountSid || !authToken || !verifyServiceSid) {
        console.warn('[TWILIO] Missing Verify credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_VERIFY_SERVICE_SID).');
        return false;
    }

    return true;
};

/**
 * Send a raw SMS message using Twilio Programmable SMS.
 * Note: For OTPs, prefer sendOTP() using Twilio Verify instead.
 * Make sure your Twilio number supports SMS in the recipient's country.
 *
 * @param {string} to - The recipient phone number (will be auto-formatted)
 * @param {string} body - The message body
 * @returns {object|null} - Twilio message object or null on failure
 */
export const sendSMS = async (to, body) => {
    const formattedTo = formatPhoneNumber(to);

    try {
        if (!hasSmsCredentials()) {
            console.log(`[DEV] To: ${formattedTo}, Message: ${body}`);
            return null;
        }

        const message = await client.messages.create({
            body,
            from: fromPhoneNumber,
            to: formattedTo,
        });

        console.log(`[TWILIO] SMS sent to ${formattedTo} | SID: ${message.sid}`);
        return message;
    } catch (error) {
        console.error(`[TWILIO] Failed to send SMS to ${formattedTo}. Error: ${error.message}`);
        throw error;
    }
};

/**
 * Send an OTP using Twilio Verify Service.
 * This is the recommended approach for OTP delivery — handles
 * country routing, retries, and rate limiting automatically.
 *
 * Setup:
 *  1. Go to Twilio Console → Verify → Services → Create Service
 *  2. Copy the Service SID into your .env as TWILIO_VERIFY_SERVICE_SID
 *
 * @param {string} to - The recipient phone number
 * @param {'sms'|'call'|'email'|'whatsapp'} channel - Delivery channel (default: 'sms')
 * @returns {object|null} - Twilio verification object or null on failure
 */
export const sendOTP = async (to, channel = 'sms') => {
    const formattedTo = formatPhoneNumber(to);

    try {
        if (!hasVerifyCredentials()) {
            console.log(`[DEV] OTP would be sent to: ${formattedTo}`);
            return null;
        }

        const verification = await client.verify.v2
            .services(verifyServiceSid)
            .verifications.create({
                to: formattedTo,
                channel,
            });

        console.log(`[TWILIO] OTP sent to ${formattedTo} via ${channel} | Status: ${verification.status}`);
        return verification;
    } catch (error) {
        console.error(`[TWILIO] Error sending OTP to ${formattedTo}: ${error.message}`);
        throw error;
    }
};

/**
 * Verify an OTP code entered by the user using Twilio Verify Service.
 *
 * @param {string} to - The recipient phone number (must match the one used in sendOTP)
 * @param {string} code - The OTP code entered by the user
 * @returns {{ success: boolean, status: string }} - Verification result
 */
export const verifyOTP = async (to, code) => {
    const formattedTo = formatPhoneNumber(to);

    try {
        if (!hasVerifyCredentials()) {
            return { success: false, status: 'missing_credentials' };
        }

        const verificationCheck = await client.verify.v2
            .services(verifyServiceSid)
            .verificationChecks.create({
                to: formattedTo,
                code,
            });

        const approved = verificationCheck.status === 'approved';
        console.log(`[TWILIO] OTP verification for ${formattedTo}: ${verificationCheck.status}`);

        return {
            success: approved,
            status: verificationCheck.status,
        };
    } catch (error) {
        console.error(`[TWILIO] Error verifying OTP for ${formattedTo}: ${error.message}`);
        throw error;
    }
};

export const sendOtpMessage = async (to, otp) => {
    if (verifyServiceSid) {
        return sendOTP(to);
    }

    return sendSMS(
        to,
        `Your FixBuddy verification code is ${otp}. It expires shortly. Do not share this code with anyone.`
    );
};

export const sendCaptainAssignmentSms = async ({ to, captainName, requestTitle }) => {
    return sendSMS(
        to,
        `Hello ${captainName}! A new FixBuddy request "${requestTitle}" has been assigned to you. Open your dashboard for details.`
    );
};

export const sendUserRequestStatusSms = async ({ to, captainName, requestTitle, status, amount }) => {
    const messages = {
        ACCEPTED: `Great news! Captain ${captainName} accepted your FixBuddy request "${requestTitle}".`,
        ONGOING: `Captain ${captainName} has started working on your FixBuddy request "${requestTitle}".`,
        COMPLETED: `Your FixBuddy request "${requestTitle}" is complete. Total amount: $${amount ?? 0}.`,
    };

    const message = messages[status];
    if (!message) {
        return null;
    }

    return sendSMS(to, message);
};
