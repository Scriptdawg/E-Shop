const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const RoleSchema = new Schema({
  name: { type: String, required: true },
});

// Export model
module.exports = mongoose.model("Role", RoleSchema);
