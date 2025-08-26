import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ uid: string }> }
) {
    try {
        const { uid } = await params;
        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);

        // Fetch messages where the user is either sender or recipient.
        // Avoid composite index requirements by fetching two small windows and sorting in-memory.
        const windowSize = limit * 2;

        const byRecipientSnap = await adminDb
            .collection('messages')
            .where('recipientId', '==', uid)
            .limit(windowSize)
            .get();

        const bySenderSnap = await adminDb
            .collection('messages')
            .where('senderId', '==', uid)
            .limit(windowSize)
            .get();

        const combined = [
            ...byRecipientSnap.docs.map((doc: any) => ({ _id: doc.id, ...doc.data() })),
            ...bySenderSnap.docs.map((doc: any) => ({ _id: doc.id, ...doc.data() })),
        ];

        // De-duplicate by id
        const uniqueMap = new Map<string, any>();
        for (const msg of combined) uniqueMap.set(msg._id, msg);
        const unique = Array.from(uniqueMap.values());

        // Sort by createdAt desc (fallback to 0 if missing)
        unique.sort((a: any, b: any) => {
            const aTs = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bTs = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return bTs - aTs;
        });

        const messages = unique.slice(0, limit);

        return NextResponse.json({ success: true, data: messages });
    } catch (error) {
        console.error('Get messages error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
