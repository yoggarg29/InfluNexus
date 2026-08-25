const bcrypt = require("bcrypt");
const db = require("../config/db");
const { isValidEmail, isValidPassword, badRequest } = require("../middleware/validators");

const SALT_ROUNDS = 10;

async function signup(req, resp) {
  const { email, password, userType } = req.body;

  if (!isValidEmail(email)) throw badRequest("Please enter a valid email address.");
  if (!isValidPassword(password)) throw badRequest("Password must be at least 6 characters long.");
  if (!["INFLUENCER", "BRAND"].includes(userType)) throw badRequest("Please select a role.");

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  await db.query(
    "INSERT INTO users (email, password, user_type, status) VALUES (?, ?, ?, 1)",
    [email, passwordHash, userType]
  );

  resp.status(201).json({ message: "Account created successfully. You can now log in." });
}

async function login(req, resp) {
  const { email, password } = req.body;

  if (!isValidEmail(email) || !password) {
    throw badRequest("Please enter a valid email and password.");
  }

  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  const user = rows[0];

  // Use one message to avoid revealing registered emails.
  if (!user) {
    return resp.status(401).json({ message: "Invalid email or password." });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return resp.status(401).json({ message: "Invalid email or password." });
  }

  if (user.status === 0) {
    return resp.status(403).json({ message: "This account has been blocked. Contact the admin." });
  }

  // Store trusted identity in the server-side session.
  req.session.user = { email: user.email, userType: user.user_type };

  resp.status(200).json({
    message: "Login successful.",
    email: user.email,
    userType: user.user_type,
  });
}

function logout(req, resp) {
  req.session.destroy(() => {
    resp.status(200).json({ message: "Logged out." });
  });
}

function me(req, resp) {
  if (!req.session.user) {
    return resp.status(401).json({ message: "Not logged in." });
  }
  resp.status(200).json(req.session.user);
}

async function changePassword(req, resp) {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const email = req.session.user.email;

  if (!isValidPassword(newPassword)) throw badRequest("New password must be at least 6 characters long.");
  if (newPassword !== confirmPassword) throw badRequest("New password and confirm password do not match.");

  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  const user = rows[0];

  const oldPasswordMatches = await bcrypt.compare(oldPassword, user.password);
  if (!oldPasswordMatches) throw badRequest("Old password is incorrect.");

  const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await db.query("UPDATE users SET password = ? WHERE email = ?", [newPasswordHash, email]);

  resp.status(200).json({ message: "Password updated successfully." });
}

module.exports = { signup, login, logout, me, changePassword };
