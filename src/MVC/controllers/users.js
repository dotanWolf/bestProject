const models = require('../models/users')

const createNewUser = (req, res) => {
    // Individual fields
    const { username, password } = req.body;
     if (!username || !password)
        return res.status(400).json({ error: 'user data required' })
    newUser = models.createNewUser(username, password)
    res.status(201).location(`/api/users/${newUser.id}`).end()
}   

const getUser = (req, res) => {
        const user = models.getUser(parseInt(req.params.id))
    if (!user)
        return res.status(404).json({ error: 'user not found' })
    res.status(200).json(user)
}

module.exports = {
    createNewUser,
    getUser
}