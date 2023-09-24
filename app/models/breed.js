const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const BreedSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 50 },
  description: { type: String, required: true, minLength: 3 },
});

// Virtual for breed's url
BreedSchema.virtual("url").get(function () {
  // We don't use an arrow function as we will need the 'this object'.
  return this.id;
});

// Export model
module.exports = mongoose.model("Breed", BreedSchema);
