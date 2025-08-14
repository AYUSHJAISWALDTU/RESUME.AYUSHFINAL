const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Certificate = require('./models/Certificate');

// Sample data
const sampleProjects = [
  {
    title: "Raksha360",
    description: "A comprehensive safety application for iOS that provides real-time emergency assistance, location tracking, and safety features designed to protect users in various situations.",
    type: "iOS Application",
    technologies: ["Swift", "Xcode", "iOS", "Core Location"],
    githubUrl: "https://github.com/AYUSHJAISWALDTU/Raksha360",
    featured: true,
    order: 1,
    status: "active"
  },
  {
    title: "FarmSuraksha 360",
    description: "An innovative agricultural protection system that uses AI/ML to monitor crop health, predict diseases, and provide farmers with actionable insights for better yield.",
    type: "Agriculture Tech",
    technologies: ["Python", "AI/ML", "Computer Vision", "Flask"],
    githubUrl: "https://github.com/AYUSHJAISWALDTU/FarmSuraksha360",
    featured: true,
    order: 2,
    status: "active"
  },
  {
    title: "University Management System",
    description: "A comprehensive web-based system for managing university operations including student records, course management, faculty administration, and academic tracking.",
    type: "Web Application",
    technologies: ["HTML/CSS", "JavaScript", "MySQL", "PHP"],
    githubUrl: "https://github.com/AYUSHJAISWALDTU/UniversityManagement",
    featured: true,
    order: 3,
    status: "active"
  },
  {
    title: "Blood Bank Management System",
    description: "A digital solution for blood banks to manage donor records, blood inventory, request processing, and facilitate efficient blood donation and distribution processes.",
    type: "Healthcare System",
    technologies: ["SQL", "Database Design", "DBMS", "ER Modeling"],
    githubUrl: "https://github.com/AYUSHJAISWALDTU/BloodBankManagement",
    featured: false,
    order: 4,
    status: "active"
  },
  {
    title: "Railway Management System",
    description: "A comprehensive railway management platform for handling train schedules, ticket booking, passenger management, and route optimization with real-time updates.",
    type: "Transportation System",
    technologies: ["Python", "SQL", "Database Management", "System Design"],
    githubUrl: "https://github.com/AYUSHJAISWALDTU/RailwayManagement",
    featured: false,
    order: 5,
    status: "active"
  },
  {
    title: "RNG Clothing Brand Concept",
    description: "A creative branding and design project for a modern clothing brand, including logo design, brand identity, and marketing materials using contemporary design principles.",
    type: "Design Project",
    technologies: ["Canva", "Brand Design", "UI/UX", "Creative Design"],
    githubUrl: "https://github.com/AYUSHJAISWALDTU/RNGBranding",
    featured: false,
    order: 6,
    status: "active"
  },
  {
    title: "Power of Numbers",
    description: "An insightful presentation exploring statistical analysis, data visualization, and the impact of numbers in decision-making processes across various domains.",
    type: "Data Analysis",
    technologies: ["Statistical Analysis", "Data Visualization", "Python", "Research"],
    githubUrl: "https://github.com/AYUSHJAISWALDTU/PowerOfNumbers",
    featured: false,
    order: 7,
    status: "active"
  }
];

const sampleSkills = [
  // Programming Languages
  { name: "Python", category: "Programming Languages", proficiency: 8, yearsOfExperience: 2, order: 1 },
  { name: "Swift", category: "Programming Languages", proficiency: 7, yearsOfExperience: 1.5, order: 2 },
  { name: "JavaScript", category: "Programming Languages", proficiency: 7, yearsOfExperience: 2, order: 3 },
  { name: "SQL", category: "Programming Languages", proficiency: 8, yearsOfExperience: 2, order: 4 },
  { name: "HTML/CSS", category: "Programming Languages", proficiency: 8, yearsOfExperience: 2.5, order: 5 },
  
  // Tools & Technologies
  { name: "Xcode", category: "Tools & Technologies", proficiency: 7, yearsOfExperience: 1.5, order: 1 },
  { name: "VS Code", category: "Tools & Technologies", proficiency: 9, yearsOfExperience: 2.5, order: 2 },
  { name: "MySQL", category: "Tools & Technologies", proficiency: 8, yearsOfExperience: 2, order: 3 },
  { name: "Canva", category: "Tools & Technologies", proficiency: 7, yearsOfExperience: 1, order: 4 },
  
  // Specializations
  { name: "AI/ML Fundamentals", category: "Specializations", proficiency: 6, yearsOfExperience: 1, order: 1 },
  { name: "DBMS", category: "Specializations", proficiency: 8, yearsOfExperience: 2, order: 2 },
  { name: "ER Modeling", category: "Specializations", proficiency: 8, yearsOfExperience: 1.5, order: 3 },
  { name: "Statistical Analysis", category: "Specializations", proficiency: 7, yearsOfExperience: 1, order: 4 }
];

const sampleCertificates = [
  {
    title: "DSA MasterMind",
    description: "MCQ Elimination Round Certificate",
    issuer: "DSA MasterMind",
    issueDate: new Date("2024-01-15"),
    category: "Technical",
    skills: ["Data Structures", "Algorithms"],
    featured: true,
    verified: true,
    order: 1
  },
  {
    title: "SparkIIT",
    description: "Growth & Operation Certificate",
    issuer: "SparkIIT",
    issueDate: new Date("2024-03-20"),
    category: "Professional",
    skills: ["Operations", "Growth Strategy"],
    featured: true,
    verified: true,
    order: 2
  },
  {
    title: "Code for Bharat",
    description: "Season 2 Hackathon Certificate",
    issuer: "Code for Bharat",
    issueDate: new Date("2024-05-10"),
    category: "Achievement",
    skills: ["Hackathon", "Problem Solving", "Team Work"],
    featured: true,
    verified: true,
    order: 3
  }
];

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ayush-portfolio', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Seed function
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Certificate.deleteMany({});

    // Insert sample data
    await Project.insertMany(sampleProjects);
    await Skill.insertMany(sampleSkills);
    await Certificate.insertMany(sampleCertificates);

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Seeded ${sampleProjects.length} projects`);
    console.log(`🛠️  Seeded ${sampleSkills.length} skills`);
    console.log(`🏆 Seeded ${sampleCertificates.length} certificates`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
