const asyncHandler = require("express-async-handler");
const Product = require("../models/product.js");

//! PUBLIC ROUTES

//? INDEX
exports.index_get = (req, res) => {
  res.render("public/index", {
    roles: req.session.roles,
  });
};

//! OLD ROUTES - DELETE!!
// //? DOG
// READ Product - list
exports.product_list_get = asyncHandler(async (req, res) => {
  // const products = (await Dog.find()).sort(function (a, b) {
  //   let textA = a.name.toUpperCase();
  //   let textB = b.name.toUpperCase();
  //   return textA < textB ? -1 : textA > textB ? 1 : 0;
  // });
  res.render("product/product_list", {
    roles: req.session.roles,
    // pageTitle: "Dogs",
    // dogs,
  });
});

// //? CART
// exports.cart_detail_get = asyncHandler(async (req, res) => {
//   res.render("public/cart", {
//     roles: req.session.roles,
//   });
// });

// !READ /api/product/list
exports.api_product_list_get = asyncHandler(async (req, res) => {
  const merged = [];
  const products = (await Product.find()).sort(function (a, b) {
    let textA = a.name.toUpperCase();
    let textB = b.name.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
  products.forEach(async product => {
    const imagePath = product.coverImagePath;
    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      desc: product.description,
      img: imagePath
    };
    merged.push(item);
  });
  res.json(merged);
});