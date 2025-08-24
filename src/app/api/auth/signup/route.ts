import { NextRequest, NextResponse } from 'next/server';
import { signUpWithEmail } from '@/lib/firebase';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
    try {
        const { email, password, displayName, phoneNumber, college, skills, linkedinUrl, githubUrl } = await request.json();

        if (!email || !password || !displayName) {
            return NextResponse.json(
                { success: false, error: 'Email, password, and display name are required' },
                { status: 400 }
            );
        }

        // Create user in Firebase
        const { user, error } = await signUpWithEmail(email, password, displayName);

        if (error || !user) {
            return NextResponse.json(
                { success: false, error: 'Failed to create user account' },
                { status: 500 }
            );
        }

        // Create user in Firestore
        const userData = {
            uid: user.uid,
            email: user.email || email,
            displayName: user.displayName || displayName,
            phoneNumber: phoneNumber || null,
            role: 'student',
            profile: {
                college: college || '',
                skills: skills ? skills.split(',').map((s: string) => s.trim()) : [],
                linkedinUrl: linkedinUrl || null,
                githubUrl: githubUrl || null,
                portfolioUrl: null,
                bio: null,
                avatar: user.photoURL || null,
            },
            verification: {
                emailVerified: user.emailVerified,
                phoneVerified: !!phoneNumber,
                adminApproved: false, // Students need admin approval
            },
            stats: {
                points: 0,
                sessionsAttended: 0,
                badgesEarned: 0,
                volunteeringHours: 0,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await adminDb.collection('users').doc(user.uid).set(userData);

        return NextResponse.json({
            success: true,
            message: 'Account created successfully. Please check your email for verification and wait for admin approval.',
            data: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                role: 'student',
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
