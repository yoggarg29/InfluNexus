const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");
const { requireLogin } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");

router.get("/profile", requireLogin, asyncHandler(brandController.getProfile));
router.post("/profile", requireLogin, asyncHandler(brandController.saveProfile));

module.exports = router;
