const express = require("express");
const router = express.Router();
const influencerController = require("../controllers/influencerController");
const { requireLogin } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const upload = require("../middleware/upload");

// Public search endpoints
router.get("/search", asyncHandler(influencerController.search));
router.get("/cities", asyncHandler(influencerController.listCities));

// Influencer-only endpoints
router.get("/profile", requireLogin, asyncHandler(influencerController.getProfile));
router.post(
  "/profile",
  requireLogin,
  upload.single("profilePicture"),
  asyncHandler(influencerController.saveProfile)
);

router.get("/events", requireLogin, asyncHandler(influencerController.listMyEvents));
router.post("/events", requireLogin, asyncHandler(influencerController.createEvent));
router.delete("/events/:id", requireLogin, asyncHandler(influencerController.deleteEvent));

module.exports = router;
