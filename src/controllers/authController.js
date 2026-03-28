import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users } from '../data/store.js';

// 1. User Registration
export const register = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: "Empty Request Body",
                message: "Please provide email, password, and role in the JSON body."
            });
        }

        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Missing Credentials",
                message: "Email and password are required fields."
            });
        }

        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ error: "User already registered with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: Date.now().toString(),
            email,
            password: hashedPassword,
            role: role || 'attendee'
        };

        // FIXED: Using 'newUser' instead of 'newEvent'
        users.push(newUser);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("DEBUG - Registration Error:", error);
        res.status(500).json({ error: "Server error during registration" });
    }
};

// 2. User Login (Ensure 'export' is here)
export const login = async (req, res) => {
    try {
        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).json({ error: "Email and password are required for login" });
        }

        const { email, password } = req.body;

        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // SIGN JWT using the secret from .env
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({ token });
    } catch (error) {
        console.error("DEBUG - Login Error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
};
