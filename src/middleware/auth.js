import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    // 1. Get the header
    const authHeader = req.headers.authorization;

    // 2. Safely check if it exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // 3. Extract the token
    const token = authHeader.split(' ')[1];

    try {
        // 4. Verify using the secret from your .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5. Attach decoded payload (id, email, role) to the request
        req.user = decoded;
        next();
    } catch (err) {
        // Handle expired or tampered tokens
        res.status(401).json({ error: "Invalid or expired token." });
    }
};

export const isOrganizer = (req, res, next) => {
    // Ensure authenticate middleware ran first
    if (!req.user || req.user.role !== 'organizer') {
        return res.status(403).json({ error: "Access denied. Organizers only." });
    }
    next();
};
