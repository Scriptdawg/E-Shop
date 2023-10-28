const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../../models/user");

//! LOGIN ROUTES

// LOGIN -  GET
exports.login_get = (req, res) => {
  res.render("auth/login", {
    subpageName: "Login",
    user: {},
    sharedMessage: req.sharedVariable.sharedMessage,
    errors: [{ msg: req.params.message ?? "" }],
  });
};
// LOGIN -  POST
exports.login_post = [
  // Validate and sanitize the body fields.
  body("email", "Must be a valid email format.").trim().isEmail().escape(),
  body("password", "Password must contain 3 to 50 characters.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a user object with escaped and trimmed data.
    const user = { email: req.body.email };
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values & error messages.
      res.render("auth/login", {
        subpageName: "Login",
        user,
        errors: errors.array(),
      });
      return;
    }
    const userExists = await User.findOne({ email: req.body.email })
      .populate("roles")
      .exec();
    if (!userExists) {
      // User doesn't exist. Render the form again with sanitized values/error messages..
      res.render("auth/login", {
        subpageName: "Login",
        user,
        errors: [{ msg: "Email doesn't exist." }],
      });
      return;
    }
    const passwordSalt = req.body.password + process.env.PASSWORD_SALT;
    const passwordIsValid = bcrypt.compareSync(
      passwordSalt,
      userExists.password
    );
    if (!passwordIsValid) {
      // Invalid password. Render the form again with sanitized values/error messages..
      res.render("auth/login", {
        subpageName: "Login",
        user,
        errors: [{ msg: "Invalid password." }],
      });
      return;
    }
    res.redirect(`/auth/verify/${userExists.id}`);
  }),
];
