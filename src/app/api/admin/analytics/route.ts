import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/auth-firebase';

export async function GET(request: NextRequest) {
    // Require admin access
    // const authError = await requireAdmin(request);
    // if (authError) return authError;

    try {
        // Get basic counts
        const usersSnapshot = await adminDb.collection('users').get();
        const eventsSnapshot = await adminDb.collection('events').get();
        const attendanceSnapshot = await adminDb.collection('attendance').get();

        const totalUsers = usersSnapshot.size;
        const totalEvents = eventsSnapshot.size;
        const totalAttendance = attendanceSnapshot.size;

        // Get active users (users who have attended at least one event in the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const activeAttendanceSnapshot = await adminDb.collection('attendance')
            .where('checkInTime', '>=', thirtyDaysAgo)
            .get();

        const activeUserIds = new Set(activeAttendanceSnapshot.docs.map(doc => doc.data().userId));
        const activeUsers = activeUserIds.size;

        // Get upcoming events count
        const upcomingEventsSnapshot = await adminDb.collection('events')
            .where('status', '==', 'upcoming')
            .get();

        const upcomingEvents = upcomingEventsSnapshot.size;

        // Calculate average attendance per event
        const eventsWithAttendance = await adminDb.collection('events').get();
        let totalAttendees = 0;

        eventsWithAttendance.docs.forEach(doc => {
            const eventData = doc.data();
            totalAttendees += eventData.attendees?.length || 0;
        });

        const averageAttendance = eventsWithAttendance.size > 0
            ? Math.round(totalAttendees / eventsWithAttendance.size)
            : 0;

        // Get top performers (users with most points)
        const studentsSnapshot = await adminDb.collection('users')
            .where('role', '==', 'student')
            .orderBy('stats.points', 'desc')
            .limit(10)
            .get();

        const topPerformers = studentsSnapshot.docs.map((doc, index) => {
            const userData = doc.data();
            return {
                userId: doc.id,
                userName: userData.displayName,
                points: userData.stats?.points || 0,
                rank: index + 1,
                stats: {
                    sessionsAttended: userData.stats?.sessionsAttended || 0,
                    badgesEarned: userData.stats?.badgesEarned || 0,
                    volunteeringHours: userData.stats?.volunteeringHours || 0,
                }
            };
        });

        // Calculate engagement metrics
        const allStudentsSnapshot = await adminDb.collection('users')
            .where('role', '==', 'student')
            .get();

        let totalPoints = 0;
        let totalSessionsAttended = 0;
        let totalVolunteeringHours = 0;

        allStudentsSnapshot.docs.forEach(doc => {
            const userData = doc.data();
            totalPoints += userData.stats?.points || 0;
            totalSessionsAttended += userData.stats?.sessionsAttended || 0;
            totalVolunteeringHours += userData.stats?.volunteeringHours || 0;
        });

        const studentCount = allStudentsSnapshot.size;
        const engagementMetrics = {
            averagePoints: studentCount > 0 ? Math.round(totalPoints / studentCount) : 0,
            averageSessionsAttended: studentCount > 0 ? Math.round(totalSessionsAttended / studentCount) : 0,
            averageVolunteeringHours: studentCount > 0 ? Math.round((totalVolunteeringHours / studentCount) * 10) / 10 : 0,
        };

        const analytics = {
            totalUsers,
            activeUsers,
            totalEvents,
            upcomingEvents,
            totalAttendance,
            averageAttendance,
            topPerformers,
            engagementMetrics
        };

        return NextResponse.json({
            success: true,
            data: analytics
        });

    } catch (error) {
        console.error('Get analytics error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
