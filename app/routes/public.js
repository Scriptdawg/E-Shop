const express = require("express");
const router = express.Router();
const public_controller = require("../controllers/publicController");

// ** PUBLIC ROUTES ** //

// INDEX
router.get("/", public_controller.public_index);

// ** DOG ROUTES ** //

// READ Dog - detail & list
router.get("/dog/:id", public_controller.dog_detail_get);
router.get("/dogs", public_controller.dog_list_get);

module.exports = router;
