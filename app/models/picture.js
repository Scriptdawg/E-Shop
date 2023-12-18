const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const PictureSchema = new Schema({
  coverImage: { type: Buffer },
  coverImageType: { type: String },
  longDescription: { type: String },
  name: { type: String, required: true, minLength: 3, maxLength: 50 },
  shortDescription: { type: String, required: true },
});

// Virtual for pictures's url
PictureSchema.virtual("url").get(function () {
  // We don't use an arrow function as we will need the 'this object'.
  return this._id;
});

// Virtual for coverImagePath
PictureSchema.virtual("coverImagePath").get(function () {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${
      this.coverImageType
    };charset=utf-8;base64,${this.coverImage.toString("base64")}`;
  }
});

// Export model
module.exports = mongoose.model("Picture", PictureSchema);
