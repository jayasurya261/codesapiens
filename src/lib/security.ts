import crypto from 'crypto';

/**
 * CSRF Token Management
 */
export class CSRFProtection {
    private static tokens = new Map<string, { token: string; expires: number }>();
    private static readonly TOKEN_EXPIRY = 30 * 60 * 1000; // 30 minutes

    /**
     * Generate a new CSRF token
     */
    static generateToken(sessionId: string): string {
        const token = crypto.randomBytes(32).toString('hex');
        const expires = Date.now() + this.TOKEN_EXPIRY;

        this.tokens.set(sessionId, { token, expires });

        // Clean up expired tokens
        this.cleanupExpiredTokens();

        return token;
    }

    /**
     * Verify a CSRF token
     */
    static verifyToken(sessionId: string, token: string): boolean {
        const stored = this.tokens.get(sessionId);

        if (!stored || stored.expires < Date.now()) {
            this.tokens.delete(sessionId);
            return false;
        }

        return stored.token === token;
    }

    /**
     * Clean up expired tokens
     */
    private static cleanupExpiredTokens(): void {
        const now = Date.now();
        for (const [key, value] of this.tokens.entries()) {
            if (value.expires < now) {
                this.tokens.delete(key);
            }
        }
    }
}

/**
 * Input Validation and Sanitization
 */
export class InputValidator {
    /**
     * Validate email format
     */
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 254;
    }

    /**
     * Validate phone number format
     */
    static isValidPhone(phone: string): boolean {
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
        return phoneRegex.test(phone);
    }

    /**
     * Validate password strength
     */
    static isStrongPassword(password: string): boolean {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    /**
     * Sanitize HTML content
     */
    static sanitizeHTML(content: string): string {
        return content
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    /**
     * Validate file upload
     */
    static validateFileUpload(file: File, maxSize: number, allowedTypes: string[]): boolean {
        if (file.size > maxSize) return false;
        if (!allowedTypes.includes(file.type)) return false;
        return true;
    }
}

/**
 * Security Headers Configuration
 */
export const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.gstatic.com https://www.googleapis.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com",
        "frame-ancestors 'none'"
    ].join('; ')
};

/**
 * Rate Limiting Configuration
 */
export const rateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
};

/**
 * Session Configuration
 */
export const sessionConfig = {
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict' as const,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
};
