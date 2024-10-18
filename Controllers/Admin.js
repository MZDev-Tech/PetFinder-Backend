import dotenv from 'dotenv';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

// Initialize multer for file uploads
const upload = multer({
  dest: 'uploads/', 
});

// Use environment variables for JWT
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Get all admin data
export const getAdmin = (req, res) => {
  const sql = "SELECT * FROM admin";
  req.db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.json(result);
  });
};

// Admin login logic
export const adminLogin = (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM admin WHERE email = ?";

  req.db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const admin = result[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: "Login successful", token });
  });
};

// Fetch & update admin based on ID
export const getAdminById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM admin WHERE id = ?";

  req.db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.json(result[0]);
  });
};

// Update admin details
export const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const newImage = req.file ? req.file.filename : null;

  try {
    // Select current data (including password) from DB
    const getCurrentAdminQuery = "SELECT * FROM admin WHERE id = ?";
    req.db.query(getCurrentAdminQuery, [id], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Admin not found" });
      }

      const currentAdmin = result[0];
      const imageToUse = newImage || currentAdmin.image;

      // If password is provided, hash it; otherwise, use the existing password
      const passwordToUse = password ? await bcrypt.hash(password, 10) : currentAdmin.password;

      // Update admin details
      const updateQuery = "UPDATE admin SET name = ?, email = ?, password = ?, image = ? WHERE id = ?";
      const values = [name, email, passwordToUse, imageToUse, id];

      req.db.query(updateQuery, values, (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }
        res.json({ message: 'Admin updated successfully' });
      });
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};




export const Logout = (req, res) => {

    res.json({ message: 'Logged out successfully' });
  };