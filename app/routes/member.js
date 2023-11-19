const express = require("express");
const router = express.Router();
const member_controller = require("../controllers/memberController");
const authJwt = require("../middlewares/authJwt");

// MEMBER ROUTES

// INDEX
router.get("/", [authJwt.verifyToken], member_controller.index);
  
module.exports = router;
