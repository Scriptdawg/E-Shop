const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Dog = require("../models/dog.js");
const Breed = require("../models/breed.js");
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

// CREATE Dog - GET create form
exports.dog_create_get = asyncHandler(async (req, res) => {
  const allBreeds = (await Breed.find()).sort(function (a, b) {
    let textA = a.name.toUpperCase();
    let textB = b.name.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
  res.render("dogs/dog_create", {
    roles: req.session.roles,
    pageTitle: "Create Dog",
    breeds: allBreeds,
    dog: {},
    errors: "",
  });
});
// CREATE Dog - POST create form
exports.dog_create_post = [
  // Validate and sanitize the body fields.
  body("name", "Name must contain at least 3 characters and less then 50.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("breed", "Please pick a breed.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("favoriteFood", "Favorite Food must contain less then 50 characters.")
    .trim()
    .isLength({ max: 50 })
    .escape(),
  body("description", "Description must contain at least 3 characters.").trim(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a dog object with escaped and trimmed data.
    const dog = new Dog({
      name: req.body.name,
      breed: req.body.breed,
      favoriteFood: req.body.favoriteFood,
      description: req.body.description,
    });

    saveCover(dog, req.body.cover);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      const allBreeds = (await Breed.find()).sort(function (a, b) {
        let textA = a.name.toUpperCase();
        let textB = b.name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      res.render("dogs/dog_create", {
        roles: req.session.roles,
        pageTitle: "Create Dog",
        breeds: allBreeds,
        dog,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Check if dog with same name already exists.
      const dogExists = await Dog.findOne({ name: req.body.name }).exec();
      if (dogExists) {
        // Dog exists. Render the form again with sanitized values/error messages..
        const allBreeds = (await Breed.find()).sort(function (a, b) {
          let textA = a.name.toUpperCase();
          let textB = b.name.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
        res.render("dogs/dog_create", {
          roles: req.session.roles,
          pageTitle: "Create Dog",
          breeds: allBreeds,
          dog,
          errors: [{ msg: "Name already exists!" }],
        });
      } else {
        await dog.save();
        // New dog saved. Redirect to dog detail page.
        res.redirect("/author/dog/" + dog.url);
      }
    }
  }),
];

// Save Cover
function saveCover(dog, coverEncoded) {
  if (coverEncoded == null || coverEncoded == "") return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    dog.coverImage = new Buffer.from(cover.data, "base64");
    dog.coverImageType = cover.type;
  }
}

// READ Dog - detail
exports.dog_detail_get = asyncHandler(async (req, res) => {
  const dog = await Dog.findById(req.params.id).populate("breed");
  res.render("dogs/dog_auth_detail", {
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
  res.render("dogs/dog_auth_list", {
    roles: req.session.roles,
    pageTitle: "Dogs",
    dogs,
  });
});

// UPDATE Dog - GET update form
exports.dog_update_get = asyncHandler(async (req, res) => {
  const dog = await Dog.findById(req.params.id).populate("breed");
  const allBreeds = (await Breed.find()).sort(function (a, b) {
    let textA = a.name.toUpperCase();
    let textB = b.name.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
  res.render("dogs/dog_create", {
    roles: req.session.roles,
    pageTitle: "Update Dog",
    breeds: allBreeds,
    dog,
    errors: "",
  });
});
// UPDATE Dog - POST update form
exports.dog_update_post = [
  // Validate and sanitize the name field.
  body("name", "Name must contain at least 3 characters and less then 50.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("breed", "Please pick a breed.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("favoriteFood", "Favorite Food must contain less then 50 characters.")
    .trim()
    .isLength({ max: 50 })
    .escape(),
  body("description", "Description must contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 }),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a dog object with escaped and trimmed data.
    const dog = new Dog({
      name: req.body.name,
      breed: req.body.breed,
      favoriteFood: req.body.favoriteFood,
      description: req.body.description,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    saveCover(dog, req.body.cover);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      const allBreeds = await Breed.find();
      res.render("dogs/dog_create", {
        roles: req.session.roles,
        pageTitle: "Update Dog",
        breeds: allBreeds,
        dog,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      await Dog.findByIdAndUpdate(req.params.id, dog, {});
      // New dog updated. Redirect to dog detail page.
      res.redirect("/author/dog/" + dog.url);
    }
  }),
];

// DELETE Dog - GET delete form
exports.dog_delete_get = asyncHandler(async (req, res) => {
  const dog = await Dog.findById(req.params.id);
  res.render("dogs/dog_delete", {
    roles: req.session.roles,
    pageTitle: "Delete Dog",
    dog,
  });
});
// DELETE Dog - POST delete form
exports.dog_delete_post = asyncHandler(async (req, res) => {
  await Dog.findByIdAndRemove(req.body.dogid);
  res.redirect("/author/dogs");
});
