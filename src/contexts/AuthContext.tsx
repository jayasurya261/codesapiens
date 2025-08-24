'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User } from '@/types';

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
    loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setFirebaseUser(firebaseUser);

            if (firebaseUser) {
                try {
                    // Fetch user data from Firestore
                    const response = await fetch(`/api/users/${firebaseUser.uid}`);
                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData.data);
                    } else {
                        // User doesn't exist in Firestore yet, create a basic user object
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email || '',
                            displayName: firebaseUser.displayName || '',
                            phoneNumber: firebaseUser.phoneNumber || undefined,
                            role: 'student',
                            profile: {
                                college: '',
                                skills: [],
                                linkedinUrl: undefined,
                                githubUrl: undefined,
                                portfolioUrl: undefined,
                                bio: undefined,
                                avatar: firebaseUser.photoURL || undefined,
                            },
                            verification: {
                                emailVerified: firebaseUser.emailVerified,
                                phoneVerified: !!firebaseUser.phoneNumber,
                                adminApproved: false,
                            },
                            stats: {
                                points: 0,
                                sessionsAttended: 0,
                                badgesEarned: 0,
                                volunteeringHours: 0,
                            },
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                setUser(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();
            return result;
        } catch (error) {
            return { success: false, error: 'Login failed' };
        }
    };

    const signup = async (email: string, password: string, displayName: string) => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, displayName }),
            });

            const result = await response.json();
            return result;
        } catch (error) {
            return { success: false, error: 'Signup failed' };
        }
    };

    const loginWithGoogle = async () => {
        try {
            const response = await fetch('/api/auth/google', {
                method: 'POST',
            });

            const result = await response.json();
            return result;
        } catch (error) {
            return { success: false, error: 'Google login failed' };
        }
    };

    const logout = async () => {
        try {
            await auth.signOut();
            setUser(null);
            setFirebaseUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateUser = async (userData: Partial<User>) => {
        if (!user) return;

        try {
            const response = await fetch(`/api/users/${user.uid}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser.data);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const value: AuthContextType = {
        user,
        firebaseUser,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
