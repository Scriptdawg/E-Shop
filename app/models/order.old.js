const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Schema
const OrderSchema = new Schema({
  userId: { type: String, required: true },
  status: { type: String, required: true },
  products: { type: Array, type: Object, required: true },
  //itemId: { type: Schema.Types.ObjectId, ref: "Dog", required: true },
});

// Export model
module.exports = mongoose.model("Order", OrderSchema);
