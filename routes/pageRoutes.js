const express = require("express");
const router = express.Router();
const path = require("path");
const { requirePageLogin, requirePageRole } = require("../middleware/auth");

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const sendPage = (fileName) => (req, resp) => resp.sendFile(path.join(PUBLIC_DIR, fileName));

// Public page
router.get("/", sendPage("index.html"));

// Role-protected pages
router.get("/infldash", requirePageRole("INFLUENCER"), sendPage("infldash.html"));
router.get("/inflprofile", requirePageRole("INFLUENCER"), sendPage("inflprofile.html"));
router.get("/eventmanager", requirePageRole("INFLUENCER"), sendPage("eventmanager.html"));

router.get("/branddash", requirePageRole("BRAND"), sendPage("branddash.html"));
router.get("/brandprofile", requirePageRole("BRAND"), sendPage("brandprofile.html"));

router.get("/inflfinder", requirePageLogin, sendPage("inflfinder.html"));

router.get("/admindash", requirePageRole("ADMIN"), sendPage("admindash.html"));
router.get("/usermanager", requirePageRole("ADMIN"), sendPage("adminuser.html"));
router.get("/inflconsole", requirePageRole("ADMIN"), sendPage("admininflconsole.html"));

module.exports = router;
