import userModel from '../models/user.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';
import {sendVerificationEmail} from '../utils/mail.js';

export async function register(req, res) {
    const { email, username, password, role } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Username and password required',
                                    received: req.body});
    }

    // Assign roleId based on role string (default to Regular User)
    const roleId = role === 'Admin' ? 2 : 1;

    try {
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        const newUser = await userModel.createUser(email, username, password, roleId);
        res.status(201).json({ message: 'User created', userId: newUser.id });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'email and password required',
                                    received: req.body});
    }

    try {
        const user = await userModel.findByEmail(email);
        if (!user) {
            console.log('Login attempt for non-existent email:', email);
            return res.status(401).json({ error: 'Invalid credentials' ,
                                        suggestion: 'No user found with this email'});
        }

        if (password !== user.passwordHash) {
            console.log('Password mismatch for user:', email);
            return res.status(401).json({ error: 'Invalid credentials',
                                        suggestion: 'Check your password'});
        }

        const cod = Math.floor(100000 + Math.random()* 900000).toString();
        await sendVerificationEmail(user.email, cod);
        
        const token = jwt.sign({ id: user.id, roleId: user.roleId }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
