const mongoose = require("mongoose");
const { Schema } = mongoose;

const bankSchema = new Schema({
  bankName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Bank", bankSchema);
