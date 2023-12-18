const express = require("express");
const router = express.Router();
const picture_controller = require("../controllers/pictureController");

// PICTURE ROUTES

//? INDEX
router.get("/", picture_controller.picture_list_public_get);

// READ Picture - detail & list
router.get("/detail/:id", picture_controller.picture_detail_public_get);

router.get("/list", picture_controller.picture_list_public_get);

module.exports = router;
