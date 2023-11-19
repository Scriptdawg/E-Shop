const express = require("express");
const router = express.Router();
const administrator_controller = require("../controllers/administratorController");
const authJwt = require("../middlewares/authJwt");

// ADMINISTRATOR ROUTES

// INDEX
router.get(
  "/",
  [authJwt.verifyToken, authJwt.isAdministrator],
  administrator_controller.index
);

module.exports = router;
