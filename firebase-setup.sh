#!/bin/bash

echo "🚀 Firebase Setup Script for CodeSapiens"
echo "=========================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
else
    echo "✅ Firebase CLI already installed"
fi

echo ""
echo "📋 Setup Steps:"
echo "1. Login to Firebase (if not already logged in)"
echo "2. Initialize Firebase project"
echo "3. Deploy Firestore security rules"
echo ""

# Login to Firebase
echo "🔐 Logging in to Firebase..."
firebase login

# Initialize Firebase project
echo ""
echo "🏗️  Initializing Firebase project..."
firebase init

# Deploy Firestore rules
echo ""
echo "🔒 Deploying Firestore security rules..."
firebase deploy --only firestore:rules

echo ""
echo "✅ Firebase setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Copy your Firebase config to .env.local"
echo "2. Download your service account key"
echo "3. Update .env.local with admin SDK credentials"
echo "4. Run 'npm run dev' to start development"
echo ""
echo "📚 For more help, see FIREBASE-ONLY-APPROACH.md"
