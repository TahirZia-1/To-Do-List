const express = require('express');
const passport = require('passport');
const generateJWT = require('../utils/generateJWT');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');
require('dotenv').config();

const router = express.Router();

// Google Routes
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateJWT(req.user);
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  }
);

// Facebook Routes
router.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateJWT(req.user);
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  }
);

// Error handling route
router.get('/auth/error', (req, res) => {
  res.status(401).json({
    error: 'Failed to authenticate',
    message: req.query.message || 'Authentication failed'
  });
});

// Logout route
router.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect(`${process.env.CLIENT_URL}/login`);
});

// Your existing login and signup routes
router.post('/signup', async (req, res) => {
  // Your existing signup logic
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Add more unique identifiers to the token payload
    const token = jwt.sign(
      { 
        id: user.id,                    // Unique user ID
        username: user.username,         // Username
        timestamp: Date.now(),          // Current timestamp
        random: Math.random().toString() // Random value
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Log token info for debugging (remove in production)
    console.log('Generated token for user:', {
      userId: user.id,
      username: user.username,
      tokenFirstChars: token.substring(0, 20) + '...'
    });

    res.json({ token, username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
