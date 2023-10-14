const express = require("express");
const router = express.Router();
const public_controller = require("../controllers/publicController");

//! PUBLIC ROUTES 

// ? INDEX
// READ Product - list
router.get("/", public_controller.index_get);

// API *** READ Product - list
router.get("/api/product/list", public_controller.api_product_list_get);

// READ Product - detail
router.get("/product/:id", public_controller.product_detail_get);

// ? CART
// READ Cart - list
router.get("/cart", public_controller.cart_list_get);

// ? Favorites
// READ Favorites - list
router.get("/favorites", public_controller.favorites_get);
module.exports = router;
