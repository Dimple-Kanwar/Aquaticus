const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../utils/error').default;

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            throw new ErrorHandler(401, 'Authentication token required');
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) throw new ErrorHandler(403, 'Invalid or expired token');
            req.user = user;
            next();
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { authenticateToken };