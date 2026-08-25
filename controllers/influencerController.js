const db = require("../config/db");
const { badRequest } = require("../middleware/validators");

async function getProfile(req, resp) {
  const email = req.session.user.email;
  const [rows] = await db.query("SELECT * FROM influencer_profiles WHERE email = ?", [email]);
  resp.status(200).json({ profile: rows[0] || null });
}

async function saveProfile(req, resp) {
  const email = req.session.user.email;
  const {
    fullName, phone, gender, dob, address, city, state,
    pincode, instagram, youtube, twitter, otherDetails, existingPicture,
  } = req.body;

  if (!fullName || !phone || !gender || !dob) {
    throw badRequest("Please fill in all the required fields.");
  }

  // Store selected content types as a comma-separated value.
  let contentType = req.body.contentType;
  if (Array.isArray(contentType)) contentType = contentType.join(",");
  contentType = contentType || "";

  const profilePicture = req.file ? req.file.filename : (existingPicture || "nopic.svg");

  await db.query(
    `INSERT INTO influencer_profiles
      (email, full_name, profile_picture, phone, gender, dob, address, city, state, pincode,
       content_type, instagram_handle, youtube_channel, twitter_handle, other_details)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       full_name = VALUES(full_name), profile_picture = VALUES(profile_picture),
       phone = VALUES(phone), gender = VALUES(gender), dob = VALUES(dob),
       address = VALUES(address), city = VALUES(city), state = VALUES(state),
       pincode = VALUES(pincode), content_type = VALUES(content_type),
       instagram_handle = VALUES(instagram_handle), youtube_channel = VALUES(youtube_channel),
       twitter_handle = VALUES(twitter_handle), other_details = VALUES(other_details)`,
    [email, fullName, profilePicture, phone, gender, dob, address, city, state,
      pincode, contentType, instagram, youtube, twitter, otherDetails]
  );

  resp.status(200).json({ message: "Profile saved successfully.", profilePicture });
}

async function listCities(req, resp) {
  const [rows] = await db.query(
    "SELECT DISTINCT city FROM influencer_profiles ORDER BY city"
  );
  resp.status(200).json(rows);
}

async function search(req, resp) {
  const { contentType, city, name } = req.query;

  // Build filters only from supplied query parameters.
  const conditions = [];
  const params = [];

  if (contentType) {
    conditions.push("content_type LIKE ?");
    params.push(`%${contentType}%`);
  }
  if (city) {
    conditions.push("city = ?");
    params.push(city);
  }
  if (name) {
    conditions.push("full_name LIKE ?");
    params.push(`%${name}%`);
  }

  let sql = "SELECT * FROM influencer_profiles";
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  const [rows] = await db.query(sql, params);
  resp.status(200).json(rows);
}

async function listMyEvents(req, resp) {
  const email = req.session.user.email;
  const [rows] = await db.query(
    "SELECT * FROM events WHERE email = ? ORDER BY event_date, start_time",
    [email]
  );
  resp.status(200).json(rows);
}

async function createEvent(req, resp) {
  const email = req.session.user.email;
  const { title, eventDate, startTime, place, location } = req.body;

  if (!title || !eventDate || !startTime || !place || !location) {
    throw badRequest("Please fill in all the event fields.");
  }

  await db.query(
    "INSERT INTO events (email, title, event_date, start_time, place, location) VALUES (?, ?, ?, ?, ?, ?)",
    [email, title, eventDate, startTime, place, location]
  );

  resp.status(201).json({ message: "Event posted successfully." });
}

async function deleteEvent(req, resp) {
  const email = req.session.user.email;
  const { id } = req.params;

  // Match the owner to prevent deleting another user's event.
  const [result] = await db.query(
    "DELETE FROM events WHERE event_id = ? AND email = ?",
    [id, email]
  );

  if (result.affectedRows === 0) {
    return resp.status(404).json({ message: "Event not found." });
  }

  resp.status(200).json({ message: "Event deleted." });
}

module.exports = {
  getProfile, saveProfile, listCities, search,
  listMyEvents, createEvent, deleteEvent,
};
