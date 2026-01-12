export const emailValidator = async (email) => {
  const indexOfAt = email.indexOf("@");
  if (indexOfAt <= 0) {
    alert("wrong email format");
    return false;
  }
  if (email.substr(indexOfAt + 1) !== "gmail.com") {
    alert("wrong email format");
    return false;
  }

  try {
    // We check the users endpoint to see if the email is taken
    const response = await fetch(`http://localhost:8080/api/tokens/${email}`);
    const data = await response.json();

    // For SIGN UP: if it exists, it's NOT valid (return false)
    if (data.exists) {
      alert("a user with this email already exists");
      return false;
    }
  } catch (error) {
    alert("internal server problem, try again");
    return false;
  }
  return true;
};

export const passwordValidator = (password) => {
  const length = password.length;
  if (password.charAt(0) === " " || password.charAt(length - 1) === " ") {
    alert("a passsword must not start or and with a space");
    return false;
  }
  if (length >= 8) {
    return true;
  }
  alert("password must be 8 or more characters");
  return false;
};

export const usernameValidator = (username) => {
  if (username && username.length > 0) {
    return true;
  }
  alert("username must not be empty");
  return false;
};
