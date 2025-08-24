# CodeSapiens - Student Community Management Platform

A comprehensive platform for managing student communities, events, and engagement tracking built with Next.js 15, MongoDB, and Firebase.

## 🚀 Features

### Student Features
- **Authentication & Registration**: Email/password and Google OAuth via Firebase
- **Profile Management**: Complete profile setup with skills, college, and social links
- **Dashboard**: Overview of sessions, events, badges, and networking suggestions
- **Event Participation**: Join workshops, sessions, and meetups
- **Badge System**: Earn badges for attendance, volunteering, and contributions
- **Networking**: Connect with other students and build professional relationships
- **Points System**: Track engagement and climb the leaderboard

### Admin Features
- **Student Management**: Approve/verify students, view/edit profiles
- **Event Management**: Create and schedule sessions, workshops, and meetups
- **Attendance Tracking**: QR code and digital check-in systems
- **Engagement Analytics**: Comprehensive reports and metrics
- **Communication Tools**: Send announcements via multiple channels
- **Performance Monitoring**: Track student engagement and identify top performers

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore (NoSQL)
- **State Management**: React Context API
- **UI Components**: Lucide React icons, React Hook Form
- **Notifications**: React Hot Toast
- **Styling**: Tailwind CSS with custom design system

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── users/         # User management
│   │   ├── events/        # Event management
│   │   └── admin/         # Admin-specific endpoints
│   ├── dashboard/         # Student dashboard
│   ├── admin/             # Admin dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/             # Reusable UI components
├── contexts/               # React contexts
│   └── AuthContext.tsx    # Authentication context
├── lib/                    # Utility libraries
│   ├── firebase.ts        # Firebase configuration
│   ├── firebase-admin.ts  # Firebase Admin SDK
│   └── utils.ts           # Helper functions
└── types/                  # TypeScript type definitions
    └── index.ts           # Main type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Firebase project
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd codesapiens
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```

   Fill in your configuration values in `.env.local`:
   - Firebase configuration
   - MongoDB connection string
   - Other optional services

4. **Set up Firebase**
   - Create a new Firebase project
   - Enable Authentication (Email/Password and Google)
   - Get your configuration from Project Settings
   - Update `.env.local` with your Firebase config

5. **Set up Firebase Firestore**
   - Enable Firestore Database in your Firebase project
   - Set up security rules (see `firestore.rules`)
   - Deploy security rules: `firebase deploy --only firestore:rules`

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication with Email/Password and Google providers
4. Get your project configuration from Project Settings > General
5. Update your `.env.local` file

### Firebase Firestore Setup

1. **Enable Firestore Database**
   - Go to your Firebase Console
   - Navigate to Firestore Database
   - Click "Create Database"
   - Choose production or test mode
   - Select a location for your database

2. **Configure Security Rules**
   - Use the provided `firestore.rules` file
   - Deploy rules: `firebase deploy --only firestore:rules`

3. **Set up Firebase Admin SDK**
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Download the JSON file
   - Update your `.env.local` with the credentials

## 📊 Database Collections

The platform uses the following Firestore collections:

- **users**: Student and admin user profiles
- **events**: Workshops, sessions, and meetups
- **attendance**: Event attendance records
- **badges**: Achievement badges and requirements
- **user_badges**: User badge assignments
- **messages**: Internal messaging system
- **announcements**: Platform announcements

## 🔐 Authentication Flow

1. **Registration**: Users sign up with email/password or Google OAuth
2. **Verification**: Email verification via Firebase
3. **Approval**: Students require admin approval (admins are auto-approved)
4. **Login**: Authenticated users access their respective dashboards

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/google` - Google OAuth

### Users
- `GET /api/users` - List users with filters
- `POST /api/users` - Create user
- `GET /api/users/[uid]` - Get specific user
- `PATCH /api/users/[uid]` - Update user
- `DELETE /api/users/[uid]` - Delete user

### Events
- `GET /api/events` - List events with filters
- `POST /api/events` - Create event

### Admin
- `GET /api/admin/analytics` - Platform analytics
- `PATCH /api/admin/users/[uid]/approve` - Approve/reject users

## 🎨 UI Components

The platform uses a modern, responsive design with:
- **Gradient backgrounds** and **card-based layouts**
- **Responsive grid systems** for all screen sizes
- **Interactive elements** with hover states and transitions
- **Consistent color scheme** (blue, purple, green, orange)
- **Professional typography** using Geist fonts

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
- **Netlify**: Similar to Vercel
- **Railway**: Good for full-stack apps
- **DigitalOcean**: For custom server setup

## 🔒 Security Features

- **Firebase Authentication** with secure token management
- **Firestore Security Rules** with database-level access control
- **Role-based access control** (Student vs Admin)
- **Input validation** and sanitization
- **Secure API endpoints** with proper error handling
- **Built-in security** with Google's enterprise-grade infrastructure

## 📱 Mobile Responsiveness

The platform is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/yourusername/codesapiens/issues) page
2. Create a new issue with detailed description
3. Include your environment details and error logs

## 🎉 Acknowledgments

- Next.js team for the amazing framework
- Firebase for authentication services
- MongoDB for the database
- Tailwind CSS for the styling system
- All contributors and community members

---

**Built with ❤️ for the student community**
