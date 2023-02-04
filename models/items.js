const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itemSchema = new Schema(
  {
    itemTitle: {
      type: String,
      required: true,
    },
    itemPrice: {
      type: String,
      required: true,
    },
    unitId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "unit",
    },
    itemImage: {
      type: String,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "categorie",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("item", itemSchema);
