const express = require("express");
const router = express.Router();
const portfolio_controller = require("../controllers/portfolioController");

// PORTFOLIO ROUTES

// INDEX
router.get("/", portfolio_controller.index_get);
router.post("/", portfolio_controller.index_post);

module.exports = router;
