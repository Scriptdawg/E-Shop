const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Dog = require("../models/dog.js");
const Breed = require("../models/breed.js");

// CREATE Breed - GET create form
exports.breed_create_get = asyncHandler(async (req, res) => {
  res.render("breeds/breed_create", {
    roles: req.session.roles,
    pageTitle: "Create Breed",
    breed: {},
    errors: "",
  });
});
// CREATE Breed - POST create form
exports.breed_create_post = [
  // Validate and sanitize the body fields.
  body("name", "Name must contain at least 3 characters and less then 50.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("description", "Description must contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 }),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a breed object with escaped and trimmed data.
    const breed = new Breed({
      name: req.body.name,
      description: req.body.description,
    });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("breeds/breed_create", {
        roles: req.session.roles,
        pageTitle: "Create Breed",
        breed,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Check if breed with same name already exists.
      const breedExists = await Breed.findOne({ name: req.body.name }).exec();
      if (breedExists) {
        // Breed exists. Render the form again with sanitized values/error messages..
        res.render("breeds/breed_create", {
          roles: req.session.roles,
          pageTitle: "Create Breed",
          breed,
          errors: [{ msg: "Name already exists!" }],
        });
      } else {
        await breed.save();
        // New breed saved. Redirect to breed detail page.
        res.redirect("/author/breed/" + breed.url);
      }
    }
  }),
];

// READ Breed - detail
exports.breed_detail_get = asyncHandler(async (req, res) => {
  const breed = await Breed.findById(req.params.id);
  res.render("breeds/breed_detail", {
    roles: req.session.roles,
    pageTitle: breed.name,
    breed,
  });
});
// READ Breed - list
exports.breed_list_get = asyncHandler(async (req, res) => {
  const breeds = (await Breed.find()).sort(function (a, b) {
    let textA = a.name.toUpperCase();
    let textB = b.name.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
  res.render("breeds/breed_list", {
    roles: req.session.roles,
    pageTitle: "Breeds",
    breeds,
  });
});

// UPDATE Breed - GET update form
exports.breed_update_get = asyncHandler(async (req, res) => {
  const breed = await Breed.findById(req.params.id);
  res.render("breeds/breed_create", {
    roles: req.session.roles,
    pageTitle: "Update Breed",
    breed,
    errors: "",
  });
});
// UPDATE Breed - POST update form
exports.breed_update_post = [
  // Validate and sanitize the name field.
  body("name", "Name must contain at least 3 characters and less then 50.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("description", "Description must contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 }),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a breed object with escaped and trimmed data.
    const breed = new Breed({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("breeds/breed_create", {
        roles: req.session.roles,
        pageTitle: "Update Breed",
        breed,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      await Breed.findByIdAndUpdate(req.params.id, breed, {});
      // New breed updated. Redirect to breed detail page.
      res.redirect("/author/breed/" + breed.url);
    }
  }),
];

// DELETE Breed - GET delete form
exports.breed_delete_get = asyncHandler(async (req, res) => {
  const breed = await Breed.findById(req.params.id);
  res.render("breeds/breed_delete", {
    roles: req.session.roles,
    pageTitle: "Delete Breed",
    breed,
    dogs: "",
  });
});
// DELETE Breed - POST delete form
exports.breed_delete_post = asyncHandler(async (req, res) => {
  // Check if breed assigned to any dogs.
  const dogs = await Dog.find({ breed: req.params.id });
  if (dogs.length > 0) {
    // Breed assigned. Return to form - display errors.
    const breed = await Breed.findById(req.params.id);
    res.render("breeds/breed_delete", {
      roles: req.session.roles,
      pageTitle: "Delete Breed",
      breed,
      dogs,
    });
    return;
  }
  await Breed.findByIdAndRemove(req.body.breedid);
  res.redirect("/author/breeds");
});
