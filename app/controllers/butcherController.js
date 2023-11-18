const asyncHandler = require("express-async-handler");
const Product = require("../models/product.js");

// ! BUTCHER ROUTES

// INDEX
exports.index_get =(req, res) => {
  res.render("butcher/index", {
    subpageName: "Butcher Shop",
    roles: req.session.roles,
  });
};

// HOME READ - detail
exports.home_get =(req, res) => {
  res.render("butcher/home", {
    subpageName: "Butcher Shop Home Page",
    roles: req.session.roles,
  });
};

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
  res.render("butcher/product_detail", {
    subpageName: "Product Detail",
    roles: req.session.roles,
    pageTitle: product.name,
    product,
  });
});

// READ Store - list
exports.store_get = asyncHandler(async (req, res) => {
  res.render("butcher/store", {
    subpageName: "Butcher Shop",
    roles: req.session.roles,
  });
})
