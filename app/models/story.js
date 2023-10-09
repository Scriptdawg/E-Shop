const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const StorySchema = new Schema({
  content: { type: String }, // textarea - editor plugin
  synopsis: { type: String, required: true, minLength: 3 },
  introduction: { type: String },
  name: { type: String, required: true, minLength: 3, maxLength: 50 },
});

// Virtual for story's url
StorySchema.virtual("url").get(function () {
  // We don't use an arrow function as we will need the 'this object'.
  return this.id;
});

// Export model
module.exports = mongoose.model("Story", StorySchema);
