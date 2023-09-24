const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Role = require("../models/role");
const User = require("../models/user");

verifyToken = (req, res, next) => {
  const accessToken = req.session.accessToken;
  // No accessToken
  if (!accessToken) {
    return res.redirect("/auth/login/Must login to complete this action!");
  }
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    // accessToken invalid or expired.
    if (err) {
      return res.redirect("/auth/login/Invalid Access Token!");
    }
    req.userId = decoded.sub;
    req.username = decoded.name;
    req.roles = decoded.roles;
    next();
    return;
  });
};

isAuthor = asyncHandler(async (req, res, next) => {
  const userId = await User.findById(req.userId).exec();
  if (userId) {
    const roles = await Role.find({
      _id: { $in: userId.roles },
    }).exec();
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "author") {
        next();
        return;
      }
    }
    res.redirect("/auth/login/Requires Author Access!");
  }
});

isModerator = asyncHandler(async (req, res, next) => {
  const userId = await User.findById(req.userId).exec();
  if (userId) {
    const roles = await Role.find({
      _id: { $in: userId.roles },
    }).exec();
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator") {
        next();
        return;
      }
    }
    res.redirect("/auth/login/Requires Moderator Access!");
  }
});

isAdministrator = asyncHandler(async (req, res, next) => {
  const userId = await User.findById(req.userId).exec();
  if (userId) {
    const roles = await Role.find({
      _id: { $in: userId.roles },
    }).exec();
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "administrator") {
        next();
        return;
      }
    }
    res.redirect("/auth/login/Requires Administrator Access!");
  }
});

const authJwt = {
  verifyToken,
  isAuthor,
  isModerator,
  isAdministrator,
};

module.exports = authJwt;
