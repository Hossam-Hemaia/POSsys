const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const settingsSchema = new Schema(
  {
    taxRate: {
      type: Number,
    },
    discountType: {
      type: String,
    },
    discountAmount: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("setting", settingsSchema);
