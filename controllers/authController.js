const bcryptJs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Cashbox = require("../models/cashbox");

exports.postUserLogin = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      username: username,
      userStatus: "Active",
    });
    if (!user) {
      throw new Error("Incorrect username or username is suspended");
    }
    const doMatch = await bcryptJs.compare(password, user.password);
    if (!doMatch) {
      throw new Error("Invalid password!");
    }
    if (user.userStatus !== "Active") {
      throw new Error("this user is suspended, please contact administrtor!");
    }
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.SECRET,
      { expiresIn: "24h" }
    );
    if (user.role === "cashier") {
      let cashbox = await Cashbox.findOne({
        cashierId: user._id,
        shiftStatus: "open",
      });
      if (!cashbox) {
        cashbox = new Cashbox({
          cashierId: user._id,
        });
        await cashbox.save();
      }
    }
    res.status(200).json({
      success: true,
      token: token,
      fullName: user.fullName,
      role: user.role,
      userId: user._id,
      branchId: user.branchId,
      message: "You logged in successfully!",
    });
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 422;
    next(error);
  }
};
