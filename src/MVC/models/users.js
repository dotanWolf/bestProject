var users = []
// var numUsers = users.length

const getUser = (id) => {
    return users.filter((user) => user.userid == id)[0]
}

const createNewUser = (username, email, password, image, userid) => {
    if (!getUser(userid)) {
        // there doesnt exist a user with userid,
        // a new user can be created
        const newUser = {username, email, password, image, userid}
        users.push(newUser)
        return newUser
    }
    return null      
}
const doesUserExist = (username, password) => {
    return users.filter((user) => {
        return user.username === username && user.password === password;
    });
};

module.exports = { 
    getUser,
    createNewUser,
    doesUserExist
}