const express = require("express");
const router = express.Router();
const register_controller = require("../controllers/auth/registerController");
const verify_controller = require("../controllers/auth/verifyController");
const login_controller = require("../controllers/auth/loginController");
const logout_controller = require("../controllers/auth/logoutController");
const reset_controller = require("../controllers/auth/resetController");

// AUTHORIZATION ROUTES

// REGISTER
router.get("/register", register_controller.register_get);
router.post("/register", register_controller.register_post);

// VERIFY
router.get("/verify/:id", verify_controller.verify_get);
router.post("/verify", verify_controller.verify_post);
router.post("/verify/resend", verify_controller.verify_resend);

// LOGIN
router.get("/login", login_controller.login_get);
router.get("/login/:message", login_controller.login_get);
router.post("/login", login_controller.login_post);

// LOGOUT
router.get("/logout", logout_controller.logout_get);

// RESET PASSWORD
router.get("/reset", reset_controller.reset_get);
router.post("/reset", reset_controller.reset_post);

module.exports = router;
