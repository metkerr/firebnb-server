const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const bookingSchema = new Schema({
  bookingStartDate: {
    type: Date,
    required: true,
  },
  bookingEndDate: {
    type: Date,
    required: true,
  },
  invoice: {
    type: String,
    required: true,
  },
  itemId: {
    _id: {
      type: ObjectId,
      ref: "Item",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  total: {
    type: Number,
    required: true,
  },
  memberId: {
    type: ObjectId,
    ref: "Member",
  },
  bankId: {
    type: ObjectId,
    ref: "Bank",
  },
  payment: {
    paymentProof: {
      type: String,
      required: true,
    },
    originatingBank: {
      type: String,
      required: true,
    },
    accountHolder: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Process",
    },
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
