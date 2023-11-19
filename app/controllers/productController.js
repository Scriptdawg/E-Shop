const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Product = require("../models/product.js");
const Story = require("../models/story.js");
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

const priceTypes = ["/kilogram", "/pound", "/package", "/box", " points"];

// PRODUCT ROUTES

// CREATE Product - GET create form
exports.product_create_get = asyncHandler(async (req, res) => {
  const allStories = (await Story.find()).sort(function (a, b) {
    let textA = a.name.toUpperCase();
    let textB = b.name.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
  res.render("product/product_create", {
    subpageName: "Create Product",
    roles: req.session.roles,
    pageTitle: "Create Product",
    stories: allStories,
    product: {},
    priceTypeSelections: priceTypes,
    errors: "",
  });
});
// CREATE Product - POST create form
exports.product_create_post = [
  // Validate and sanitize the body fields.
  body("name", "Name must contain at least 3 characters and less then 50.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("story", "Please pick a story.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("shortDescription", "Short Description must contain at least 3 characters.").trim(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a product object with escaped and trimmed data.
    const product = new Product({
      name: req.body.name,
      available: req.body.available,
      category: req.body.category,
      shortDescription: req.body.shortDescription,
      longDescription: req.body.longDescription,
      specialMessage: req.body.specialMessage,
      story: req.body.story,
      price: req.body.price,
      priceType: req.body.priceType,
    });

    saveCover(product, req.body.cover);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      const allStories = (await Story.find()).sort(function (a, b) {
        let textA = a.name.toUpperCase();
        let textB = b.name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      res.render("product/product_create", {
        subpageName: "Create Product",
        roles: req.session.roles,
        pageTitle: "Create Product",
        stories: allStories,
        product,
        priceTypeSelections: priceTypes,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Check if product with same name already exists.
      const productExists = await Product.findOne({ name: req.body.name }).exec();
      if (productExists) {
        // Product exists. Render the form again with sanitized values/error messages..
        const allStories = (await Story.find()).sort(function (a, b) {
          let textA = a.name.toUpperCase();
          let textB = b.name.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
        res.render("product/product_create", {
          subpageName: "Create Product",
          roles: req.session.roles,
          pageTitle: "Create Product",
          stories: allStories,
          product,
          priceTypeSelections: priceTypes,
          errors: [{ msg: "Name already exists!" }],
        });
      } else {
        await product.save();
        // New product saved. Redirect to product detail page.
        res.redirect("/author/product/" + product.url);
      }
    }
  }),
];

// Save Cover
function saveCover(product, coverEncoded) {
  if (coverEncoded == null || coverEncoded == "") return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    product.coverImage = new Buffer.from(cover.data, "base64");
    product.coverImageType = cover.type;
  }
}

// READ Product - detail
exports.product_detail_get = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("story");
  res.render("product/product_auth_detail", {
    subpageName: "Product Detail",
    roles: req.session.roles,
    pageTitle: product.name,
    product,
  });
});
// READ Product - list
exports.product_list_get = asyncHandler(async (req, res) => {
  const products = (await Product.find()).sort(function (a, b) {
    let textA = a.name.toUpperCase();
    let textB = b.name.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
  res.render("product/product_auth_list", {
    subpageName: "Product List",
    roles: req.session.roles,
    pageTitle: "E-Shop Products",
    products,
  });
});

// UPDATE Product - GET update form
exports.product_update_get = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("story");
  const allStories = (await Story.find()).sort(function (a, b) {
    let textA = a.name.toUpperCase();
    let textB = b.name.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
  res.render("product/product_create", {
    subpageName: "Update Product",
    roles: req.session.roles,
    pageTitle: "Update Product",
    stories: allStories,
    product,
    priceTypeSelections: priceTypes,
    errors: "",
  });
});
// UPDATE Product - POST update form
exports.product_update_post = [
  // Validate and sanitize the body fields.
  body("name", "Name must contain at least 3 characters and less then 50.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("story", "Please pick a story.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("shortDescription", "Short Description must contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 }),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a product object with escaped and trimmed data.
    const product = new Product({
      name: req.body.name,
      available: req.body.available,
      category: req.body.category,
      shortDescription: req.body.shortDescription,
      longDescription: req.body.longDescription,
      specialMessage: req.body.specialMessage,
      story: req.body.story,
      price: req.body.price,
      priceType: req.body.priceType,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    saveCover(product, req.body.cover);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      const allStories = await Story.find();
      res.render("product/product_create", {
        subpageName: "Update Product",
        roles: req.session.roles,
        pageTitle: "Update Product",
        stories: allStories,
        product,
        priceTypeSelections: priceTypes,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      await Product.findByIdAndUpdate(req.params.id, product, {});
      // Product updated. Redirect to product detail page.
      res.redirect("/author/product/" + product.url);
    }
  }),
];

// DELETE Product - GET delete form
exports.product_delete_get = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("product/product_delete", {
    subpageName: "Delete Product",
    roles: req.session.roles,
    pageTitle: "Delete Product",
    product,
  });
});
// DELETE Product - POST delete form
exports.product_delete_post = asyncHandler(async (req, res) => {
  await Product.findByIdAndRemove(req.body.productid);
  res.redirect("/author/products");
});
