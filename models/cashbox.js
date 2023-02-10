const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cashboxSchema = new Schema(
  {
    shiftStatus: {
      type: String,
      default: "open",
    },
    cashierId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    shiftOrders: [
      {
        orderId: {
          type: Schema.Types.ObjectId,
          ref: "order",
        },
        orderAmount: {
          type: Number,
        },
        paymentMethod: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("cashbox", cashboxSchema);
