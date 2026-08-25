const db = require("../config/db");
const { badRequest } = require("../middleware/validators");

async function listUsers(req, resp) {
  const [rows] = await db.query(
    "SELECT email, user_type, status FROM users WHERE user_type != 'ADMIN' ORDER BY email"
  );
  resp.status(200).json(rows);
}

async function listInfluencerProfiles(req, resp) {
  const [rows] = await db.query("SELECT * FROM influencer_profiles ORDER BY full_name");
  resp.status(200).json(rows);
}

async function deleteUser(req, resp) {
  const { email } = req.params;
  const [result] = await db.query("DELETE FROM users WHERE email = ?", [email]);

  if (result.affectedRows === 0) {
    return resp.status(404).json({ message: "User not found." });
  }
  resp.status(200).json({ message: "User deleted." });
}

async function updateStatus(req, resp) {
  const { email } = req.params;
  const { status } = req.body;

  if (status !== 0 && status !== 1) {
    throw badRequest("status must be 0 (blocked) or 1 (active).");
  }

  await db.query("UPDATE users SET status = ? WHERE email = ?", [status, email]);
  resp.status(200).json({ message: status === 1 ? "User unblocked." : "User blocked." });
}

module.exports = { listUsers, listInfluencerProfiles, deleteUser, updateStatus };
