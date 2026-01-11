const User = require("../models/User");
const UserRepositery = require("../repositeries/UserRepositery")

const doesUserExist = (req, res) => {
    if (!req.body)
        return res.status(400).json({error: "must provide a json with user fields"})
    const {email, password } = req.body
    if (!email || !password)
        return res.status(400).json({error: 'email and password required'})
    const users = Array.from(UserRepositery.users.values());
    connectedUsers = users.filter(user =>
        user.email == email && user.password == password
    )
    if (connectedUsers.length > 0) {
        // user exist return its id
        const idsOnly = connectedUsers.map(user => ({ token: user.id }));
        return res.status(200).json(idsOnly[0]);
    }
    return res.status(404).json({error: 'user doesnt exist'})
}

const doesEmailExist = (req, res) => {
    return res.status(200).json({exists: UserRepositery.existsByEmail(req.params.email)})
}

module.exports = {
    doesUserExist,
    doesEmailExist
}