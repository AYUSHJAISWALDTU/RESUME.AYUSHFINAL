#!/bin/bash

echo "🚀 Ayush Portfolio Deployment Script"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the root of your portfolio directory"
    exit 1
fi

echo "📋 Deployment Options:"
echo "1. Vercel (Frontend + Backend)"
echo "2. Netlify (Frontend) + Railway (Backend)"
echo "3. GitHub Pages (Frontend only)"
echo "4. Heroku (Full stack)"
echo "5. Local setup check"

read -p "Choose deployment option (1-5): " choice

case $choice in
    1)
        echo "🔧 Setting up Vercel deployment..."
        # Install Vercel CLI if not present
        if ! command -v vercel &> /dev/null; then
            echo "📦 Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        echo "🌐 Deploying frontend..."
        vercel --prod
        
        echo "🔧 Deploying backend..."
        cd backend
        vercel --prod
        cd ..
        
        echo "✅ Vercel deployment initiated!"
        echo "🔗 Check your Vercel dashboard for deployment URLs"
        ;;
        
    2)
        echo "🔧 Setting up Netlify + Railway deployment..."
        echo "📝 Steps to follow:"
        echo "1. Push your code to GitHub"
        echo "2. Connect repository to Netlify for frontend"
        echo "3. Connect repository to Railway for backend"
        echo "4. Set environment variables in both platforms"
        ;;
        
    3)
        echo "🔧 Setting up GitHub Pages..."
        
        # Check if git is initialized
        if [ ! -d ".git" ]; then
            echo "📦 Initializing git repository..."
            git init
            git add .
            git commit -m "Initial portfolio commit"
        fi
        
        echo "📝 Steps to complete GitHub Pages deployment:"
        echo "1. Create a repository on GitHub"
        echo "2. Run: git remote add origin https://github.com/yourusername/repository-name.git"
        echo "3. Run: git push -u origin main"
        echo "4. Enable GitHub Pages in repository settings"
        ;;
        
    4)
        echo "🔧 Setting up Heroku deployment..."
        
        # Create Procfile for Heroku
        echo "web: node backend/server.js" > Procfile
        
        # Create deployment package.json in root
        cat > package.json << EOF
{
  "name": "ayush-portfolio",
  "version": "1.0.0",
  "description": "Portfolio website",
  "main": "backend/server.js",
  "scripts": {
    "start": "node backend/server.js",
    "heroku-postbuild": "cd backend && npm install"
  },
  "engines": {
    "node": "18.x"
  }
}
EOF
        
        echo "✅ Heroku files created!"
        echo "📝 Run these commands to deploy:"
        echo "heroku create ayush-portfolio-app"
        echo "git add ."
        echo "git commit -m 'Deploy to Heroku'"
        echo "git push heroku main"
        ;;
        
    5)
        echo "🔍 Checking local setup..."
        
        # Check required files
        echo "📁 Checking required files..."
        required_files=("index.html" "styles.css" "app.js" "backend/server.js" "backend/package.json")
        
        for file in "${required_files[@]}"; do
            if [ -f "$file" ]; then
                echo "✅ $file - Found"
            else
                echo "❌ $file - Missing"
            fi
        done
        
        # Check backend dependencies
        echo "📦 Checking backend dependencies..."
        cd backend
        if [ -f "package.json" ]; then
            if [ ! -d "node_modules" ]; then
                echo "📦 Installing backend dependencies..."
                npm install
            else
                echo "✅ Backend dependencies installed"
            fi
        fi
        cd ..
        
        # Check frontend assets
        echo "🖼️ Checking assets..."
        assets=("assets/Ayush.png" "assets/Ayush_Jaiswal_Resume.pdf" "assets/certificates/")
        
        for asset in "${assets[@]}"; do
            if [ -e "$asset" ]; then
                echo "✅ $asset - Found"
            else
                echo "⚠️ $asset - Missing (optional but recommended)"
            fi
        done
        
        echo "🚀 To test locally:"
        echo "Frontend: Open index.html in browser or run 'python3 -m http.server 8000'"
        echo "Backend: cd backend && npm start"
        ;;
        
    *)
        echo "❌ Invalid option selected"
        exit 1
        ;;
esac

echo ""
echo "📋 Environment Variables Checklist:"
echo "- MONGODB_URI (for database)"
echo "- FRONTEND_URL (for CORS)"
echo "- NODE_ENV=production"
echo "- EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS (for contact form)"
echo ""
echo "🎉 Deployment setup complete!"
echo "📖 Check DEPLOYMENT.md for detailed instructions"
