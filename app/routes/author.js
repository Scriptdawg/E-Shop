const express = require("express");
const router = express.Router();
const author_controller = require("../controllers/authorController");
const dog_controller = require("../controllers/dogController");
const breed_controller = require("../controllers/breedController");
const authJwt = require("../middlewares/authJwt");

// ** AUTHOR ROUTES ** //

// INDEX
router.get(
  "/",
  [authJwt.verifyToken, authJwt.isAuthor],
  author_controller.index
);

// ** DOG ROUTES ** //
// CREATE Dog - This must come before routes that display Dog (uses id)
router.get(
  "/dog/create",
  [authJwt.verifyToken, authJwt.isAuthor],
  dog_controller.dog_create_get
);
router.post(
  "/dog/create",
  [authJwt.verifyToken, authJwt.isAuthor],
  dog_controller.dog_create_post
);
router.post(
  "/dog/create/post",
  [authJwt.verifyToken, authJwt.isAuthor],
  dog_controller.dog_create_post
);
// READ Dog - detail & list
router.get(
  "/dog/:id",
  [authJwt.verifyToken, authJwt.isAuthor],
  dog_controller.dog_detail_get
);
router.get(
  "/dogs",
  [authJwt.verifyToken, authJwt.isAuthor],
  dog_controller.dog_list_get
);
// UPDATE Dog
router.get(
  "/dog/update/:id",
  [authJwt.verifyToken, authJwt.isAuthor],
  dog_controller.dog_update_get
);
router.post(
  "/dog/update/:id",
  [authJwt.verifyToken, authJwt.isAuthor],
  dog_controller.dog_update_post
);
// DELETE Dog
router.get(
  "/dog/delete/:id",
  [authJwt.verifyToken, authJwt.isAuthor],
  dog_controller.dog_delete_get
);
router.post(
  "/dog/delete",
  [authJwt.verifyToken, authJwt.isAuthor],
  dog_controller.dog_delete_post
);

// ** BREED ROUTES ** //
// CREATE Breed - This must come before routes that display Breed (uses id)
router.get(
  "/breed/create",
  [authJwt.verifyToken, authJwt.isAuthor],
  breed_controller.breed_create_get
);
router.post(
  "/breed/create",
  [authJwt.verifyToken, authJwt.isAuthor],
  breed_controller.breed_create_post
);
// READ Breed - detail & list
router.get(
  "/breed/:id",
  [authJwt.verifyToken, authJwt.isAuthor],
  breed_controller.breed_detail_get
);
router.get(
  "/breeds",
  [authJwt.verifyToken, authJwt.isAuthor],
  breed_controller.breed_list_get
);
// UPDATE Breed
router.get(
  "/breed/update/:id",
  [authJwt.verifyToken, authJwt.isAuthor],
  breed_controller.breed_update_get
);
router.post(
  "/breed/update/:id",
  [authJwt.verifyToken, authJwt.isAuthor],
  breed_controller.breed_update_post
);
// DELETE Breed
router.get(
  "/breed/delete/:id",
  [authJwt.verifyToken, authJwt.isAuthor],
  breed_controller.breed_delete_get
);
router.post(
  "/breed/delete/:id",
  [authJwt.verifyToken, authJwt.isAuthor],
  breed_controller.breed_delete_post
);
module.exports = router;
