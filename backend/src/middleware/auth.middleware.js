import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized - No token provided',
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized - Invalid token',
            });
        }

        // Find the user by ID from the token
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Attach user to request object
        req.user = user;

        next();
    } catch (error) {
        console.error('Error in authenticateUser middleware:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};
