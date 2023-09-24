const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

// Define Schema
const OrderSchema = new Schema({
  userId: String,
  status: String,
  products: [
    {
      quantity: Number,
      id: {
        type: SchemaTypes.ObjectId,
        ref: "Dog",
        required: true,
      },
    },
  ],
});

// Export model
module.exports = mongoose.model("Order", OrderSchema);
