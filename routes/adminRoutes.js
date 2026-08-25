const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { requireRole } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");

router.use(requireRole("ADMIN"));

router.get("/users", asyncHandler(adminController.listUsers));
router.get("/influencers", asyncHandler(adminController.listInfluencerProfiles));
router.delete("/users/:email", asyncHandler(adminController.deleteUser));
router.patch("/users/:email/status", asyncHandler(adminController.updateStatus));

module.exports = router;
