import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables from .env file
dotenv.config();

// Store in environment variable
const JWT_SECRET = process.env.JWT_SECRET_KEY; 
const JWT_EXPIRES=process.env.JWT_EXPIRES;

// Get all users (no authentication needed here)
export const getAllUser = (req, res) => {
  const sql = "SELECT * FROM user";
  req.db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result);
  });
};

// Add user with hashed password
export const addUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
    const values = [name, email, hashedPassword];

    req.db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json(result);
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

// Login user and generate JWT token
export const loginUser = (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM user WHERE email = ?";
  
  req.db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result[0];
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  });
};

// Fetch & update user based on clicked id
export const getUserById = (req, res) => {
  const sql = "SELECT * FROM user WHERE id = ?";
  req.db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result[0]); 
  });
};

// Update user (must be authenticated)
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updateQuery = `UPDATE user SET name = ?, email = ?, password = ? WHERE id = ?`;
    const values = [name, email, hashedPassword, id];

    req.db.query(updateQuery, values, (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({ message: 'User updated successfully' });
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

// Delete user based on id (must be authenticated)
export const deleteUser = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM user WHERE id = ?";
  
  req.db.query(sql, [id], (err) => {
    if (err) {
      console.error('Delete error:', err); 
      return res.status(500).json(err);
    }
    res.json({ message: 'User deleted successfully.' });
  });
};

//verify user token
export const verifyToken = (req, res) => {
  const { token } = req.body;
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.json({ isValid: false });
    } else {
      // Optionally return user information
      return res.json({ isValid: true, user: decoded.user });
    }
  });
};

