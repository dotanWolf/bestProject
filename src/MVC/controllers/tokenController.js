const User = require("../models/User");
const UserRepositery = require("../repositeries/UserRepositery");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createJWT = async (req, res) => {
  //authenticate user
  if (!req.body)
    return res
      .status(400)
      .json({ error: "must provide a json with user fields" });
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email and password required" });
  // get users information from database
  const users = await UserRepositery.getAllUsers();
  connectedUsers = users.filter(
    (user) => user.email == email && user.password == password
  );
  if (connectedUsers.length > 0) {
    // user exists give him a jwt
    const data = {
      email: connectedUsers[0].email,
      userId: connectedUsers[0].id, // Assuming your user object has an id
    };
    const token = jwt.sign(data, process.env.JWT_SECRET);

    // Send both to the frontend
    return res.status(201).json({
      token,
      userId: connectedUsers[0].id,
    });
  }
  // user doesnt exist
  return res.status(404).json({ error: "user doesnt exist" });
};

const doesEmailExist = async (req, res) => {
  return res
    .status(200)
    .json({ exists: await UserRepositery.existsByEmail(req.params.email) });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET);
      req.user = data;
      return next();
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
  } else return res.status(403).send("Token required");
};

module.exports = {
  createJWT,
  doesEmailExist,
  authenticateToken
};
