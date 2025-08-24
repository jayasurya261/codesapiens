import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAuth, requireAdmin } from '@/lib/auth-firebase';

export async function GET(request: NextRequest) {
    // Require authentication
    const authError = await requireAuth(request);
    if (authError) return authError;

    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');
        const limit = parseInt(searchParams.get('limit') || '50');
        const page = parseInt(searchParams.get('page') || '1');
        const search = searchParams.get('search');

        // Validate and sanitize search query
        const sanitizedSearch = search ? search.trim().toLowerCase() : null;

        let query = adminDb.collection('users');

        // Apply role filter
        if (role) {
            query = query.where('role', '==', role) as any;
        }

        // Apply search filter
        if (sanitizedSearch) {
            // Note: Firestore doesn't support OR queries easily, so we'll search by displayName first
            query = query.where('displayName', '>=', sanitizedSearch)
                .where('displayName', '<=', sanitizedSearch + '\uf8ff') as any;
        }

        // Get total count
        const totalSnapshot = await query.get();
        const total = totalSnapshot.size;

        // Apply pagination
        const offset = (page - 1) * limit;
        const usersSnapshot = await query
            .orderBy('createdAt', 'desc')
            .offset(offset)
            .limit(limit)
            .get();

        const users = usersSnapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({
            success: true,
            data: users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1,
            }
        });

    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    // Require admin access for user creation
    const authError = await requireAdmin(request);
    if (authError) return authError;

    try {
        const userData = await request.json();

        if (!userData.uid || !userData.email || !userData.displayName) {
            return NextResponse.json(
                { success: false, error: 'UID, email, and display name are required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await adminDb.collection('users').doc(userData.uid).get();
        if (existingUser.exists) {
            return NextResponse.json(
                { success: false, error: 'User already exists' },
                { status: 409 }
            );
        }

        // Create user
        const newUser = {
            ...userData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await adminDb.collection('users').doc(userData.uid).set(newUser);

        return NextResponse.json({
            success: true,
            message: 'User created successfully',
            data: { ...newUser, _id: userData.uid }
        }, { status: 201 });

    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
