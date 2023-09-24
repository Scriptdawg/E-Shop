// LOGOUT - GET
exports.logout_get = (req, res) => {
  try {
    req.session = null;
    res.redirect("/");
  } catch (err) {
    this.next(err);
  }
};
