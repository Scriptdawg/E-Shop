const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Picture = require("../models/picture.js");
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

// PICTURE ROUTES

// CREATE Picture - GET create form
exports.picture_create_get = asyncHandler(async (req, res) => {
  res.render("picture/picture_create", {
    subpageName: "Create Picture",
    roles: req.session.roles,
    pageTitle: "Create Picture",
    picture: {},
    errors: "",
  });
});
// CREATE Picture - POST create form
exports.picture_create_post = [
  // Validate and sanitize the body fields.
  body("name", "Name must contain at least 3 characters and less then 50.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("shortDescription", "Short Description must contain at least 3 characters.").trim(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a picture object with escaped and trimmed data.
    const picture = new Picture({
      name: req.body.name,
      shortDescription: req.body.shortDescription,
      longDescription: req.body.longDescription,
    });

    saveCover(picture, req.body.cover);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("picture/picture_create", {
        subpageName: "Create Picture",
        roles: req.session.roles,
        pageTitle: "Create Picture",
        picture,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Check if picture with same name already exists.
      const pictureExists = await Picture.findOne({ name: req.body.name }).exec();
      if (pictureExists) {
        // Picture exists. Render the form again with sanitized values/error messages..
        res.render("picture/picture_create", {
          subpageName: "Create Picture",
          roles: req.session.roles,
          pageTitle: "Create Picture",
          picture,
          errors: [{ msg: "Name already exists!" }],
        });
      } else {
        await picture.save();
        // New picture saved. Redirect to product detail page.
        res.redirect("/author/picture/" + picture.url);
      }
    }
  }),
];

// Save Cover
function saveCover(picture, coverEncoded) {
  if (coverEncoded == null || coverEncoded == "") return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    picture.coverImage = new Buffer.from(cover.data, "base64");
    picture.coverImageType = cover.type;
  }
}

// READ Picture - detail (author)
exports.picture_detail_get = asyncHandler(async (req, res) => {
  const picture = await Picture.findById(req.params.id);
  res.render("picture/picture_auth_detail", {
    subpageName: "Picture Detail",
    roles: req.session.roles,
    pageTitle: picture.name,
    picture,
  });
});
// READ Picture - detail (public)
exports.picture_detail_public_get = asyncHandler(async (req, res) => {
  const picture = await Picture.findById(req.params.id);
  res.render("picture/picture_detail", {
    subpageName: "Picture Detail",
    roles: req.session.roles,
    pageTitle: picture.name,
    picture,
  });
});
// READ Picture - list (author)
exports.picture_list_get = asyncHandler(async (req, res) => {
  const pictures = (await Picture.find()).sort(function (a, b) {
    let textA = a.name.toUpperCase();
    let textB = b.name.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
  res.render("picture/picture_auth_list", {
    subpageName: "Picture List",
    roles: req.session.roles,
    pageTitle: "Pictures",
    pictures,
  });
});
// READ Picture - list (public)
exports.picture_list_public_get = asyncHandler(async (req, res) => {
  const pictures = (await Picture.find()).sort(function (a, b) {
    let textA = a.name.toUpperCase();
    let textB = b.name.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
  res.render("picture/picture_list", {
    subpageName: "Picture List",
    roles: req.session.roles,
    pageTitle: "Pictures",
    pictures,
  });
});

// UPDATE Picture - GET update form
exports.picture_update_get = asyncHandler(async (req, res) => {
  const picture = await Picture.findById(req.params.id);
  res.render("picture/picture_create", {
    subpageName: "Update Picture",
    roles: req.session.roles,
    pageTitle: "Update Picture",
    picture,
    errors: "",
  });
});
// UPDATE Picture - POST update form
exports.picture_update_post = [
  // Validate and sanitize the body fields.
  body("name", "Name must contain at least 3 characters and less then 50.")
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
    // Create a picture object with escaped and trimmed data.
    const picture = new Picture({
      name: req.body.name,
      shortDescription: req.body.shortDescription,
      longDescription: req.body.longDescription,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    saveCover(picture, req.body.cover);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("picture/picture_create", {
        subpageName: "Update Picture",
        roles: req.session.roles,
        pageTitle: "Update Picture",
        picture,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      await Picture.findByIdAndUpdate(req.params.id, picture, {});
      // Picture updated. Redirect to picture detail page.
      res.redirect("/author/picture/" + picture.url);
    }
  }),
];

// DELETE Picture - GET delete form
exports.picture_delete_get = asyncHandler(async (req, res) => {
  const picture = await Picture.findById(req.params.id);
  res.render("picture/picture_delete", {
    subpageName: "Delete Picture",
    roles: req.session.roles,
    pageTitle: "Delete Picture",
    picture,
  });
});
// DELETE Picture - POST delete form
exports.picture_delete_post = asyncHandler(async (req, res) => {
  await Picture.findByIdAndRemove(req.body.pictureid);
  res.redirect("/author/pictures");
});
