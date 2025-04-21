const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String },
  surname: { type: String },
  dateOfBirth: { type: Number },
  phone: { type: Number },
  balance: { type: Number },
  password: { type: String, required: true },
  Floor: { type: String },
});

module.exports = model("User", UserSchema);
