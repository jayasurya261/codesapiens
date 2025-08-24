#!/bin/bash

echo "🚀 Setting up CodeSapiens - Student Community Management Platform"
echo "================================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies. Trying alternative approach..."
    npm install --force
fi

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating environment file..."
    cp env.example .env.local
    echo "✅ Environment file created. Please update .env.local with your configuration."
else
    echo "✅ Environment file already exists"
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p src/components
mkdir -p src/hooks
mkdir -p src/services

echo "✅ Directories created"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Firebase configuration"
echo "2. Set up Firebase project and enable Authentication"
echo "3. Set up Firestore database and deploy security rules"
echo "4. Run 'npm run dev' to start the development server"
echo "5. Run './firebase-setup.sh' for Firebase configuration help"
echo ""
echo "For detailed setup instructions, see README.md"
