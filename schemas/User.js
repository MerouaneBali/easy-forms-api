const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  image: String,

  email: String,
  emailVerified: { type: Boolean, default: false },
  hash: String,
  salt: String,

  created: { type: Date, default: Date.now },
});

module.exports = UserSchema;
