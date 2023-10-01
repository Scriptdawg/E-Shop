const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const ProductSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 50 },
  price: { type: Number, require: true },
  story: { type: Schema.Types.ObjectId, ref: "Story", required: true },
  favoriteFood: { type: String, maxLength: 50 },
  description: { type: String, required: true, minLength: 3 },
  coverImage: { type: Buffer },
  coverImageType: { type: String },
});

// Virtual for product's url
ProductSchema.virtual("url").get(function () {
  // We don't use an arrow function as we will need the 'this object'.
  return this._id;
});

// Virtual for coverImagePath
ProductSchema.virtual("coverImagePath").get(function () {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${
      this.coverImageType
    };charset=utf-8;base64,${this.coverImage.toString("base64")}`;
  }
});

// Export model
module.exports = mongoose.model("Product", ProductSchema);
