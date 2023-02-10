const User = require("../models/users");
const Client = require("../models/clients");
const Branch = require("../models/branches");
const Order = require("../models/orders");
const utilities = require("../utilities/utils");
const Cashbox = require("../models/cashbox");

exports.getUser = async (req, res, next) => {
  const userId = req.callcenterId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found!");
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({ success: true, user: user });
  } catch (err) {
    next(err);
  }
};

exports.getClientInfo = async (req, res, next) => {
  const phoneNumber = req.query.phoneNumber;
  try {
    const client = await Client.findOne(
      { phoneNumber: phoneNumber },
      { clientName: 1, phoneNumber: 1, clientAddress: 1 }
    );
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "client not found!" });
    }
    const branches = await Branch.find({}, { branchRegion: 1 });
    let recommendedBranch;
    for (let branch of branches) {
      if (new RegExp(branch.branchAddress).test(client.clientAddress)) {
        recommendedBranch = branch;
        break;
      }
    }
    return res.status(200).json({
      success: true,
      data: { client: client, branch: recommendedBranch },
    });
  } catch (err) {
    next(err);
  }
};

exports.getRecommendedBranch = async (req, res, next) => {
  const address = req.query.address;
  try {
    const branches = await Branch.find({}, { branchRegion: 1 });
    let recommendedBranch;
    for (let branch of branches) {
      if (new RegExp(branch.branchRegion).test(address)) {
        recommendedBranch = branch;
        break;
      }
    }
    res.status(200).json({ success: true, branch: recommendedBranch });
  } catch (err) {
    next(err);
  }
};

exports.postCreateOrder = async (req, res, next) => {
  const {
    clientId,
    phoneNumber,
    clientName,
    clientAddress,
    branchId,
    orderDetails,
    paymentMethod,
  } = req.body;
  try {
    let lastOrder = await Order.findOne({}, { orderNumber: 1 }).sort({
      _id: -1,
    });
    let orderNum = 0;
    if (!lastOrder) {
      orderNum = 1;
    } else {
      orderNum = lastOrder.orderNumber + 1;
    }
    let client = await Client.findById(clientId);
    if (!client) {
      client = new Client({
        clientName,
        phoneNumber,
        clientAddress,
      });
      await client.save();
    }
    if (req.cashierId) {
      const order = new Order({
        orderNumber: orderNum,
        clientId: client._id,
        clientAddress,
        branchId,
        cashierId: req.cashierId,
        orderDetails,
        paymentMethod,
        orderStatus: "finished",
      });
      await order.save();
      client.orders.push(order._id);
      await client.save();
      const detailedOrder = await order.populate([
        "clientId",
        "branchId",
        "orderDetails.itemId",
      ]);
      const { receipt, total } = await utilities.printReceipt(detailedOrder);
      const receiptUrl = `${req.protocol}s://${req.get(
        "host"
      )}/receipts/${receipt}`;
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
      return res.status(201).json({ success: true, receipt: receiptUrl });
    }
    const order = new Order({
      orderNumber: orderNum,
      clientId: client._id,
      clientAddress,
      branchId,
      orderDetails,
      paymentMethod,
    });
    await order.save();
    client.orders.push(order._id);
    await client.save();
    const branch = await Branch.findById(branchId);
    const detailedOrder = await order.populate("orderDetails.itemId");
    const io = require("../socket").getIo();
    io.to(branch.branchSocket).emit("order_received", { order: detailedOrder });
    res
      .status(201)
      .json({ success: true, message: "order created successfully!" });
  } catch (err) {
    next(err);
  }
};
