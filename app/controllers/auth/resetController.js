const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Role = require("../../models/role");
const User = require("../../models/user");

// RESET PASSWORD ROUTES

// RESET PASSWORD -  GET
exports.reset_get = (req, res) => {
  res.render("auth/reset", {
    subpageName: "Reset Password",
    errors: "",
  });
};

// RESET PASSWORD - POST
exports.reset_post = [
  // Validate and sanitize the body fields.
  body("email", "Must be a valid email format.").trim().isEmail().escape(),
  body("password", "Password must contain 3 to 50 characters.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("repeatPassword", "Re-entered password must contain 3 to 50 characters.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("roles", "Invalid role.").trim().escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a user object with escaped and trimmed data.
    const user = new User({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      verified: false,
    });
    if (!errors.isEmpty()) {
      res.render("auth/reset", {
        subpageName: "Reset Password",
        errors: errors.array(),
      });
    } else {
      // Check if passwords match
      if (req.body.password !== req.body.repeatPassword) {
        res.render("auth/reset", {
          subpageName: "Reset Password",
          errors: [{ msg: "Passwords don't match!" }],
        });
        return;
      } else {
        const passwordSalt = req.body.password + process.env.PASSWORD_SALT;
        user.password = await bcrypt.hash(passwordSalt, 14);
      }
      // Data from form is valid. Check if user with same email already exists.
      const userExists = await User.findOne({ email: req.body.email }).exec();
      if (!userExists) {
        res.render("auth/reset", {
          subpageName: "Reset Password",
          errors: [{ msg: "User doesn't exist!" }],
        });
      } else {
        user.id = userExists.id;
        user.roles = userExists.roles;
        // Create verification codes.
        const verificationCode = require("crypto")
          .randomBytes(4)
          .toString("hex");
        const verificationSalt =
          verificationCode + process.env.VERIFICATION_SALT;
        user.verificationCode = await bcrypt.hash(verificationSalt, 14);
        // Data from form is valid. Update the record.
        await User.findByIdAndUpdate(user.id, user, {});
        res.redirect("./login");
      }
    }
  }),
];
