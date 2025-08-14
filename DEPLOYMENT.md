# Deployment Guide

This guide explains how to deploy your portfolio website to various hosting platforms.

## 📁 Required Assets

Before deploying, make sure you have these files in the `assets/` folder:

- `Ayush.png` - Your profile photo (300x300px or larger, square format)
- `Ayush_Jaiswal_Resume.pdf` - Your resume in PDF format
- `cert-dsa.jpg` - DSA MasterMind certificate image
- `cert-sparkiit.jpg` - SparkIIT certificate image
- `cert-codeforbharat.jpg` - Code for Bharat certificate image
- `favicon.ico` - Website favicon (16x16px icon file)

## 🚀 Deployment Options

### 1. GitHub Pages (Free)

1. **Create a GitHub Repository**:
   - Go to [GitHub.com](https://github.com) and create a new repository
   - Name it `your-username.github.io` for personal site or any name for project site

2. **Upload Files**:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/repository-name.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click Save

4. **Access Your Site**:
   - Your site will be available at `https://yourusername.github.io/repository-name`

### 2. Vercel (Free Tier Available)

1. **Connect Repository**:
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Import your repository

2. **Deploy**:
   - Vercel will automatically build and deploy
   - No configuration needed for static sites
   - Auto-deploys on every git push

3. **Custom Domain** (Optional):
   - Add your custom domain in project settings
   - Update DNS records as instructed

### 3. Netlify (Free Tier Available)

1. **Drag & Drop Method**:
   - Go to [Netlify.com](https://netlify.com)
   - Drag your project folder to the deploy area
   - Site will be live immediately

2. **Git Integration**:
   - Connect your GitHub repository
   - Automatic deployments on every push
   - Built-in form handling for contact form

3. **Custom Domain**:
   - Add custom domain in site settings
   - Free SSL certificate included

### 4. Firebase Hosting (Free Tier Available)

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Project**:
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Deploy**:
   ```bash
   firebase deploy
   ```

### 5. Traditional Web Hosting

For shared hosting or VPS:

1. **Prepare Files**:
   - Ensure all assets are in place
   - Test locally first

2. **Upload via FTP**:
   - Use FileZilla or similar FTP client
   - Upload all files to public_html or www folder

3. **Set Permissions**:
   - Ensure files have proper read permissions
   - Check .htaccess if needed for redirects

## 🔧 Pre-Deployment Checklist

- [ ] All asset files are present in `/assets/` folder
- [ ] Profile photo (`Ayush.png`) is optimized and properly sized
- [ ] Resume PDF is current and accessible
- [ ] Certificate images are clear and properly named
- [ ] All external links are working
- [ ] Contact information is accurate
- [ ] Social media links are updated
- [ ] Meta tags are customized
- [ ] Favicon is created and placed
- [ ] Site tested on mobile devices
- [ ] All images have alt text for accessibility
- [ ] Contact form is tested

## 📱 Testing Before Deployment

1. **Local Testing**:
   - Open `index.html` in web browser
   - Test on different screen sizes
   - Check all links and buttons
   - Verify contact form functionality

2. **Cross-Browser Testing**:
   - Chrome
   - Firefox
   - Safari
   - Edge

3. **Mobile Testing**:
   - Use browser dev tools
   - Test on actual mobile devices
   - Check touch interactions

4. **Performance Testing**:
   - Use Google PageSpeed Insights
   - Check image optimization
   - Verify loading times

## 🔄 Updating Your Portfolio

### Content Updates

1. **Projects**: Edit project cards in `index.html`
2. **Skills**: Update skill pills in the skills section
3. **About**: Modify bio and education information
4. **Contact**: Update contact details throughout the site

### Adding New Projects

```html
<!-- Add this to the projects grid in index.html -->
<div class="project-card animate-slide-up">
    <div class="project-header">
        <h3 class="project-title">New Project Name</h3>
        <div class="project-type">Project Type</div>
    </div>
    <p class="project-description">Project description here...</p>
    <div class="project-tech">
        <span class="tech-tag">Technology 1</span>
        <span class="tech-tag">Technology 2</span>
    </div>
    <div class="project-links">
        <a href="github-link" target="_blank" class="project-link">
            <i class="fab fa-github"></i> Code
        </a>
        <a href="demo-link" class="project-link">
            <i class="fas fa-external-link-alt"></i> Demo
        </a>
    </div>
</div>
```

### Adding New Certificates

```html
<!-- Add this to the certificates grid in index.html -->
<div class="certificate-card animate-slide-up">
    <div class="certificate-image">
        <img src="./assets/new-cert.jpg" alt="Certificate Description" onclick="openModal(this)">
        <div class="certificate-overlay">
            <i class="fas fa-search-plus"></i>
        </div>
    </div>
    <div class="certificate-content">
        <h3>Certificate Name</h3>
        <p>Certificate Description</p>
        <a href="./assets/new-cert.jpg" download class="download-btn">
            <i class="fas fa-download"></i> Download
        </a>
    </div>
</div>
```

## 🎨 Customization Tips

### Color Scheme
Update CSS variables in `styles.css`:
```css
:root {
    --primary-color: #YourColor;
    --accent-color: #YourAccentColor;
}
```

### Fonts
Change Google Fonts import in HTML head:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Images
- Profile photo: 300x300px minimum, square format
- Certificates: 1200x800px for best quality
- Compress images using tools like TinyPNG

## 🔍 SEO Optimization

1. **Update Meta Tags**:
   - Title should include your name and profession
   - Description should be compelling and under 160 characters
   - Keywords should be relevant to your skills

2. **Image Optimization**:
   - Use descriptive file names
   - Add proper alt text
   - Compress images for faster loading

3. **Content Quality**:
   - Write engaging project descriptions
   - Use relevant keywords naturally
   - Keep content fresh and updated

## 📊 Analytics Setup

### Google Analytics 4

1. Create GA4 property
2. Get tracking code
3. Add to `<head>` section of `index.html`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🚨 Troubleshooting

### Common Issues

1. **Images not loading**:
   - Check file paths are correct
   - Ensure files are properly uploaded
   - Verify file names match exactly

2. **Contact form not working**:
   - Ensure email client is set up
   - Check mailto link format
   - Consider using Netlify Forms or similar service

3. **Mobile layout issues**:
   - Test on actual devices
   - Use browser dev tools
   - Check media queries in CSS

4. **Slow loading**:
   - Compress images
   - Minimize CSS/JS
   - Use browser caching

## 📞 Support

If you encounter issues during deployment:

1. Check the hosting platform's documentation
2. Search for specific error messages
3. Test locally first to isolate issues
4. Contact support if using paid hosting services

---

**Good luck with your deployment! 🚀**
