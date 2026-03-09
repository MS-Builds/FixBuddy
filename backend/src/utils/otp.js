// Mock OTP generation (In a real app, integrate Twilio/Firebase Auth)

export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOtpSms = async (phoneNumber, otp) => {
    // Integrate SMS provider here.
    console.log(`[DEV ONLY] SMS SENT to ${phoneNumber}: Your OTP is ${otp}`);
    return true;
};
