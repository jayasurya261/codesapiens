import { NextRequest, NextResponse } from 'next/server';
import { signInWithEmail } from '@/lib/firebase';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Authenticate with Firebase
        const { user, error } = await signInWithEmail(email, password);

        if (error || !user) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check if user exists in Firestore
        const userDoc = await adminDb.collection('users').doc(user.uid).get();

        if (!userDoc.exists) {
            return NextResponse.json(
                { success: false, error: 'User not found in database' },
                { status: 404 }
            );
        }

        const userData = userDoc.data();

        if (!userData) {
            return NextResponse.json(
                { success: false, error: 'User data is invalid' },
                { status: 500 }
            );
        }

        // Check if user is approved (for students)
        if (userData.role === 'student' && !userData.verification.adminApproved) {
            return NextResponse.json(
                { success: false, error: 'Account pending approval' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            data: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                role: userData.role,
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
