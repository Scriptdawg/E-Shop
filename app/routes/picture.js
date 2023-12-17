const express = require("express");
const router = express.Router();
const picture_controller = require("../controllers/pictureController");

// PICTURE ROUTES

//? INDEX
router.get("/", picture_controller.index_get);

module.exports = router;
