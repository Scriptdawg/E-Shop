const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const ProductSchema = new Schema({
  available: { type: Boolean, required: true },
  category: { type: String },
  coverImage: { type: Buffer },
  coverImageType: { type: String },
  longDescription: { type: String },
  name: { type: String, required: true, minLength: 3, maxLength: 50 },
  price: { type: String, required: true },
  priceType: { type: String, required: true },
  shortDescription: { type: String, required: true },
  specialMessage: { type: String },
  story: { type: Schema.Types.ObjectId, ref: "Story", required: true },
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
