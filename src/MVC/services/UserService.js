const userRepository = require("../repositeries/UserRepositery");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

class UserService {
  async getUserByEmail(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }
    return user.id;
  }

  async createUser(userData) {
    console.log("Creating user with data:", userData);
    if (!userData.email) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      throw error;
    }

    // Check if email exists
    if (await userRepository.existsByEmail(userData.email)) {
      const error = new Error("a user already exists with this email");
      error.statusCode = 409;
      throw error;
    }
    console.log("Email is unique, proceeding to create user.");

    try {
      const newUser = await userRepository.create(userData);
      return {
        userId: newUser.id,
        username: newUser.username,
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

//   updateUser(id, updates) {
//     const user = userRepository.update(id, updates);
//     if (!user) {
//       const error = new Error("User not found");
//       error.statusCode = 404;
//       throw error;
//     }
//     return user;
//   }
}

module.exports = new UserService();
