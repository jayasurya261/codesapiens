import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken, getUserData } from './firebase-admin';

/**
 * Middleware to require authentication for API routes
 */
export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, error: 'Missing or invalid authorization header' },
                { status: 401 }
            );
        }

        const idToken = authHeader.substring(7);

        // Verify Firebase ID token
        const tokenResult = await verifyFirebaseToken(idToken);

        if (!tokenResult.success) {
            return NextResponse.json(
                { success: false, error: 'Invalid token' },
                { status: 401 }
            );
        }

        // Get user data from Firestore
        const userResult = await getUserData(tokenResult.uid as string);

        if (!userResult.success) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        const userData = userResult.data;

        // Check if user is approved (for students)
        if (userData?.role === 'student' && !userData?.verification?.adminApproved) {
            return NextResponse.json(
                { success: false, error: 'Account pending approval' },
                { status: 403 }
            );
        }

        // Add user data to request for use in route handlers
        (request as any).user = userData;

        return null; // Continue with the request
    } catch (error) {
        console.error('Authentication error:', error);
        return NextResponse.json(
            { success: false, error: 'Authentication failed' },
            { status: 500 }
        );
    }
}

/**
 * Middleware to require admin role
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
    // First check authentication
    const authError = await requireAuth(request);
    if (authError) return authError;
    console.log((request as any).user);

    // Then check admin role
    const user = (request as any).user;

    if (user.role !== 'admin') {
        return NextResponse.json(
            { success: false, error: 'Admin access required' },
            { status: 403 }
        );
    }

    return null; // Continue with the request
}

/**
 * Get authenticated user from request
 */
export function getAuthenticatedUser(request: NextRequest): any {
    return (request as any).user || null;
}

/**
 * Helper function to extract user ID from request
 */
export function getUserId(request: NextRequest): string | null {
    const user = getAuthenticatedUser(request);
    return user?.uid || null;
}
