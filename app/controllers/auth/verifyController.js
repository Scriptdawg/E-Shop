const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailer = require("../../middlewares/mailer");

// VERIFY ROUTES

// VERIFY - GET
exports.verify_get = async (req, res) => {
  // Get user data and check if verified.
  const userExists = await User.findById(req.params.id)
    .populate("roles")
    .exec();
  if (!userExists.verified) {
    // Create verification code.

    // DUPLICATE CODE
    const verificationCode = require("crypto").randomBytes(4).toString("hex");
    const verificationSalt = verificationCode + process.env.VERIFICATION_SALT;
    const verificationHash = await bcrypt.hash(verificationSalt, 14);
    await User.findByIdAndUpdate(userExists.id, {
      verificationCode: verificationHash,
    });

    // Change verification code in 10 minutes.
    setTimeout(async () => {
      // DUPLICATE CODE
      const verificationCode = require("crypto").randomBytes(4).toString("hex");
      const verificationSalt = verificationCode + process.env.VERIFICATION_SALT;
      const verificationHash = await bcrypt.hash(verificationSalt, 14);
      await User.findByIdAndUpdate(userExists.id, {
        verificationCode: verificationHash,
      });
      console.log("timer");
    }, 600000); // 10 minutes

    // Send verification email.
    mailer({
      from: "pauloosterhoff@gmail.com",
      to: userExists.email,
      subject: "Verification",
      text: `Your verification code is: ${verificationCode}`,
    });

    // Render email verification form
    res.render("auth/verify", {
      subpageName: "Verification",
      id: userExists.id,
      error: "",
    });
    return;
  }

  // ! DUPLICATE CODE
  // Already verified.
  const roles = userExists.roles.map((role) => role.name);
  // Issue access token.
  const accessToken = jwt.sign(
    { sub: userExists.id, name: userExists.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: 3600 }
  );
  req.session.accessToken = accessToken;
  req.session.roles = roles.map(
    (role) => role[0].toUpperCase() + role.substring(1).toLowerCase()
  );
  req.session.id = userExists.id;

  if (roles.includes("administrator")) {
    return res.redirect("/administrator");
  } else {
    if (roles.includes("moderator")) {
      return res.redirect("/moderator");
    } else {
      if (roles.includes("author")) {
        return res.redirect("/author");
      }
    }
  }
  res.redirect("/member");
};

// VERIFY - POST
exports.verify_post = async (req, res) => {
  const userExists = await User.findById(req.body.id).populate("roles").exec();
  const verificationSalt =
    req.body.verificationCode + process.env.VERIFICATION_SALT;
  const verificationIsValid = bcrypt.compareSync(
    verificationSalt,
    userExists.verificationCode
  );
  if (!verificationIsValid) {
    res.render("auth/verify", {
      subpageName: "Verification",
      id: req.body.id,
      error: "Invalid Code!",
    });
    return;
  }
  await User.findByIdAndUpdate(req.body.id, { verified: true });

  // ! DUPLICATE CODE
  const roles = userExists.roles.map((role) => role.name);
  // Issue access token.
  const accessToken = jwt.sign(
    { sub: userExists.id, name: userExists.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "24h" }
  );
  req.session.accessToken = accessToken;
  req.session.roles = roles.map(
    (role) => role[0].toUpperCase() + role.substring(1).toLowerCase()
  );
  if (roles.includes("administrator")) {
    return res.redirect("/administrator");
  } else {
    if (roles.includes("moderator")) {
      return res.redirect("/moderator");
    } else {
      if (roles.includes("author")) {
        return res.redirect("/author");
      }
    }
    res.redirect("/member");
  }
};

// VERIFY - RESEND
exports.verify_resend = (req, res) => {
  res.redirect(`/auth/verify/${req.body.id}`);
};
