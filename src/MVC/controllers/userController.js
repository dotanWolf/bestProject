const userService = require("../services/UserService");

const createNewUser = (req, res) => {
  var newUser = null;
  if (!req.body)
    return res
      .status(400)
      .json({ error: "must provide a json with user fields" });
  try {
    newUser = userService.createUser(req.body);
  } catch (error) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  res.status(201).location(`/api/users/${newUser.userId}`).json(newUser);
};

const getUser = (req, res) => {
  const userIdFromUrl = req.params.id;
  const authenticatedUserId = req.user.userId; // From the JWT payload

  // SECURITY CHECK: Is the person asking for the data the same person in the token?
  if (userIdFromUrl !== authenticatedUserId) {
    return res
      .status(403)
      .json({ error: "Unauthorized: You cannot access other users' data" });
  }
  var user = null;
  try {
    user = userService.getUserById(userIdFromUrl);
  } catch (error) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  res.status(200).json(user);
};

module.exports = {
  createNewUser,
  getUser,
};
