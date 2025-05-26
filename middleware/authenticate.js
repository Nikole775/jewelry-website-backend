/* src/middleware/authenticate.js
export default (req, res, next) => {
    const authHeader = req.headers.authorization;

    // TEMPORARY: Allow any token for development
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Optionally log the token
    console.log("Received token:", authHeader);

    // Skip real token validation for now
    next();
};*/

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; // { id, roleId }
        next();
    });
}

export function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) return res.sendStatus(401);
        console.log("User roleId:", req.user.roleId, "Type:", typeof req.user.roleId);

        // Convert roleId to number to avoid type mismatch
        const userRoleId = Number(req.user.roleId);
        if (!allowedRoles.includes(userRoleId)) {
            return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
        }
        next();
    };
}

export default { authenticateToken };
