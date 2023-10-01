const express = require("express");
const router = express.Router();
const public_controller = require("../controllers/publicController");
const product_controller = require("../controllers/productController");
const cart_controller = require("../controllers/cartController");

//! PUBLIC ROUTES 

//? INDEX
router.get("/", public_controller.index_get);

//? PRODUCT
// READ Product - list & detail
router.get("/product/list", public_controller.product_list_get);
router.get("/api/product/list", public_controller.api_product_list_get);
router.get("/product/:id", product_controller.product_detail_get);

//? CART
// READ Cart - list
router.get("/cart/list", cart_controller.cart_list_get);


// //! OLD ROUTES - DELETE!!
// //? DOG
// // READ Dog - detail & list
// router.get("/dog/:id", public_controller.dog_detail_get);
// router.get("/dogs", public_controller.dog_list_get);

// //? CART
// router.get("/cart", public_controller.cart_detail_get);
// router.get("/products/api", public_controller.products_api_list_get)

module.exports = router;
