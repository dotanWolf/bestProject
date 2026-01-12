const userRepository = require('../repositeries/UserRepositery');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

class UserService {
    createUser(userData) {
        // Validate user data
        const validationErrors = User.validate(userData);
        if (validationErrors.length > 0) {
            const error = new Error(validationErrors.join(', '));
            error.statusCode = 400;
            throw error;
        }

        // Check if email exists
        if (userRepository.existsByEmail(userData.email)) {
            const error = new Error("a user already exists with this email");
            error.statusCode = 409;
            throw error;
        }

        // Create user
        const newUser = userRepository.create(userData);

        // --- JWT GENERATION USING .ENV ---
        const token = jwt.sign(
            { 
                id: newUser.id, 
                email: newUser.email,
                username: newUser.username 
            }, 
            process.env.JWT_SECRET, // <--- Reads from .env file
            { expiresIn: '24h' }
        );

        return {
            token: token,
            userId: newUser.id,
            username: newUser.username
        };
    }

    getUserById(id) {
        const user = userRepository.findById(id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return user;
    }

    updateUser(id, updates) {
        const user = userRepository.update(id, updates);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return user;
    }
}

module.exports = new UserService();