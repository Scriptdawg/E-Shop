//! MODERATOR ROUTES

//? INDEX - GET
exports.index = (req, res) => {
  res.render("moderator/index", {
    subpageName: "Moderator",
    roles: req.session.roles,
  });
};
