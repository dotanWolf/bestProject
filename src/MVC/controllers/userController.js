const userService = require('../services/UserService')

const createNewUser = (req, res) => {
    var newUser = null
    if (!req.body)
        return res.status(400).json({error: "must provide a json with user fields"})
    try {
        newUser = userService.createUser(req.body)
    } catch (error) {
        return res.status(error.statusCode).json({error: error.message})
    }
    res.status(201).location(`/api/users/${newUser.id}`).end()
}   

const getUser = (req, res) => {
    const userId = req.params.id
    var user = null
    try {
        user = userService.getUserById(userId)
    } catch (error) {
        return res.status(error.statusCode).json({error: error.message})
    }
    res.status(200).json(user)
}

module.exports = {
    createNewUser,
    getUser
}