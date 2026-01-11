export const emailValidator = async (email) => {
    // validate email format
    const indexOfAt = email.indexOf('@')
    if (indexOfAt <= 0) return false
    if (email.substr(indexOfAt + 1) != "gmail.com") return false

    // check if email exists already
    try {
        const response = await fetch(`http://localhost:8080/api/tokens/${email}`)
        const data = await response.json()
        if (data.exists) return false
    } catch (error) {
        return false
    }
    
    // if passes both its valid
    return true
}

export const passwordValidator= (password) => {
    const length = password.length
    if (password.charAt(0) == ' ' || password.charAt(length - 1) == ' ') return false;
    if (length < 8) return false
    return true
}

export const usernameValidator = (username) => {
    return username
}