const userRepository = require('../repositeries/UserRepositery');
const User = require('../models/User');

class UserService {
    createUser(userData) {
        // Validate user data
        const validationErrors = User.validate(userData);
        if (validationErrors.length > 0) {
            const error = new Error(validationErrors.join(', '));
            error.statusCode = 400;
            throw error;
        }

        // an email is supposed to be unique
        if (userRepository.existsByEmail(userData.email)) {
            const error = new Error("a user already exists with this email");
            error.statusCode = 404;
            throw error;
        }

        // Create user
        return userRepository.create(userData);
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

// Singleton pattern
module.exports = new UserService();