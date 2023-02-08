const User = require("../models/users");
const Client = require("../models/clients");
const Branch = require("../models/branches");
const Order = require("../models/orders");

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
      if (new RegExp(branch.branchAddress).test(address)) {
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
  } = req.body;
  try {
    let client = await Client.findById(clientId);
    if (!client) {
      client = new Client({
        clientName,
        phoneNumber,
        clientAddress,
      });
      await client.save();
    }
    const order = new Order({
      clientId: client._id,
      clientAddress,
      branchId,
      orderDetails,
    });
    await order.save();
    client.orders.push(order._id);
    await client.save();
    res
      .status(201)
      .json({ success: true, message: "order created successfully!" });
  } catch (err) {
    next(err);
  }
};


