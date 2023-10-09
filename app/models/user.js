const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const UserSchema = new Schema({
  email: { type: String, required: true },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  password: { type: String, required: true },
  roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
  verificationCode: { type: String, required: true },
  verified: { type: Boolean, required: true },
});

// Export model
module.exports = mongoose.model("User", UserSchema);
