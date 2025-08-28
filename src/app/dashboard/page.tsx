'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
    Calendar,
    Users,
    Trophy,
    TrendingUp,
    Bell,
    Settings,
    LogOut,
    MapPin,
    Clock,
    Star,
    MessageCircle,
    BookOpen,
    Award,
    Target
} from 'lucide-react';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { Event, UserBadge, Message } from '@/types';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [badges, setBadges] = useState<UserBadge[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('User data:', user);
        if (!user) {
            router.push('/');
            return;
        }

        if (user.role === 'admin') {
            router.push('/admin/dashboard');
            return;
        }

        fetchDashboardData();
    }, [user, router]);

    const fetchDashboardData = async () => {
        try {
            // Fetch upcoming events
            const eventsResponse = await fetch('/api/events?status=upcoming&limit=5');
            if (eventsResponse.ok) {
                const eventsData = await eventsResponse.json();
                setEvents(eventsData.data || []);
            }

            // Fetch user badges
            const badgesResponse = await fetch(`/api/users/${user?.uid}/badges`);
            if (badgesResponse.ok) {
                const badgesData = await badgesResponse.json();
                setBadges(badgesData.data || []);
            }

            // Fetch recent messages
            const messagesResponse = await fetch(`/api/users/${user?.uid}/messages?limit=5`);
            if (messagesResponse.ok) {
                const messagesData = await messagesResponse.json();
                setMessages(messagesData.data || []);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Error logging out');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) return null;
    console.log(user)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">CS</span>
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                CodeSapiens
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                                <Bell className="w-6 h-6" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            </button>

                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </span>
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </div>

                            <div className="relative group">
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                    <Settings className="w-5 h-5" />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <button
                                        onClick={() => router.push('/profile')}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Profile Settings
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user.displayName}! 👋
                    </h2>
                    <p className="text-gray-600">
                        Here's what's happening in your student community today.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Points</p>
                                <p className="text-2xl font-bold text-gray-900">{user.stats.points}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Sessions Attended</p>
                                <p className="text-2xl font-bold text-gray-900">{user.stats.sessionsAttended}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Badges Earned</p>
                                <p className="text-2xl font-bold text-gray-900">{user.stats.badgesEarned}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Volunteering Hours</p>
                                <p className="text-2xl font-bold text-gray-900">{user.stats.volunteeringHours}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upcoming Events */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border">
                            <div className="p-6 border-b">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <span>Upcoming Events</span>
                                </h3>
                            </div>
                            <div className="p-6">
                                {events.length > 0 ? (
                                    <div className="space-y-4">
                                        {events.map((event) => (
                                            <div key={event._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <Calendar className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                                        <span className="flex items-center space-x-1">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{formatDate(event.startDate, 'MMM dd, yyyy')}</span>
                                                        </span>
                                                        <span className="flex items-center space-x-1">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>{event.location}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                                    Join
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">No upcoming events</p>
                                        <p className="text-sm text-gray-400">Check back later for new events!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-6">
                        {/* Recent Badges */}
                        <div className="bg-white rounded-xl shadow-sm border">
                            <div className="p-6 border-b">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                    <Award className="w-5 h-5 text-purple-600" />
                                    <span>Recent Badges</span>
                                </h3>
                            </div>
                            <div className="p-6">
                                {badges.length > 0 ? (
                                    <div className="space-y-3">
                                        {badges.slice(0, 3).map((userBadge) => (
                                            <div key={userBadge._id} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                    <Star className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{userBadge.badge.name}</p>
                                                    <p className="text-sm text-gray-500">{formatRelativeTime(userBadge.earnedAt)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">No badges earned yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm border">
                            <div className="p-6 border-b">
                                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                            </div>
                            <div className="p-6 space-y-3">
                                <button
                                    onClick={() => router.push('/events')}
                                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                    <span>Browse Events</span>
                                </button>
                                <button
                                    onClick={() => router.push('/network')}
                                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <Users className="w-5 h-5 text-green-600" />
                                    <span>Find Connections</span>
                                </button>
                                <button
                                    onClick={() => router.push('/leaderboard')}
                                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <Target className="w-5 h-5 text-purple-600" />
                                    <span>View Leaderboard</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
