const users = []
var numUsers = users.length

const getUser = (id) => {
    return users.filter((user) => user.id == id)[0]
}


const createNewUser = (username, password) => {
    const newUser = {id : ++numUsers, username, password}
    users.push(newUser)
    return newUser
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