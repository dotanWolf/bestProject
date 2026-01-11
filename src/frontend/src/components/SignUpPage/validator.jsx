export const emailValidator = async (email) => {
    const indexOfAt = email.indexOf('@');
    if (indexOfAt <= 0) return false;
    if (email.substr(indexOfAt + 1) !== "gmail.com") return false;

    try {
        // We check the users endpoint to see if the email is taken
        const response = await fetch(`http://localhost:8080/api/users/${email}`);
        const data = await response.json();
        
        // For SIGN UP: if it exists, it's NOT valid (return false)
        if (data.exists) return false;
    } catch (error) {
        return false;
    }
    return true; 
};

export const passwordValidator = (password) => {
    const length = password.length;
    if (password.charAt(0) === ' ' || password.charAt(length - 1) === ' ') return false;
    return length >= 8;
};

export const usernameValidator = (username) => {
    return username && username.length > 0;
};