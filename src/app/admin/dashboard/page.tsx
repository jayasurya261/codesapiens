'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
    Users,
    Calendar,
    TrendingUp,
    BarChart3,
    Bell,
    Settings,
    LogOut,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    MapPin,
    UserCheck,
    UserX
} from 'lucide-react';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { User, Event, Analytics } from '@/types';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const [students, setStudents] = useState<User[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.push('/');
            return;
        }

        if (user.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        fetchAdminData();
    }, [user, loading, router]);

    const fetchAdminData = async () => {
        try {
            // Fetch students
            const studentsResponse = await fetch('/api/users?role=student');
            if (studentsResponse.ok) {
                const studentsData = await studentsResponse.json();
                setStudents(studentsData.data || []);
            }

            // Fetch events
            const eventsResponse = await fetch('/api/events?limit=10');
            if (eventsResponse.ok) {
                const eventsData = await eventsResponse.json();
                setEvents(eventsData.data || []);
            }

            // Fetch analytics
            const analyticsResponse = await fetch('/api/admin/analytics');
            if (analyticsResponse.ok) {
                const analyticsData = await analyticsResponse.json();
                setAnalytics(analyticsData.data);
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setDataLoading(false);
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

    const handleStudentApproval = async (studentId: string, approved: boolean) => {
        try {
            const response = await fetch(`/api/admin/users/${studentId}/approve`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved }),
            });

            if (response.ok) {
                toast.success(`Student ${approved ? 'approved' : 'rejected'} successfully`);
                fetchAdminData(); // Refresh data
            } else {
                toast.error('Failed to update student status');
            }
        } catch (error) {
            toast.error('Error updating student status');
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.profile.college.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all' ||
            (filterStatus === 'pending' && !student.verification.adminApproved) ||
            (filterStatus === 'approved' && student.verification.adminApproved) ||
            (filterStatus === 'rejected' && student.verification.adminApproved === false);

        return matchesSearch && matchesFilter;
    });

    if (loading || dataLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">A</span>
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                                Admin Dashboard
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                                <Bell className="w-6 h-6" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            </button>

                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </span>
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                                    <p className="text-xs text-gray-500">Administrator</p>
                                </div>
                            </div>

                            <div className="relative group">
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                    <Settings className="w-5 h-5" />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <button
                                        onClick={() => router.push('/admin/settings')}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Admin Settings
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
                        Welcome, Administrator! 👋
                    </h2>
                    <p className="text-gray-600">
                        Manage your student community, events, and track engagement metrics.
                    </p>
                </div>

                {/* Analytics Cards */}
                {analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Students</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.activeUsers}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <UserCheck className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Events</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.totalEvents}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Avg. Attendance</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.averageAttendance}</p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Student Management */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border">
                            <div className="p-6 border-b">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                        <Users className="w-5 h-5 text-blue-600" />
                                        <span>Student Management</span>
                                    </h3>
                                    <button
                                        onClick={() => router.push('/admin/students')}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>View All</span>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Search and Filter */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search students..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value as any)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">All Students</option>
                                        <option value="pending">Pending Approval</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>

                                {/* Students List */}
                                <div className="space-y-3">
                                    {filteredStudents.slice(0, 5).map((student) => (
                                        <div key={student._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold text-sm">
                                                        {student.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{student.displayName}</p>
                                                    <p className="text-sm text-gray-500">{student.email}</p>
                                                    <p className="text-xs text-gray-400">{student.profile.college}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                {!student.verification.adminApproved ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleStudentApproval(student.uid, true)}
                                                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStudentApproval(student.uid, false)}
                                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                            title="Reject"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                        Approved
                                                    </span>
                                                )}

                                                <div className="relative group">
                                                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                                                            <Eye className="w-4 h-4" />
                                                            <span>View</span>
                                                        </button>
                                                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                                                            <Edit className="w-4 h-4" />
                                                            <span>Edit</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions and Recent Events */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm border">
                            <div className="p-6 border-b">
                                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                            </div>
                            <div className="p-6 space-y-3">
                                <button
                                    onClick={() => router.push('/admin/events/create')}
                                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <Plus className="w-5 h-5 text-blue-600" />
                                    <span>Create Event</span>
                                </button>
                                <button
                                    onClick={() => router.push('/admin/announcements')}
                                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <Bell className="w-5 h-5 text-green-600" />
                                    <span>Send Announcement</span>
                                </button>
                                <button
                                    onClick={() => router.push('/admin/analytics')}
                                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <BarChart3 className="w-5 h-5 text-purple-600" />
                                    <span>View Analytics</span>
                                </button>
                                <button
                                    onClick={() => router.push('/admin/reports')}
                                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <TrendingUp className="w-5 h-5 text-orange-600" />
                                    <span>Generate Reports</span>
                                </button>
                            </div>
                        </div>

                        {/* Recent Events */}
                        <div className="bg-white rounded-xl shadow-sm border">
                            <div className="p-6 border-b">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <span>Recent Events</span>
                                </h3>
                            </div>
                            <div className="p-6">
                                {events.length > 0 ? (
                                    <div className="space-y-3">
                                        {events.slice(0, 3).map((event) => (
                                            <div key={event._id} className="p-3 bg-gray-50 rounded-lg">
                                                <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                                                <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                                    <span className="flex items-center space-x-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{formatDate(event.startDate, 'MMM dd')}</span>
                                                    </span>
                                                    <span className="flex items-center space-x-1">
                                                        <MapPin className="w-3 h-3" />
                                                        <span>{event.location}</span>
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs text-gray-500">
                                                        {event.currentAttendees} attendees
                                                    </span>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                                        event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                                                            event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {event.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">No events created yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
