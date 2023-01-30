const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    categoryLogo: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("categorie", categorySchema);
