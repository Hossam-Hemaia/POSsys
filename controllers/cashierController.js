const Order = require("../models/orders");
const Branch = require("../models/branches");
const utilities = require("../utilities/utils");
const Cashbox = require("../models/cashbox");
const Payment = require("../models/payment");

exports.getPendingOrders = async (req, res, next) => {
  try {
    const pendingOrders = await Order.find({ orderStatus: "pending" });
    if (!pendingOrders) {
      const error = new Error("no pending orders");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, pendingOrders: pendingOrders });
  } catch (err) {
    next(err);
  }
};

exports.getPrintDispatchOrder = async (req, res, next) => {
  const orderId = req.query.orderId;
  try {
    const order = await Order.findById(orderId).populate([
      "clientId",
      "branchId",
      "orderDetails.itemId",
    ]);
    const { receipt } = await utilities.printReceipt(order);
    const receiptUrl = `${req.protocol}s://${req.get(
      "host"
    )}/receipts/${receipt}`;
    order.orderStatus = "delivery";
    await order.save();
    res.status(200).json({ success: true, receiptUrl: receiptUrl });
  } catch (err) {
    next(err);
  }
};

exports.getDeliveryOrder = async (req, res, next) => {
  try {
    const deliveryOrders = await Order.find({ orderStatus: "delivery" });
    if (!deliveryOrders) {
      const error = new Error("no orders found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, deliveryOrders: deliveryOrders });
  } catch (err) {
    next(err);
  }
};

exports.postFinishOrder = async (req, res, next) => {
  const { orderId, paymentMethod } = req.body;
  try {
    const order = await Order.findById(orderId).populate("orderDetails.itemId");
    if (!order) {
      const error = new Error("order not found!");
      error.statusCode = 404;
      throw error;
    }
    order.orderStatus = "finished";
    order.paymentMethod = paymentMethod;
    await order.save();
    const total = await utilities.calcOrderTotal(order);
    const cashbox = await Cashbox.findOne({
      cashierId: req.cashierId,
      shiftStatus: "open",
    });
    cashbox.shiftOrders.push({
      orderId: order._id,
      orderAmount: total,
      paymentMethod: order.paymentMethod,
    });
    await cashbox.save();
    const branch = await Branch.findById(order.branchId);
    const io = require("../socket").getIo();
    io.to(branch.branchSocket).emit("order_paid", { amount: total });
    res.status(201).json({ success: true, message: "order paid successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getPaymentMethods = async (req, res, next) => {
  try {
    const payments = await Payment.find();
    res.status(200).json({ success: true, payments: payments });
  } catch (err) {
    next(err);
  }
};
