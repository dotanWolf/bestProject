const User = require('../models/User');
const crypto = require('crypto')

class UserRepository {
  constructor() {
    this.users = new Map();
  }

  create(userData) {
    const user = new User({
      id: crypto.randomUUID(),
      ...userData
    });
    this.users.set(user.id, user);
    return user;
  }

  findById(id) {
    return this.users.get(id) || null;
  }

  findByEmail(email) {
    const users = Array.from(this.users.values());
    return users.find(user => user.email === email) || null;
  }

  findAll() {
    return Array.from(this.users.values());
  }

  existsByEmail(email) {
    return this.findByEmail(email) !== null;
  }
}

// Singleton pattern - single instance for in-memory storage
module.exports = new UserRepository();