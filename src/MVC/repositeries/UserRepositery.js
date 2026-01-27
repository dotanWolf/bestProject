const User = require("../models/User"); // This is now your Mongoose Model

class UserRepository {
  // Create a new user in the database
  async create(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      const e = new Error(`${error.message}`);
      e.statusCode = 400;
      throw e;
    }
  }

  // Find a user by their MongoDB _id
  async findById(id) {
    return await User.findById(id);
  }

  // Find a user by email
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  // Get all users
  async findAll() {
    return await User.find({});
  }

  // Check if email is already taken
  async existsByEmail(email) {
    const count = await User.countDocuments({ email: email.toLowerCase() });
    return count > 0;
  }

  async getAllUsers() {
    return await User.find({});
  }
}

module.exports = new UserRepository();
