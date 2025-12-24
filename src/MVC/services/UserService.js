/**
 * User Service
 * Contains business logic for user operations (Single Responsibility Principle)
 */
const userRepository = require('../repositories/userRepository');
const User = require('../models/User');

class UserService {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {User} Created user
   * @throws {Error} If validation fails or user exists
   */
  createUser(userData) {
    // Validate user data
    const validationErrors = User.validate(userData);
    if (validationErrors.length > 0) {
      const error = new Error(validationErrors.join(', '));
      error.statusCode = 400;
      throw error;
    }

    // Check if username already exists
    if (userRepository.existsByUsername(userData.username)) {
      const error = new Error('Username already exists');
      error.statusCode = 400;
      throw error;
    }

    // Create user
    return userRepository.create(userData);
  }

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {User} User object
   * @throws {Error} If user not found
   */
  getUserById(id) {
    const user = userRepository.findById(id);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    return user;
  }

  /**
   * Get user by username
   * @param {string} username - Username
   * @returns {User|null} User object or null
   */
  getUserByUsername(username) {
    return userRepository.findByUsername(username);
  }

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} updates - Fields to update
   * @returns {User} Updated user
   * @throws {Error} If user not found
   */
  updateUser(id, updates) {
    const user = userRepository.update(id, updates);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    return user;
  }

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {boolean} Success status
   * @throws {Error} If user not found
   */
  deleteUser(id) {
    const user = userRepository.findById(id);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    return userRepository.delete(id);
  }

  /**
   * Get all users
   * @returns {User[]} Array of users
   */
  getAllUsers() {
    return userRepository.findAll();
  }
}

// Singleton pattern
module.exports = new UserService();