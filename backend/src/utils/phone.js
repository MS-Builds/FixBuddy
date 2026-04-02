export const formatPhoneNumber = (phone) => {
    if (!phone) return phone;

    const normalizedPhone = String(phone).trim();
    const cleaned = normalizedPhone.replace(/\D/g, '');

    if (normalizedPhone.startsWith('00')) {
        return `+${cleaned}`;
    }

    if (normalizedPhone.startsWith('+')) {
        return `+${cleaned}`;
    }

    if (cleaned.length === 10) {
        return `+91${cleaned}`;
    }

    if (cleaned.length === 12 && cleaned.startsWith('91')) {
        return `+${cleaned}`;
    }

    return cleaned.length > 5 ? `+${cleaned}` : `+91${cleaned}`;
};
