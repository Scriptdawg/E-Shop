const express = require("express");
const router = express.Router();
const site_controller = require("../controllers/siteController");

// SITE ROUTES

// INDEX - Site Main|Home|Splash page
router.get("/", site_controller.index_get);

// ABOUT
router.get("/about", site_controller.about_get);

// CONTACT
router.get("/contact", site_controller.contact_get);
router.post("/contact", site_controller.contact_post);

module.exports = router;
