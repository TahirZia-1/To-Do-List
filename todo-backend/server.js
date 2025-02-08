require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'your-secret-key'; // Replace with a secure key

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL
}));
app.use(express.json());

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign({ user_id: user.user_id, username: user.username }, SECRET_KEY, {
    expiresIn: '1h',
  });
};

// Sign Up
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $1', [username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    // Generate JWT
    const token = generateToken(newUser.rows[0]);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server error');
  }
});

// Log In
app.post('/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    console.log('Login attempt for username:', usernameOrEmail); // Debug log

    // Input validation
    if (!usernameOrEmail || !password) {
      console.log('Missing username or password'); // Debug log
      return res.status(400).json('Username and password are required');
    }

    // Check if user exists
    const user = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $1', [usernameOrEmail]);
    if (user.rows.length === 0) {
      console.log('User not found'); // Debug log
      return res.status(401).json('Invalid credentials');
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      console.log('Invalid password'); // Debug log
      return res.status(401).json('Invalid credentials');
    }

    // Generate JWT
    const token = generateToken(user.rows[0]);
    console.log('Login successful, token generated'); // Debug log

    // Send response with token and user info
    res.json({
      token,
      user: {
        user_id: user.rows[0].user_id,
        username: user.rows[0].username
      }
    });
  } catch (err) {
    console.error('Server error during login:', err.message);
    res.status(500).json('Server error');
  }
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    console.log('No token provided'); // Debug log
    return res.status(401).json('Access denied');
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    console.log('Token verified successfully'); // Debug log
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message); // Debug log
    return res.status(403).json('Invalid token');
  }
};

// Get all tasks for the logged-in user
app.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [req.user.user_id]);
    res.json(tasks.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Add a new task for the logged-in user
app.post('/tasks', authenticateToken, async (req, res) => {
  try {
    const { description } = req.body;
    const newTask = await pool.query(
      'INSERT INTO tasks (description, user_id) VALUES ($1, $2) RETURNING *',
      [description, req.user.user_id]
    );
    res.json(newTask.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Update a task (handles both description and completion status)
app.put('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { description, completed } = req.body;
    
    // Get the current task
    const currentTask = await pool.query(
      'SELECT * FROM tasks WHERE task_id = $1 AND user_id = $2',
      [id, req.user.user_id]
    );

    if (currentTask.rows.length === 0) {
      return res.status(404).json('Task not found');
    }

    // Update the task based on what was provided
    let query;
    let values;

    if (description !== undefined && completed !== undefined) {
      // Both description and completed status provided
      query = `
        UPDATE tasks 
        SET description = $1, completed = $2 
        WHERE task_id = $3 AND user_id = $4 
        RETURNING *
      `;
      values = [description, completed, id, req.user.user_id];
    } else if (description !== undefined) {
      // Only description provided
      query = `
        UPDATE tasks 
        SET description = $1 
        WHERE task_id = $2 AND user_id = $3 
        RETURNING *
      `;
      values = [description, id, req.user.user_id];
    } else if (completed !== undefined) {
      // Only completed status provided
      query = `
        UPDATE tasks 
        SET completed = $1 
        WHERE task_id = $2 AND user_id = $3 
        RETURNING *
      `;
      values = [completed, id, req.user.user_id];
    }

    const updateTask = await pool.query(query, values);
    res.json(updateTask.rows[0]);
  } catch (err) {
    console.error('Error updating task:', err.message);
    res.status(500).json('Server error');
  }
});

// Delete a task for the logged-in user
app.delete('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTask = await pool.query(
      'DELETE FROM tasks WHERE task_id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.user_id]
    );
    res.json(deleteTask.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Root route
app.get('/', (req, res) => {
  res.send('To-Do List Backend is running!');
});

// In server.js
app.get('/me', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching user data for ID:', req.user.user_id); // Debug log
    const user = await pool.query('SELECT user_id, username FROM users WHERE user_id = $1', [req.user.user_id]);
    
    if (user.rows.length === 0) {
      console.log('User not found in database'); // Debug log
      return res.status(404).json('User not found');
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error('Error in /me endpoint:', err.message);
    res.status(500).json('Server error');
  }
});

// Add a test endpoint to verify authentication
app.get('/verify-auth', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Authentication successful',
    user: req.user 
  });
});