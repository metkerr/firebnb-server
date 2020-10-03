const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  salt = 10;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, salt);
  }
});

module.exports = mongoose.model("User", userSchema);
