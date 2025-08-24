import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAuth, requireAdmin } from '@/lib/auth-firebase';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const type = searchParams.get('type');
        const limit = parseInt(searchParams.get('limit') || '50');
        const page = parseInt(searchParams.get('page') || '1');
        const search = searchParams.get('search');

        let query = adminDb.collection('events');

        // Apply filters
        if (status) {
            query = query.where('status', '==', status) as any;
        }
        if (type) {
            query = query.where('type', '==', type) as any;
        }

        // Apply search filter
        if (search) {
            const sanitizedSearch = search.trim().toLowerCase();
            query = query.where('title', '>=', sanitizedSearch)
                .where('title', '<=', sanitizedSearch + '\uf8ff') as any;
        }

        // Get total count
        const totalSnapshot = await query.get();
        const total = totalSnapshot.size;

        // Apply pagination
        const offset = (page - 1) * limit;
        const eventsSnapshot = await query
            .orderBy('startDate', 'asc')
            .offset(offset)
            .limit(limit)
            .get();

        const events = eventsSnapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({
            success: true,
            data: events,
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
        console.error('Get events error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    // Require admin access for event creation
    const authError = await requireAdmin(request);
    if (authError) return authError;

    try {
        const eventData = await request.json();

        if (!eventData.title || !eventData.description || !eventData.startDate || !eventData.endDate) {
            return NextResponse.json(
                { success: false, error: 'Title, description, start date, and end date are required' },
                { status: 400 }
            );
        }

        // Create event
        const newEvent = {
            ...eventData,
            startDate: new Date(eventData.startDate),
            endDate: new Date(eventData.endDate),
            currentAttendees: 0,
            attendees: [],
            status: 'upcoming',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const eventRef = await adminDb.collection('events').add(newEvent);

        return NextResponse.json({
            success: true,
            message: 'Event created successfully',
            data: { ...newEvent, _id: eventRef.id }
        }, { status: 201 });

    } catch (error) {
        console.error('Create event error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
