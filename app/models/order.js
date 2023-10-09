const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const OrderSchema = new Schema({
  //? products = [ { productid: 0, qty: 0, favorite: false, later: false } ];
  products: { type: Array, required: true },
  userId: { type: String, required: true },
});

// Virtual for order's url
OrderSchema.virtual("url").get(function () {
  // We don't use an arrow function as we will need the 'this object'.
  return this.id;
});

// Export model
module.exports = mongoose.model("Order", OrderSchema);
