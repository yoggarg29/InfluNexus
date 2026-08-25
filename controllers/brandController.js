const db = require("../config/db");
const { badRequest } = require("../middleware/validators");

async function getProfile(req, resp) {
  const email = req.session.user.email;
  const [rows] = await db.query("SELECT * FROM brand_profiles WHERE email = ?", [email]);
  resp.status(200).json({ profile: rows[0] || null });
}

async function saveProfile(req, resp) {
  const email = req.session.user.email;
  const { brandName, phone, orgType, address, city, state, pincode } = req.body;

  if (!brandName || !phone || !address || !city) {
    throw badRequest("Please fill in all the required fields.");
  }

  await db.query(
    `INSERT INTO brand_profiles (email, brand_name, phone, org_type, address, city, state, pincode)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       brand_name = VALUES(brand_name), phone = VALUES(phone), org_type = VALUES(org_type),
       address = VALUES(address), city = VALUES(city), state = VALUES(state), pincode = VALUES(pincode)`,
    [email, brandName, phone, orgType, address, city, state, pincode]
  );

  resp.status(200).json({ message: "Profile saved successfully." });
}

module.exports = { getProfile, saveProfile };
