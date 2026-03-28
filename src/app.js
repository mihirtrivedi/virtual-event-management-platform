import express from 'express';
import dotenv from 'dotenv';
import eventRoutes from './routes/eventRoutes.js';
import authRoutes from './routes/authRoutes.js';

// 1. Load environment variables from .env
dotenv.config();

const app = express();

// 2. Middleware to parse JSON bodies
app.use(express.json());

// --- ADDED: Catch JSON Syntax Errors ---
// This handles cases where the user sends invalid/malformed JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: "Invalid JSON",
            message: "The JSON body provided is malformed or empty."
        });
    }
    next();
});

// 3. Mount Routes
app.use('/events', eventRoutes); // Event CRUD & Registration
app.use('/', authRoutes);        // /register and /login

// 4. Basic Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 5. Start the server
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
}

export default app;
