export const ROLES = {
    STALL_VENDOR: 'STALL_VENDOR',
    EXHIBITION_ORGANIZER: 'EXHIBITION_ORGANIZER'
};

export const RESERVATION_STATUS = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    CANCELLED: 'CANCELLED'
};

export const STALL_TYPES = ['STANDARD', 'PREMIUM', 'CORNER'];
export const STALL_SIZES = ['SMALL', 'MEDIUM', 'LARGE'];

export const OWASP_HEADERS = {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Content-Security-Policy': "default-src 'self'",
    'Referrer-Policy': 'strict-origin-when-cross-origin'
};