import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'hackforge_fallback_secret_123';

// POST /api/auth/signup
router.post('/signup', [
    body('name', 'Name is required').not().isEmpty(),
    body('username', 'Username is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, username, email, password } = req.body;

    try {
        let userByEmail = await User.findOne({ email });
        let userByUsername = await User.findOne({ username });

        if (userByEmail || userByUsername) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = new User({
            name,
            username,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ 
                success: true,
                token, 
                user: { id: user.id, name: user.name, username: user.username, email: user.email } 
            });
        });

    } catch (err) {
        console.error('Signup error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/auth/signin
router.post('/signin', [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            return res.json({ 
                success: true,
                token, 
                user: { id: user.id, name: user.name, username: user.username, email: user.email } 
            });
        });

    } catch (err) {
        console.error('Signin error:', err.message);
        return res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/auth/verify
router.get('/verify', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ success: true, user });
    } catch (err) {
        console.error('Verify error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
