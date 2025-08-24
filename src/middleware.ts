import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Max requests per window

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Content Security Policy
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.gstatic.com https://www.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com;"
    );

    // Rate limiting for API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
        const now = Date.now();

        const clientData = rateLimitStore.get(clientIP);

        if (clientData && now < clientData.resetTime) {
            if (clientData.count >= MAX_REQUESTS) {
                return new NextResponse(
                    JSON.stringify({ error: 'Rate limit exceeded' }),
                    { status: 429, headers: { 'Content-Type': 'application/json' } }
                );
            }
            clientData.count++;
        } else {
            rateLimitStore.set(clientIP, {
                count: 1,
                resetTime: now + RATE_LIMIT_WINDOW
            });
        }
    }

    // Clean up old rate limit entries
    if (Math.random() < 0.01) { // 1% chance to clean up
        const now = Date.now();
        for (const [key, value] of rateLimitStore.entries()) {
            if (now > value.resetTime) {
                rateLimitStore.delete(key);
            }
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/api/:path*',
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
