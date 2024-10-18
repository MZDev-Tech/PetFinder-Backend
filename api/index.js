import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
// Import routes
import categoryRoutes from '../Routes/CategoryRoute.js';
import PetRoutes from '../Routes/PetsRoute.js';
import ShelterRoutes from '../Routes/ShelterRoute.js';
import FeedbackRoutes from '../Routes/FeedbackRoute.js';
import UserRoutes from '../Routes/UserRoute.js';
import ContactRoutes from '../Routes/ContactRoute.js';
import AdminRoutes from '../Routes/AdminRoute.js';
import AdoptionRoutes from '../Routes/AdoptionRoute.js';
import DashboardRoutes from '../Routes/DashboardRoute.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection using pool
const pool = mysql.createPool({
  connectionLimit: 10, // You can adjust the limit based on your needs
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Make the pool connection available to all routes
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Initialize multer for file uploads
const upload = multer({
  dest: 'uploads/',
});

// Routes for different pages
app.use('/api/categories', categoryRoutes);
app.use('/api/Pets/', PetRoutes);
app.use('/api/shelters/', ShelterRoutes);
app.use('/api/feedback/', FeedbackRoutes);
app.use('/api/user/', UserRoutes);
app.use('/api/contact/', ContactRoutes);
app.use('/api/admin/', AdminRoutes);
app.use('/api/adoption/', AdoptionRoutes);
app.use('/api/Dashboard/', DashboardRoutes);

// Error handling for database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
    connection.release();
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
