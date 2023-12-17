// PICTURE ROUTES

// INDEX
exports.index_get = (req, res) => {
  res.render("picture/index", {
    subpageName: "Pictures",
    roles: req.session.roles,
  });
};
