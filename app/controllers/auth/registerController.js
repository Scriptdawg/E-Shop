const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Role = require("../../models/role");
const User = require("../../models/user");

//! REGISTER ROUTES

// REGISTER -  GET
exports.register_get = (req, res) => {
  res.render("auth/register", {
    subpageName: "Registration Form",
    errors: "",
  });
};
// REGISTER - POST
exports.register_post = [
  // Validate and sanitize the body fields.
  body("fname", "First name must contain 3 to 50 characters.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("lname", "Last-name must contain 3 to 50 characters.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
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
      res.render("auth/register", {
        subpageName: "Registration Form",
        errors: errors.array(),
      });
    } else {
      // Check if passwords match
      if (req.body.password !== req.body.repeatPassword) {
        res.render("auth/register", {
          subpageName: "Registration Form",
          errors: [{ msg: "Passwords don't match!" }],
        });
        return;
      } else {
        const passwordSalt = req.body.password + process.env.PASSWORD_SALT;
        user.password = await bcrypt.hash(passwordSalt, 14);
      }
      // Data from form is valid. Check if user with same email already exists.
      const userExists = await User.findOne({ email: req.body.email }).exec();
      if (userExists) {
        res.render("auth/register", {
          subpageName: "Registration Form",
          errors: [{ msg: "Email already exists!" }],
        });
      } else {
        // If roles is empty assign to member to prevent double database query.
        if (!req.body.roles) {
          req.body.roles = ["member"];
        }
        const roleIds = await Role.find({
          name: { $in: req.body.roles },
        }).exec();
        // If roles input is invalid then assign to member id.
        if (!roleIds[0]) {
          roleIds.push(await Role.findOne({ name: "member" }));
        }
        user.roles = roleIds.map((role) => role._id);
        // Create verification codes.
        const verificationCode = require("crypto")
          .randomBytes(4)
          .toString("hex");
        const verificationSalt =
          verificationCode + process.env.VERIFICATION_SALT;
        user.verificationCode = await bcrypt.hash(verificationSalt, 14);
        // Save user information.
        await user.save();
        res.redirect("./login");
      }
    }
  }),
];
