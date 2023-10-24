const express = require("express");
const router = express.Router();
const public_controller = require("../controllers/publicController");

//! PUBLIC ROUTES 

// Index
router.get("/", public_controller.store_get);
// API *** READ Product - list
router.get("/api/product/list", public_controller.api_product_list_get);

// READ Product - detail
router.get("/product/:id", public_controller.product_detail_get);

// READ Store - list
router.get("/store", public_controller.store_get);

module.exports = router;
