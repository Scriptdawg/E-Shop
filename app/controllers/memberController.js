//! MEMBER ROUTES

//? INDEX
exports.index = (req, res) => {
  res.render("member/index", {
    subpageName: "Member",
    roles: req.session.roles,
  });
};
