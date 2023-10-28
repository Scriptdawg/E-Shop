const asyncHandler = require("express-async-handler");
const Product = require("../models/product.js");

// ! PUBLIC ROUTES

// API *** READ Product - list
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
      available: product.available,
      category: product.category,
      name: product.name,
      price: product.price,
      priceType: product.priceType,
      shortDescription: product.shortDescription,
      img: imagePath
    };
    merged.push(item);
  });
  res.json(merged);
});

// READ Product - detail
exports.product_detail_get = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("story");
  res.render("public/product_detail", {
    subpageName: "Product Detail",
    roles: req.session.roles,
    pageTitle: product.name,
    product,
  });
});

// READ Store - list
exports.store_get = asyncHandler(async (req, res) => {
  res.render("public/store", {
    subpageName: "Product List",
    roles: req.session.roles,
  });
})
