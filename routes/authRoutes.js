const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { requireLogin } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");

router.post("/signup", asyncHandler(authController.signup));
router.post("/login", asyncHandler(authController.login));
router.post("/logout", authController.logout);
router.get("/me", authController.me);
router.post("/change-password", requireLogin, asyncHandler(authController.changePassword));

module.exports = router;
