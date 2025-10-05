import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import supabase from '../config/database';
import { validateRequest, registerSchema, loginSchema } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Security check: Ensure a proper secret is used in production
if (process.env.NODE_ENV === 'production' && JWT_SECRET === 'fallback_secret_key') {
    console.error('FATAL ERROR: JWT_SECRET is not set in production environment.');
    process.exit(1);
}

// Register new user
router.post('/register', validateRequest(registerSchema), async (req, res) => {
    try {
        const { email, password, first_name, last_name, role } = req.body;

        // Check if user already exists in the 'citizen' table
        const { data: existingUser } = await supabase
            .from('citizen')
            .select('citizen_id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash password before saving
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Create user in the 'citizen' table
        const { data: newUser, error: userError } = await supabase
            .from('citizen')
            .insert({
                email,
                password_hash,
                first_name,
                last_name,
                role: role || 'citizen',
            })
            .select('citizen_id, email, role, first_name, last_name')
            .single();

        if (userError) {
            console.error('Supabase user creation error:', userError);
            return res.status(500).json({ error: 'Failed to create user' });
        }

        return res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
        });

    } catch (error) {
        console.error('Registration endpoint error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Login user and return JWT
router.post('/login', validateRequest(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data: user, error: userError } = await supabase
            .from('citizen')
            .select('*')
            .eq('email', email)
            .single();

        if (userError || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const tokenPayload = {
            sub: user.citizen_id.toString(),
            role: user.role,
            email: user.email
        };
        
        let token;
        try {
            // FIX: Use a type assertion `as jwt.SignOptions` to resolve the TypeScript overload error.
            token = jwt.sign(tokenPayload, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN,
            } as jwt.SignOptions);
        } catch (jwtError) {
            console.error('JWT signing error:', jwtError);
            return res.status(500).json({ error: 'Failed to generate authentication token' });
        }

        // Exclude password hash from the returned user object
        const { password_hash, ...userData } = user;

        return res.json({
            message: 'Login successful',
            token,
            user: userData,
        });

    } catch (error) {
        console.error('Login endpoint error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current user profile using a valid token
router.get('/profile', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = parseInt(req.user!.sub, 10);

        const { data: user, error: userError } = await supabase
            .from('citizen')
            .select('*')
            .eq('citizen_id', userId)
            .single();

        if (userError || !user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password_hash, ...userData } = user;
        return res.json({ user: userData });

    } catch (error) {
        console.error('Profile fetch error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Verify a token is valid and return its payload
router.get('/verify', authenticateToken, (req: AuthRequest, res) => {
    // If authenticateToken middleware passes, the token is valid.
    res.json({
        valid: true,
        user: {
            id: req.user!.sub,
            role: req.user!.role,
            email: req.user!.email
        }
    });
});

export default router;

