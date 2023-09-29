const asyncHandler = require("express-async-handler");
const Dog = require("../models/dog.js");

// ** PUBLIC ROUTES ** //

// INDEX - GET
exports.public_index = (req, res) => {
  res.render("public/product_list", {
    roles: req.session.roles,
  });
};

// ** DOG ROUTES ** //

// READ Dog - detail
exports.dog_detail_get = asyncHandler(async (req, res) => {
  const dog = await Dog.findById(req.params.id).populate("breed");
  res.render("dogs/dog_detail", {
    roles: req.session.roles,
    pageTitle: dog.name,
    dog,
  });
});
// READ Dog - list
exports.dog_list_get = asyncHandler(async (req, res) => {
  const dogs = (await Dog.find()).sort(function (a, b) {
    let textA = a.name.toUpperCase();
    let textB = b.name.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
  res.render("dogs/dog_list", {
    roles: req.session.roles,
    pageTitle: "Dogs",
    dogs,
  });
});

// ** CART ROUTES ** //
exports.cart_detail_get = asyncHandler(async (req, res) => {
  res.render("public/cart", {
    roles: req.session.roles,
  });
});

exports.products_api_list_get = asyncHandler(async (req, res) => {
  const products = [];
  const dogs = (await Dog.find()).sort(function (a, b) {
    let textA = a.name.toUpperCase();
    let textB = b.name.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
  dogs.forEach(async dog => {
    const imagePath = dog.coverImagePath;
    const item = {
      id: dog.id,
      name: dog.name,
      price: dog.price,
      desc: dog.description,
      img: imagePath
    };
    products.push(item);
  });
  res.json(products);
});
