const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const itemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sumBooking: {
    type: Number,
    default: 0,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    default: "night",
  },
  imageId: [
    {
      type: ObjectId,
      ref: "Image",
    },
  ],
  featureId: [
    {
      type: ObjectId,
      ref: "Feature",
    },
  ],
  activityId: [
    {
      type: ObjectId,
      ref: "Activity",
    },
  ],
  categoryId: {
    type: ObjectId,
    ref: "Category",
  },
});

module.exports = mongoose.model("Item", itemSchema);
