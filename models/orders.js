const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "client",
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
