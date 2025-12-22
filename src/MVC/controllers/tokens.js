const models = require("../models/users")

const doesUserExist = (req, res) => {
    const {username, password } = req.body
    if (!username || !password)
        return res.status(400).json({error: 'user data required'})
    users = models.doesUserExist(username, password)
    if (users.length > 0) {
        // user exist return its id
        const idsOnly = users.map(user => ({ id: user.id }));
        return res.status(200).json(idsOnly);
    }
    return res.status(200).json({error: 'user doesnt exist'})
}

module.exports = {
    doesUserExist
}