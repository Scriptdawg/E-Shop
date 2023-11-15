const express = require("express");
const router = express.Router();
const library_controller = require("../controllers/libraryController");

//! LIBRARY ROUTES

//? INDEX - Main|Home|Splash page
router.get("/", library_controller.index_get);

module.exports = router;
