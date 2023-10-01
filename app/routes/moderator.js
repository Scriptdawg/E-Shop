const express = require("express");
const router = express.Router();
const moderator_controller = require("../controllers/moderatorController");
const authJwt = require("../middlewares/authJwt");

//! MODERATOR ROUTES

//? INDEX
router.get(
  "/",
  [authJwt.verifyToken, authJwt.isModerator],
  moderator_controller.index
);

module.exports = router;
