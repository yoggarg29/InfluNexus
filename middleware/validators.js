function isValidEmail(email) {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return typeof email === "string" && pattern.test(email);
}

function isValidPassword(password) {
  return typeof password === "string" && password.length >= 6;
}

function badRequest(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

module.exports = { isValidEmail, isValidPassword, badRequest };
