import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/auth-firebase';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { uid: string } }
) {
    // Require admin access
    const authError = await requireAdmin(request);
    if (authError) return authError;

    try {
        const { uid } = params;
        const { approved } = await request.json();

        if (typeof approved !== 'boolean') {
            return NextResponse.json(
                { success: false, error: 'Approval status is required' },
                { status: 400 }
            );
        }

        // Update user approval status
        await adminDb.collection('users').doc(uid).update({
            'verification.adminApproved': approved,
            updatedAt: new Date()
        });

        // Get updated user
        const updatedUserDoc = await adminDb.collection('users').doc(uid).get();

        return NextResponse.json({
            success: true,
            message: `User ${approved ? 'approved' : 'rejected'} successfully`,
            data: {
                _id: updatedUserDoc.id,
                ...updatedUserDoc.data()
            }
        });

    } catch (error) {
        console.error('Update user approval error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
