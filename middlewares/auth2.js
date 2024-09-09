const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Please sign-up or log-in to continue.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.jwt_secret);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Session expired, please log-in again to continue.' });
    }
};

module.exports = authenticateUser;
