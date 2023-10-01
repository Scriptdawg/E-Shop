const express = require("express");
const router = express.Router();
const author_controller = require("../controllers/authorController");
const product_controller = require("../controllers/productController");
const story_controller = require("../controllers/storyController");
const authJwt = require("../middlewares/authJwt");

//! AUTHOR ROUTES

//? INDEX
router.get(
  "/",
  [authJwt.verifyToken, authJwt.isAuthor],
  author_controller.index
);

//? PRODUCT
// CREATE Product - This must come before routes that display Product (uses id)
router.get(
  "/product/create",
  [authJwt.verifyToken, authJwt.isAuthor],
  product_controller.product_create_get
);
router.post(
  "/product/create",
  [authJwt.verifyToken, authJwt.isAuthor],
  product_controller.product_create_post
);
router.post(
  "/product/create/post",
  [authJwt.verifyToken, authJwt.isAuthor],
  product_controller.product_create_post
);
// READ Product - detail & list
router.get(
  "/product/:id",
  [authJwt.verifyToken, authJwt.isAuthor],
  product_controller.product_detail_get
);
router.get(
  "/products",
  [authJwt.verifyToken, authJwt.isAuthor],
  product_controller.product_list_get
);
// UPDATE Product
router.get(
  "/product/update/:id",
  [authJwt.verifyToken, authJwt.isAuthor],
  product_controller.product_update_get
);
router.post(
  "/product/update/:id",
  [authJwt.verifyToken, authJwt.isAuthor],
  product_controller.product_update_post
);
// DELETE Product
router.get(
  "/product/delete/:id",
  [authJwt.verifyToken, authJwt.isAuthor],
  product_controller.product_delete_get
);
router.post(
  "/product/delete",
  [authJwt.verifyToken, authJwt.isAuthor],
  product_controller.product_delete_post
);

//? STORY
// CREATE Story - This must come before routes that display Story (uses id)
router.get(
  "/story/create",
  [authJwt.verifyToken, authJwt.isAuthor],
  story_controller.story_create_get
);
router.post(
  "/story/create",
  [authJwt.verifyToken, authJwt.isAuthor],
  story_controller.story_create_post
);
// READ Story - detail & list
router.get(
  "/story/:id",
  [authJwt.verifyToken, authJwt.isAuthor],
  story_controller.story_detail_get
);
router.get(
  "/stories",
  [authJwt.verifyToken, authJwt.isAuthor],
  story_controller.story_list_get
);
// UPDATE Story
router.get(
  "/story/update/:id",
  [authJwt.verifyToken, authJwt.isAuthor],
  story_controller.story_update_get
);
router.post(
  "/story/update/:id",
  [authJwt.verifyToken, authJwt.isAuthor],
  story_controller.story_update_post
);
// DELETE Story
router.get(
  "/story/delete/:id",
  [authJwt.verifyToken, authJwt.isAuthor],
  story_controller.story_delete_get
);
router.post(
  "/story/delete/:id",
  [authJwt.verifyToken, authJwt.isAuthor],
  story_controller.story_delete_post
);

module.exports = router;
