const asyncHandler = require("express-async-handler");
const Order = require("../models/order.js");

// ** MEMBER ROUTES ** //

// INDEX
exports.index = (req, res) => {
  res.render("member/index", {
    roles: req.session.roles,
  });
};

// ** CART ROUTES ** //
// READ Cart - detail
exports.cart_detail_get = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    userId: req.session.id,
    status: "Cart",
  }).populate("products.id");
  if (order) {
    res.render("member/cart", {
      roles: req.session.roles,
      order,
    });
  } else {
    // Create a new order object.
    let order = new Order({
      userId: req.session.id,
      status: "Cart",
      products: [],
    });
    await order.save();
    res.render("member/cart", {
      roles: req.session.roles,
      order,
    });
  }
});

// Update Cart - add product to 'cart' order document
exports.cart_update_post = asyncHandler(async (req, res) => {
  const product = {
    quantity: req.body.quantity,
    id: req.body.orderId,
  };
  const order = await Order.findOne({
    userId: req.session.id,
    status: "Cart",
  });
  if (order) {
    order.products.push(product);
    await order.save();
    res.redirect("/public/dogs");
  } else {
    // Create a new order object.
    let order = new Order({
      userId: req.session.id,
      status: "Cart",
      products: [],
    });
    order.products.push(product);
    await order.save();
    res.redirect("/public/dogs");
  }
});
