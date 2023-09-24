// ** ADMINISTRATOR ROUTES ** //

// INDEX - GET
exports.index = (req, res) => {
  res.render("administrator/index", {
    roles: req.session.roles,
  });
};
