const userRepository = require('../repositeries/UserRepositery');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

class UserService {
    getUserByEmail(email) {
        const user = userRepository.findByEmail(email)
        if (!user) {
            const error = new Error("user not found")
            error.statusCode = 404
            throw error
        }
        return user.id
    }

    
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

        return {
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