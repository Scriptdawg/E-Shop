const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Product = require("../models/product.js");
const Story = require("../models/story.js");

//! STORY ROUTES

// CREATE Story - GET create form
exports.story_create_get = asyncHandler(async (req, res) => {
  res.render("story/story_create", {
    roles: req.session.roles,
    pageTitle: "Create Story",
    story: {},
    errors: "",
  });
});
// CREATE Story - POST create form
exports.story_create_post = [
  // Validate and sanitize the body fields.
  body("name", "Name must contain at least 3 characters and less then 50.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("synopsis", "Synopsis must contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 }),
  body("introduction", "Invalid introduction.").trim().escape(),
  body("content", "Invalid content.").trim().escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a story object with escaped and trimmed data.
    const story = new Story({
      name: req.body.name,
      synopsis: req.body.synopsis,
      introduction: req.body.introduction,
      content: req.body.content,
    });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("story/story_create", {
        roles: req.session.roles,
        pageTitle: "Create Story",
        story,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Check if story with same name already exists.
      const storyExists = await Story.findOne({ name: req.body.name }).exec();
      if (storyExists) {
        // Story exists. Render the form again with sanitized values/error messages..
        res.render("story/story_create", {
          roles: req.session.roles,
          pageTitle: "Create Story",
          story,
          errors: [{ msg: "Name already exists!" }],
        });
      } else {
        await story.save();
        // New story saved. Redirect to story detail page.
        res.redirect("/author/story/" + story.url);
      }
    }
  }),
];

// READ Story - detail
exports.story_detail_get = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  res.render("story/story_detail", {
    roles: req.session.roles,
    pageTitle: story.name,
    story,
  });
});
// READ Story - list
exports.story_list_get = asyncHandler(async (req, res) => {
  const stories = (await Story.find()).sort(function (a, b) {
    let textA = a.name.toUpperCase();
    let textB = b.name.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
  res.render("story/story_list", {
    roles: req.session.roles,
    pageTitle: "Stories",
    stories,
  });
});

// UPDATE Story - GET update form
exports.story_update_get = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  res.render("story/story_create", {
    roles: req.session.roles,
    pageTitle: "Update Story",
    story,
    errors: "",
  });
});
// UPDATE Story - POST update form
exports.story_update_post = [
  // Validate and sanitize the name field.
  body("name", "Name must contain at least 3 characters and less then 50.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("synopsis", "Synopsis must contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 }),
  body("introduction", "Invalid introduction.").trim().escape(),
  body("content", "Invalid content.").trim().escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a story object with escaped and trimmed data.
    const story = new Story({
      name: req.body.name,
      synopsis: req.body.synopsis,
      introduction: req.body.introduction,
      content: req.body.content,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("story/story_create", {
        roles: req.session.roles,
        pageTitle: "Update Story",
        story,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      await Story.findByIdAndUpdate(req.params.id, story, {});
      // New story updated. Redirect to story detail page.
      res.redirect("/author/story/" + story.url);
    }
  }),
];

// DELETE Story - GET delete form
exports.story_delete_get = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  res.render("story/story_delete", {
    roles: req.session.roles,
    pageTitle: "Delete Story",
    story,
    products: "",
  });
});
// DELETE Story - POST delete form
exports.story_delete_post = asyncHandler(async (req, res) => {
  // Check if story assigned to any products.
  const products = await Product.find({ story: req.params.id });
  if (products.length > 0) {
    // Story assigned. Return to form - display errors.
    const story = await Story.findById(req.params.id);
    res.render("story/story_delete", {
      roles: req.session.roles,
      pageTitle: "Delete Story",
      story,
      products,
    });
    return;
  }
  await Story.findByIdAndRemove(req.body.storyid);
  res.redirect("/author/stories");
});
