import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAuth, requireAdmin } from '@/lib/auth-firebase';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ uid: string }> }
) {
    try {
        const { uid } = await params;

        const userDoc = await adminDb.collection('users').doc(uid).get();

        if (!userDoc.exists) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                _id: userDoc.id,
                ...userDoc.data()
            }
        });

    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ uid: string }> }
) {
    try {
        const { uid } = await params;
        const updateData = await request.json();

        // Remove fields that shouldn't be updated
        const { _id, uid: uidField, createdAt, ...cleanUpdateData } = updateData;

        const result = await adminDb.collection('users').doc(uid).update({
            ...cleanUpdateData,
            updatedAt: new Date()
        });

        // Get updated user
        const updatedUserDoc = await adminDb.collection('users').doc(uid).get();

        return NextResponse.json({
            success: true,
            message: 'User updated successfully',
            data: {
                _id: updatedUserDoc.id,
                ...updatedUserDoc.data()
            }
        });

    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ uid: string }> }
) {
    try {
        const { uid } = await params;

        const result = await adminDb.collection('users').doc(uid).delete();

        return NextResponse.json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
