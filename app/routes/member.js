const express = require("express");
const router = express.Router();
const member_controller = require("../controllers/memberController");
const authJwt = require("../middlewares/authJwt");

// ** MEMBER ROUTES ** //
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

// INDEX
router.get("/", [authJwt.verifyToken], member_controller.index);

// ** CART ROUTES ** //
// READ Cart - detail
router.get("/cart", [authJwt.verifyToken], member_controller.cart_detail_get);

// UPDATE Cart - add product
router.post("/cart/update", [authJwt.verifyToken], member_controller.cart_update_post);
  
module.exports = router;
