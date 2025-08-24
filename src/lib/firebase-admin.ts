import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();

// Helper function to verify Firebase ID token
export async function verifyFirebaseToken(idToken: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        return { success: true, uid: decodedToken.uid, email: decodedToken.email };
    } catch (error) {
        return { success: false, error: 'Invalid token' };
    }
}

// Helper function to get user data from Firestore
export async function getUserData(uid: string) {
    try {
        const userDoc = await adminDb.collection('users').doc(uid).get();
        if (userDoc.exists) {
            return { success: true, data: userDoc.data() };
        } else {
            return { success: false, error: 'User not found' };
        }
    } catch (error) {
        return { success: false, error: 'Database error' };
    }
}
