//! ADMINISTRATOR ROUTES

//? INDEX
exports.index = (req, res) => {
  res.render("administrator/index", {
    roles: req.session.roles,
  });
};
