//! ADMINISTRATOR ROUTES

//? INDEX
exports.index = (req, res) => {
  res.render("administrator/index", {
    subpageName: "Administrator",
    roles: req.session.roles,
  });
};
