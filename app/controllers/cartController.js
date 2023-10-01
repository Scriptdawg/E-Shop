//! CART ROUTES

// READ /cart/list
exports.cart_list_get = (req, res) => {
  res.render("cart/cart_list", {
    roles: req.session.roles,
  });
};
