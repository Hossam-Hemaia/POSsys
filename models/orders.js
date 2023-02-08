const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "client",
    },
    clientAddress: {
      type: String,
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: "branch",
      required: true,
    },
    orderDetails: [
      {
        itemId: { type: Schema.Types.ObjectId, required: true, ref: "item" },
        quantity: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
