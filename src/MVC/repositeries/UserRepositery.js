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

  findByUsername(username) {
    const users = Array.from(this.users.values());
    return users.find(user => user.username === username) || null;
  }

  findAll() {
    return Array.from(this.users.values());
  }

  existsByUsername(username) {
    return this.findByUsername(username) !== null;
  }
}

// Singleton pattern - single instance for in-memory storage
module.exports = new UserRepository();