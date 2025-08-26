import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ uid: string }> }
) {
    try {
        const { uid } = await params;

        // Fetch user_badges for the user
        const userBadgesSnap = await adminDb
            .collection('user_badges')
            .where('userId', '==', uid)
            .limit(100)
            .get();

        if (userBadgesSnap.empty) {
            return NextResponse.json({ success: true, data: [] });
        }

        const userBadges = userBadgesSnap.docs.map((doc: any) => ({ _id: doc.id, ...doc.data() }));

        // Gather unique badgeIds and batch fetch badge docs
        const badgeIds = Array.from(new Set(userBadges.map((ub: any) => ub.badgeId).filter(Boolean)));

        const badgeDocs = await Promise.all(
            badgeIds.map((id) => adminDb.collection('badges').doc(id).get())
        );

        const badgeMap = new Map<string, any>();
        for (const doc of badgeDocs) {
            if (doc.exists) badgeMap.set(doc.id, { _id: doc.id, ...doc.data() });
        }

        const enriched = userBadges.map((ub: any) => ({
            _id: ub._id,
            userId: ub.userId,
            badgeId: ub.badgeId,
            earnedAt: ub.earnedAt,
            points: ub.points,
            badge: badgeMap.get(ub.badgeId) || null,
        }));

        // Sort by earnedAt desc
        enriched.sort((a: any, b: any) => {
            const aTs = a.earnedAt ? new Date(a.earnedAt).getTime() : 0;
            const bTs = b.earnedAt ? new Date(b.earnedAt).getTime() : 0;
            return bTs - aTs;
        });

        return NextResponse.json({ success: true, data: enriched });
    } catch (error) {
        console.error('Get user badges error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
