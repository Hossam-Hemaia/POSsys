const bcryptJs = require("bcryptjs");
const Role = require("../models/roles");
const users = require("../models/users");
const User = require("../models/users");

exports.postCreateRole = async (req, res, next) => {
  const roleName = req.body.roleName;
  try {
    let role;
    role = await Role.findOne({ roleName: roleName });
    if (role) {
      throw new Error("this role already exists!");
    }
    role = new Role({
      roleName,
    });
    await role.save();
    res.status(201).json({ success: true, message: "role has been created" });
  } catch (err) {
    next(err);
  }
};

exports.getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find({}, { _id: 1, roleName: 1 });
    res.status(200).json({ success: true, roles: roles });
  } catch (err) {
    next(err);
  }
};

exports.putEditRole = async (req, res, next) => {
  const { roleId, roleName } = req.body;
  try {
    await Role.findByIdAndUpdate(roleId, { roleName: roleName });
    res.status(201).json({ success: true, message: "Role updated" });
  } catch (err) {
    next(err);
  }
};

exports.deleteRole = async (req, res, next) => {
  const roleId = req.body.roleId;
  try {
    await Role.findByIdAndDelete(roleId);
    res.status(201).json({ success: true, message: "Role deleted" });
  } catch (err) {
    next(err);
  }
};

exports.postCreateUser = async (req, res, next) => {
  const { fullName, username, password, roleId } = req.body;
  try {
    let user = await User.findOne({ fullName: fullName });
    if (user) {
      throw new Error("this user already exist!");
    }
    const hashedPassword = await bcryptJs.hash(password, 12);
    user = new User({
      fullName,
      username,
      password: hashedPassword,
      roleId,
    });
    user.save();
    res.status(201).json({
      success: true,
      user: user,
      message: "New user created successfully!",
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("roleId");
    res.status(200).json({ success: true, users: users });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.body.userId;
  try {
    const deletedAction = await User.findByIdAndDelete(userId);
    if (!deletedAction) {
      throw new Error("faild to delete user");
    }
    res.status(201).json({ success: true, message: "User has been deleted!" });
  } catch (err) {
    next(err);
  }
};

exports.putResetPassword = async (req, res, next) => {
  const { username, newPassword } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      throw new error("User does not exists");
    }
    const hashedNewPassword = await bcryptJs.hash(newPassword, 12);
    user.password = hashedNewPassword;
    await user.save();
    res.status(201).json({
      success: true,
      message: "updated password",
      password: newPassword,
    });
  } catch (err) {
    next(err);
  }
};
