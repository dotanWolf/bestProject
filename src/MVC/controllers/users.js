const models = require('../models/users')

const createNewUser = (req, res) => {
    // Individual fields
    const { username, email, password, image } = req.body;
    // fields must not be empty

    // reform required!!!!
    if (!username) {
        return res.status(400).json({ error: 'username required' })
    }
    if (!email) {
        return res.status(400).json({ error: 'email required' })
    }
    if (!password) {
        return res.status(400).json({ error: 'password required' })
    }
    if (!username) {
        return res.status(400).json({ error: 'username required' })
    }

    userid = isEmailValid(email)
    if (userid == "") {
        console.log(`userid is ${userid}`)
        return res.status(400).json({ error: 'invalid email format' })
    }
        
    newUser = models.createNewUser(username, email, password, image, userid)
    if(!newUser)
        return res.status(404).json({ error: 'a user already exist with this email address' })
    res.status(201).location(`/api/users/${userid}`).end()
}   

const getUser = (req, res) => {
    const user = models.getUser(req.params.id)
    if (!user)
        return res.status(404).json({ error: 'user not found' })
    res.status(200).json(user)
}

// gets an email address, check if its of the form
// _@gmail.com, if so returns _ as the unique id of the user
// otherwise return empty string
const isEmailValid = (email) => {
    atIndex = email.indexOf('@');
    if (atIndex == -1) {
        // invalid, doesnt contain ""
        return ""
    }
    if (atIndex == 0) {
        // invalid, @ is the first character
        return ""
    }
    substr = email.substring(atIndex + 1)
    if (substr != "gmail.com") {
        // invalid format
        return ""
    }
    return email.substring(0, atIndex)
}

module.exports = {
    createNewUser,
    getUser
}