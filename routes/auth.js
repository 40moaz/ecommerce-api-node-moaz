const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Create a new user account
router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, phone, date_of_birth, profileImage, password } = req.body;
        const user = new User({ fullName, email, phone, date_of_birth, profileImage, password }); // Store password as plain text
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
});

// User login (no password encryption is used)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the provided password with the stored password (plaintext)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token with user ID and set expiration time
        const token = jwt.sign({ userId: user._id }, 'mySuperSecretKey123!@#', { expiresIn: '1h' });

        // Return success message and token
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Failed to login', error: error.message });
    }
});

// Middleware to verify token
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 'mySuperSecretKey123!@#');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
}

// Protected route to fetch current user profile
router.get('/me', verifyToken, async (req, res) => {
    try {
        // Fetch the user details using userId from the token
        const user = await User.findById(req.user.userId).select('-password'); // Exclude password field

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            message: 'User profile fetched successfully',
            user: user
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
    }
});

module.exports = router;
