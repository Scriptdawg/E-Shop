const express = require("express");
const router = express.Router();
const butcher_controller = require("../controllers/butcherController");

//! BUTCHER ROUTES 

// Index
router.get("/", butcher_controller.index_get);

// HOME READ - detail
router.get("/home", butcher_controller.home_get);

// READ Store - list
router.get("/store", butcher_controller.store_get);

// API *** READ Product - list
router.get("/api/product/list", butcher_controller.api_product_list_get);

// READ Product - detail
router.get("/product/:id", butcher_controller.product_detail_get);

module.exports = router;
