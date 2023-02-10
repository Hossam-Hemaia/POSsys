const Branch = require("../models/branches");

exports.updateBranchSocket = (socket) => {
  try {
    socket.on("cashier_logged_in", async (event) => {
      const branch = await Branch.findById(event.branchId);
      branch.branchSocket = socket.id;
      await branch.save();
    });
  } catch (err) {
    console.log(err);
  }
};
