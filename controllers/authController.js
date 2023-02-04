const bcryptJs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

exports.postUserLogin = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      throw new Error("Incorrect username");
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
    res.status(200).json({
      success: true,
      token: token,
      message: "You logged in successfully!",
    });
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 422;
    next(error);
  }
};
