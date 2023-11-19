// AUTHOR ROUTES

// INDEX - GET
exports.index = (req, res) => {
  res.render("author/index", {
    subpageName: "Author",
    roles: req.session.roles,
  });
};
