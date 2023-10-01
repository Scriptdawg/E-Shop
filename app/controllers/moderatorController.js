//! MODERATOR ROUTES

//? INDEX - GET
exports.index = (req, res) => {
  res.render("moderator/index", {
    roles: req.session.roles,
  });
};
