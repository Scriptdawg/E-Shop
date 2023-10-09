//! MEMBER ROUTES

//? INDEX
exports.index = (req, res) => {
  res.render("member/index", {
    roles: req.session.roles,
  });
};
