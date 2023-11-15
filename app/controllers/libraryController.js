//! LIBRARY ROUTES

//? INDEX
exports.index_get = (req, res) => {
  res.render("library/index", {
    subpageName: "Coder's Cove Home Page",
    roles: req.session.roles,
  });
};
