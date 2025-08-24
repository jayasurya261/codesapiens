export interface User {
    _id?: string;
    uid: string; // Firebase UID
    email: string;
    displayName: string;
    phoneNumber?: string;
    role: 'student' | 'admin';
    profile: {
        college: string;
        skills: string[];
        linkedinUrl?: string;
        githubUrl?: string;
        portfolioUrl?: string;
        bio?: string;
        avatar?: string;
    };
    verification: {
        emailVerified: boolean;
        phoneVerified: boolean;
        adminApproved: boolean;
    };
    stats: {
        points: number;
        sessionsAttended: number;
        badgesEarned: number;
        volunteeringHours: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface Event {
    _id?: string;
    title: string;
    description: string;
    type: 'session' | 'workshop' | 'meetup' | 'conference';
    startDate: Date;
    endDate: Date;
    location: string;
    maxAttendees?: number;
    currentAttendees: number;
    organizerId: string;
    organizerName: string;
    tags: string[];
    image?: string;
    qrCode?: string;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    attendees: string[]; // User IDs
    createdAt: Date;
    updatedAt: Date;
}

export interface Attendance {
    _id?: string;
    eventId: string;
    userId: string;
    userName: string;
    checkInTime: Date;
    checkOutTime?: Date;
    method: 'qr' | 'manual' | 'digital';
    verified: boolean;
    points: number;
    createdAt: Date;
}

export interface Badge {
    _id?: string;
    name: string;
    description: string;
    icon: string;
    category: 'attendance' | 'volunteering' | 'leadership' | 'special';
    points: number;
    requirements: {
        sessionsAttended?: number;
        volunteeringHours?: number;
        specialCriteria?: string;
    };
    createdAt: Date;
}

export interface UserBadge {
    _id?: string;
    userId: string;
    badgeId: string;
    badge: Badge;
    earnedAt: Date;
    points: number;
}

export interface Message {
    _id?: string;
    senderId: string;
    senderName: string;
    receiverId: string;
    content: string;
    type: 'text' | 'image' | 'file';
    read: boolean;
    createdAt: Date;
}

export interface Announcement {
    _id?: string;
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    priority: 'low' | 'medium' | 'high';
    targetAudience: 'all' | 'students' | 'admins' | 'specific';
    targetUsers?: string[]; // Specific user IDs if targetAudience is 'specific'
    channels: ('email' | 'push' | 'whatsapp' | 'telegram')[];
    status: 'draft' | 'sent' | 'scheduled';
    scheduledAt?: Date;
    sentAt?: Date;
    createdAt: Date;
}

export interface LeaderboardEntry {
    userId: string;
    userName: string;
    points: number;
    rank: number;
    stats: {
        sessionsAttended: number;
        badgesEarned: number;
        volunteeringHours: number;
    };
}

export interface Analytics {
    totalUsers: number;
    activeUsers: number;
    totalEvents: number;
    upcomingEvents: number;
    totalAttendance: number;
    averageAttendance: number;
    topPerformers: LeaderboardEntry[];
    engagementMetrics: {
        averagePoints: number;
        averageSessionsAttended: number;
        averageVolunteeringHours: number;
    };
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
