//! AUTHOR ROUTES

// INDEX - GET
exports.index = (req, res) => {
  res.render("author/index", {
    roles: req.session.roles,
  });
};
