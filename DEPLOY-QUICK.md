# 🚀 Quick Deployment Guide

## Ready to Deploy? Choose Your Platform:

### 🔥 Option 1: Vercel (Recommended - Free)
**Best for: Quick deployment with both frontend and backend**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend:**
   ```bash
   vercel --prod
   ```

3. **Deploy Backend:**
   ```bash
   cd backend
   vercel --prod
   ```

4. **Set Environment Variables** in Vercel dashboard

---

### 🌐 Option 2: Netlify + Railway
**Best for: Professional deployment with custom domains**

1. **Frontend on Netlify:**
   - Connect GitHub repo to Netlify
   - Auto-deploy from main branch

2. **Backend on Railway:**
   - Connect GitHub repo to Railway
   - Add environment variables
   - Deploy automatically

---

### 📱 Option 3: Heroku (All-in-one)
**Best for: Simple full-stack deployment**

```bash
# Install Heroku CLI first
heroku create ayush-portfolio
git add .
git commit -m "Deploy portfolio"
git push heroku main
```

---

### 🤖 Option 4: Use Our Deployment Script
```bash
./deploy.sh
```

## 📋 Pre-Deployment Checklist

- [ ] Add your photo: `assets/Ayush.png`
- [ ] Add your resume: `assets/Ayush_Jaiswal_Resume.pdf`
- [ ] Add certificates to `assets/certificates/`
- [ ] Set up MongoDB Atlas database
- [ ] Configure environment variables
- [ ] Test locally first

## 🔧 Environment Variables Needed

```bash
NODE_ENV=production
MONGODB_URI=your_mongodb_connection
FRONTEND_URL=your_frontend_url
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

## 🎉 That's It!

Your portfolio will be live and ready to impress employers!

**Need help?** Check the full `DEPLOYMENT.md` guide.
