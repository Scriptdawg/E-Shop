const express = require("express");
const router = express.Router();
const main_controller = require("../controllers/mainController");

// ** MAIN ROUTES ** //

// INDEX - Main|Home|Splash page
router.get("/", main_controller.index_get);

// ABOUT
router.get("/about", main_controller.about_get);

// CONTACT
router.get("/contact", main_controller.contact_get);
router.post("/contact", main_controller.contact_post);

module.exports = router;
