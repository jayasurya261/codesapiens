# 🚀 Quick Start Guide

Get CodeSapiens running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB running (local or Atlas)
- Firebase project created

## 1. Install Dependencies

```bash
# Install all dependencies
npm install --legacy-peer-deps

# If that fails, try:
npm install --force
```

## 2. Environment Setup

```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your config
nano .env.local
```

**Required Environment Variables:**
```env
# Firebase (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# MongoDB (Required)
MONGODB_URI=mongodb://localhost:27017/codesapiens
```

## 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Enable Authentication:
   - Email/Password
   - Google (optional)
4. Copy config from Project Settings > General

## 4. MongoDB Setup

### Local MongoDB
```bash
# Install MongoDB
sudo apt-get install mongodb

# Start service
sudo systemctl start mongodb

# Verify
sudo systemctl status mongodb
```

### MongoDB Atlas
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string
4. Update `.env.local`

## 5. Run the App

```bash
# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

## 6. Test the Platform

### Create Admin Account
1. Sign up with admin email
2. Manually approve in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@college.edu" },
  { $set: { "verification.adminApproved": true, role: "admin" } }
)
```

### Create Student Account
1. Sign up with student email
2. Wait for admin approval (or approve manually)

## 🎯 What You'll See

- **Landing Page**: Authentication forms
- **Student Dashboard**: Stats, events, badges
- **Admin Dashboard**: User management, analytics
- **API Endpoints**: RESTful API for all operations

## 🔧 Troubleshooting

### Common Issues

**Dependency Installation Fails**
```bash
npm install --legacy-peer-deps
npm install --force
```

**Firebase Connection Error**
- Check API keys in `.env.local`
- Verify Firebase project settings
- Enable Authentication providers

**MongoDB Connection Error**
- Check MongoDB service status
- Verify connection string
- Check network/firewall settings

**Build Errors**
```bash
# Clear cache
rm -rf .next
npm run build
```

## 📱 Test Features

1. **Authentication**: Sign up/login
2. **Student Dashboard**: View stats and events
3. **Admin Dashboard**: Manage users and view analytics
4. **API Testing**: Use Postman/Insomnia to test endpoints

## 🚀 Next Steps

- Customize branding and colors
- Add more event types
- Implement notification system
- Add file uploads
- Deploy to production

## 📚 Documentation

- [Full README](README.md)
- [API Reference](docs/API.md)
- [Component Library](docs/COMPONENTS.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

---

**Need help?** Check the [Issues](https://github.com/yourusername/codesapiens/issues) page or create a new one!
