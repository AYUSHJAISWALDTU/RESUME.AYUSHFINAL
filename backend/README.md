# Ayush Portfolio Backend

Backend API for Ayush Jaiswal's Portfolio Website built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Contact Form API** - Handle contact form submissions with email notifications
- **Projects Management** - CRUD operations for portfolio projects
- **Skills Management** - Manage technical skills and categories
- **Certificates Management** - Handle certifications and achievements
- **Admin Dashboard** - Protected admin routes with JWT authentication
- **Email Integration** - Automated email responses using Nodemailer
- **Data Validation** - Input validation using express-validator
- **Security** - Helmet, CORS, rate limiting protection
- **Database** - MongoDB with Mongoose ODM

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Gmail account (for email functionality)

## 🛠️ Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ayush-portfolio
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   JWT_SECRET=your-secret-key
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   ```

4. **Start MongoDB**:
   ```bash
   # For local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud service
   ```

5. **Seed the database** (optional):
   ```bash
   npm run seed
   ```

6. **Start the server**:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The API will be available at `http://localhost:5000`

## 📚 API Endpoints

### Public Endpoints

#### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contacts (admin only)

#### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `GET /api/projects?featured=true` - Get featured projects
- `GET /api/projects?limit=3` - Get limited projects

#### Skills
- `GET /api/skills` - Get all skills grouped by category
- `GET /api/skills?category=Programming Languages` - Get skills by category
- `GET /api/skills/categories` - Get all categories
- `GET /api/skills/:id` - Get single skill

#### Certificates
- `GET /api/certificates` - Get all certificates
- `GET /api/certificates/:id` - Get single certificate
- `GET /api/certificates?featured=true` - Get featured certificates
- `GET /api/certificates/categories` - Get certificate categories

### Admin Endpoints (Protected)

#### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/verify` - Verify token

#### Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics

#### Contact Management
- `GET /api/admin/contacts` - Get all contacts with pagination
- `PUT /api/admin/contacts/:id` - Update contact status
- `DELETE /api/admin/contacts/:id` - Delete contact

#### Projects Management
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `PUT /api/projects/:id/featured` - Toggle featured status

#### Skills Management
- `POST /api/skills` - Create skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill
- `PUT /api/skills/:id/toggle` - Toggle active status

#### Certificates Management
- `POST /api/certificates` - Create certificate
- `PUT /api/certificates/:id` - Update certificate
- `DELETE /api/certificates/:id` - Delete certificate
- `PUT /api/certificates/:id/featured` - Toggle featured status
- `PUT /api/certificates/:id/verify` - Toggle verification status

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for admin authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

## 📧 Email Configuration

For email functionality, you'll need to configure Gmail SMTP:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in the `EMAIL_PASS` environment variable

## 🗃️ Database Schema

### Contact
```javascript
{
  name: String,
  email: String,
  message: String,
  status: String, // 'new', 'read', 'replied'
  timestamps: true
}
```

### Project
```javascript
{
  title: String,
  description: String,
  type: String,
  technologies: [String],
  githubUrl: String,
  demoUrl: String,
  featured: Boolean,
  status: String // 'active', 'inactive', 'archived'
}
```

### Skill
```javascript
{
  name: String,
  category: String,
  proficiency: Number, // 1-10
  yearsOfExperience: Number,
  isActive: Boolean
}
```

### Certificate
```javascript
{
  title: String,
  description: String,
  issuer: String,
  issueDate: Date,
  category: String,
  featured: Boolean,
  verified: Boolean
}
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Test API endpoints using tools like:
- Postman
- Insomnia
- curl commands

Example curl request:
```bash
# Get all projects
curl http://localhost:5000/api/projects

# Submit contact form
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Test message"}'
```

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-app-password
JWT_SECRET=your-super-secure-secret-key
FRONTEND_URL=https://your-domain.com
```

### Deploy to Heroku

1. Create Heroku app:
   ```bash
   heroku create ayush-portfolio-api
   ```

2. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set EMAIL_USER=your-email
   # ... set other variables
   ```

3. Deploy:
   ```bash
   git push heroku main
   ```

### Deploy to Railway

1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically

### Deploy to DigitalOcean App Platform

1. Create new app from GitHub repository
2. Set environment variables
3. Deploy

## 📊 Monitoring

### Health Check
- `GET /api/health` - API health status

### Dashboard Statistics
The admin dashboard provides:
- Total contacts and new messages
- Active projects count
- Skills and certificates count
- System information

## 🔧 Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
npm test           # Run test suite
```

## 🛡️ Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Prevent abuse
- **Input Validation** - Validate all inputs
- **JWT Authentication** - Secure admin routes
- **Environment Variables** - Sensitive data protection

## 📝 Sample API Responses

### Get Projects
```json
{
  "success": true,
  "count": 7,
  "data": [
    {
      "_id": "...",
      "title": "Raksha360",
      "description": "A comprehensive safety application...",
      "type": "iOS Application",
      "technologies": ["Swift", "Xcode", "iOS"],
      "featured": true,
      "status": "active"
    }
  ]
}
```

### Submit Contact
```json
{
  "success": true,
  "message": "Message sent successfully! I'll get back to you soon.",
  "data": {
    "id": "...",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## 📞 Support

For issues or questions:
- Email: ayushjaiswa00004@gmail.com
- GitHub: [AYUSHJAISWALDTU](https://github.com/AYUSHJAISWALDTU)

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ by Ayush Jaiswal
