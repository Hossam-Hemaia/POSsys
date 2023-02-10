const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const branchSchema = new Schema(
  {
    branchName: {
      type: String,
      required: true,
    },
    branchAddress: {
      type: String,
      required: true,
    },
    branchRegion: {
      type: String,
      required: true,
    },
    openingStatus: {
      type: Boolean,
      default: true,
    },
    branchSocket: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("branch", branchSchema);
