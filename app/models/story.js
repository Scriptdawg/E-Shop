const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const StorySchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 50 },
  description: { type: String, required: true, minLength: 3 },
});

// Virtual for story's url
StorySchema.virtual("url").get(function () {
  // We don't use an arrow function as we will need the 'this object'.
  return this.id;
});

// Export model
module.exports = mongoose.model("Story", StorySchema);
