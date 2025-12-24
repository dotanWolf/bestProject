class User {
    // gets a json with specific fields
  constructor({ id, username, password, email, profileImage}) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.profileImage = profileImage || null;
  }


  toJSON() {
    return {
        id: this.id,
        username: this.username,
        password: this.password,
        email: this.email,
        profileImage: this.profileImage
    }
  }

  // static because we want to create the object
  // only after its validated
  static validate(userData) {
    const errors = [];
    
    if (!userData.username) {
      errors.push('Username is required');
    }
    if (!userData.password) {
      errors.push('Password is required');
    }
    if (!userData.name) {
      errors.push('Name is required');
    }
    if (!userData.profileImage) {
      errors.push('profile mage is required');
    }
    return errors;
  }
}

module.exports = User;