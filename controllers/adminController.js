const bcryptJs = require("bcryptjs");
const Role = require("../models/roles");
const User = require("../models/users");
const Branch = require("../models/branches");
const Category = require("../models/categories");
const Item = require("../models/items");
const Unit = require("../models/units");
const Client = require("../models/clients");
const Setting = require("../models/settings");
const Payment = require("../models/payment");

// Roles CRUD Operations
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
  const ITEMS_PER_PAGE = 12;
  const page = +req.query.page;
  let totalRoles;
  try {
    totalRoles = await Role.find().countDocuments();
    const roles = await Role.find({}, { _id: 1, roleName: 1 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    res.status(200).json({
      success: true,
      data: {
        roles: roles,
        rolesPerPage: ITEMS_PER_PAGE,
        currentPage: page,
        hasNextPage: page * ITEMS_PER_PAGE < totalRoles,
        nextPage: page + 1,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalRoles / ITEMS_PER_PAGE),
      },
    });
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
  const roleId = req.query.roleId;
  try {
    await Role.findByIdAndDelete(roleId);
    res.status(201).json({ success: true, message: "Role deleted" });
  } catch (err) {
    next(err);
  }
};

// Users CRUD Operations
exports.postCreateUser = async (req, res, next) => {
  const { fullName, username, password, role, branchId } = req.body;
  try {
    let user = await User.findOne({ fullName: fullName });
    if (user) {
      const error = new Error("this employee name already exist");
      error.statusCode = 422;
      throw error;
    }
    user = await User.findOne({ username: username });
    if (user) {
      const error = new Error("this username already exist");
      error.statusCode = 422;
      throw error;
    }
    const hashedPassword = await bcryptJs.hash(password, 12);
    user = new User({
      fullName,
      username,
      password: hashedPassword,
      role,
      branchId,
    });
    await user.save();
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
  const page = +req.query.page;
  const ITEMS_PER_PAGE = 12;
  let totalItems;
  try {
    totalItems = await User.find().countDocuments();
    const users = await User.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    res.status(200).json({
      success: true,
      data: {
        users: users,
        itemsPerPage: ITEMS_PER_PAGE,
        currentPage: page,
        hasNextPage: page * ITEMS_PER_PAGE < totalItems,
        nextPage: page + 1,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  const userId = req.query.userId;
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

exports.putEditUser = async (req, res, next) => {
  const { fullName, username, role, branchId, userId } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, {
      fullName: fullName,
      username: username,
      role: role,
      branchId: branchId,
    });
    if (!updatedUser) {
      const error = new Error("user is not found!");
      error.statusCode = 422;
      throw error;
    }
    res.status(201).json({ success: true, message: "User update succeeded!" });
  } catch (err) {
    next(err);
  }
};

exports.postSetUserStatus = async (req, res, next) => {
  const userId = req.body.userId;
  const flag = req.body.flag;
  try {
    const user = await User.findById(userId);
    if (flag === "suspend") {
      user.userStatus = "suspended";
      await user.save();
      return res
        .status(201)
        .json({ success: true, message: "user suspended successfully!" });
    } else if (flag === "activate") {
      user.userStatus = "Active";
      await user.save();
      return res
        .status(201)
        .json({ success: true, message: "user activated successfully!" });
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.query.userId;
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
  const { userId, newPassword } = req.body;
  try {
    const user = await User.findById(userId);
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

//Branches CRUD Operations
exports.postCreateBranch = async (req, res, next) => {
  const { branchName, branchAddress, branchRegion } = req.body;
  try {
    const branch = new Branch({
      branchName,
      branchAddress,
      branchRegion,
    });
    await branch.save();
    res
      .status(201)
      .json({ success: true, message: "Branch created successfully!" });
  } catch (err) {
    next(err);
  }
};

exports.getAllBranches = async (req, res, next) => {
  const page = +req.query.page;
  const ITEMS_PER_PAGE = 12;
  let totalItems;
  try {
    totalItems = await Branch.find().countDocuments();
    const branches = await Branch.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    if (!branches) {
      throw new Error("No branches found!");
    }
    res.status(200).json({
      success: true,
      data: {
        branches: branches,
        itemsPerPage: ITEMS_PER_PAGE,
        currentPage: page,
        hasNextPage: page * ITEMS_PER_PAGE < totalItems,
        nextPage: page + 1,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getBranches = async (req, res, next) => {
  try {
    const branches = await Branch.find();
    if (!branches) {
      throw new Error("No branches found!");
    }
    res.status(200).json({
      success: true,
      branches: branches,
    });
  } catch (err) {
    next(err);
  }
};

exports.getBranch = async (req, res, next) => {
  const branchId = req.query.branchId;
  try {
    const branch = await Branch.findById(branchId);
    if (!branch) {
      const error = new Error("Branch not found!");
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({ success: true, branch: branch });
  } catch (err) {
    next(err);
  }
};

exports.putEditBranch = async (req, res, next) => {
  const { branchName, branchAddress, branchRegion, branchId } = req.body;
  try {
    const branch = await Branch.findByIdAndUpdate(branchId, {
      branchName: branchName,
      branchAddress: branchAddress,
      branchRegion: branchRegion,
    });
    if (!branch) {
      throw new Error("Could not update branch!");
    }
    res
      .status(201)
      .json({ success: true, message: "Branch updated successfully!" });
  } catch (err) {
    next(err);
  }
};

exports.putBranchStatus = async (req, res, next) => {
  const { branchId, status } = req.body;
  try {
    if (status) {
      const branch = await Branch.findByIdAndUpdate(branchId, {
        openingStatus: status,
      });
      return res
        .status(201)
        .json({ success: true, message: "branch status is now open" });
    } else if (!status) {
      const branch = await Branch.findByIdAndUpdate(branchId, {
        openingStatus: status,
      });
      return res
        .status(201)
        .json({ success: true, message: "branch status is now close" });
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteBranch = async (req, res, next) => {
  const branchId = req.query.branchId;
  try {
    const deletedBranch = await Branch.findByIdAndDelete(branchId);
    if (!deletedBranch) {
      throw new Error("faild to delete branch!");
    }
    res.status(201).json({ success: true, message: "Branch deleted!" });
  } catch (err) {
    next(err);
  }
};

//Categories CRUD Operations
exports.postCreateCategory = async (req, res, next) => {
  const categoryName = req.body.categoryName;
  try {
    const category = new Category({
      categoryName,
    });
    await category.save();
    res.status(201).json({ success: true, message: "new category created" });
  } catch (err) {
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  const page = +req.query.page;
  const ITEMS_PER_PAGE = 12;
  let totalItems;
  try {
    totalItems = await Category.find().countDocuments();
    const categories = await Category.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    if (!categories) {
      throw new Error("No categories found!");
    }
    res.status(200).json({
      success: true,
      data: {
        categories: categories,
        itemsPerPage: ITEMS_PER_PAGE,
        currentPage: page,
        hasNextPage: page * ITEMS_PER_PAGE < totalItems,
        nextPage: page + 1,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    if (!categories) {
      throw new Error("No categories found!");
    }
    res.status(200).json({
      success: true,
      categories: categories,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCategory = async (req, res, next) => {
  const categoryId = req.query.categoryId;
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      const error = new Error("Category does not exist!");
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({ success: true, category: category });
  } catch (err) {
    next(err);
  }
};

exports.putEditCategory = async (req, res, next) => {
  const { categoryName, categoryId } = req.body;
  try {
    const categoryUpdated = await Category.findByIdAndUpdate(categoryId, {
      categoryName: categoryName,
    });
    if (!categoryUpdated) {
      throw new Error("Could not update category");
    }
    res
      .status(201)
      .json({ success: true, message: "Category updated successfully!" });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  const categoryId = req.query.categoryId;
  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      throw new Error("could not delete category");
    }
    res.status(201).json({ success: true, message: "category deleted!" });
  } catch (err) {
    next(err);
  }
};

//Items CRUD Operations
exports.postCreateItem = async (req, res, next) => {
  const { itemTitle, itemPrice, unitId, categoryId } = req.body;
  const image = req.file;
  try {
    let item = await Item.findOne({ itemTitle: itemTitle });
    if (item) {
      const error = new Error("this item already exist!");
      error.statusCode = 422;
      throw error;
    }
    let imagePath = image
      ? `${req.protocol}s://${req.get("host")}/${image.path}`
      : "";
    item = new Item({
      itemTitle,
      itemPrice,
      unitId,
      itemImage: imagePath,
      categoryId,
    });
    await item.save();
    res
      .status(201)
      .json({ success: true, message: "item created successfully!" });
  } catch (err) {
    next(err);
  }
};

exports.getAllItems = async (req, res, next) => {
  const ITEMS_PER_PAGE = 12;
  let totalItems;
  let page = +req.query.page;
  try {
    totalItems = await Item.find().countDocuments();
    const items = await Item.find()
      .populate("unitId")
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    if (!items) {
      const error = new Error("No items found!");
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({
      success: true,
      data: {
        items: items,
        itemsPerPage: ITEMS_PER_PAGE,
        currentPage: page,
        hasNextPage: page * ITEMS_PER_PAGE < totalItems,
        nextPage: page + 1,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getItem = async (req, res, next) => {
  const itemId = req.query.itemId;
  try {
    const item = await Item.findById(itemId).populate("unitId");
    if (!item) {
      const error = new Error("item not found!");
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({ success: true, item: item });
  } catch (err) {
    next(err);
  }
};

exports.getCategoryItems = async (req, res, next) => {
  const categoryId = req.query.categoryId;
  const page = +req.query.page;
  const ITEMS_PER_PAGE = 12;
  let totalItems;
  try {
    totalItems = await Item.find({ categoryId: categoryId }).countDocuments();
    const items = await Item.find({ categoryId: categoryId })
      .populate("unitId")
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    if (!items) {
      const error = new Error("No items found!");
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({
      success: true,
      data: {
        items: items,
        itemsPerPage: ITEMS_PER_PAGE,
        currentPage: page,
        hasNextPage: page * ITEMS_PER_PAGE < totalItems,
        nextPage: page + 1,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.putEditItem = async (req, res, next) => {
  const { itemTitle, itemPrice, unitId, categoryId, itemId } = req.body;
  let image = req.file;
  try {
    if (image) {
      const imagePath = `${req.protocol}s://${req.get("host")}/${image.path}`;
      const updatedItem = await Item.findByIdAndUpdate(itemId, {
        itemTitle: itemTitle,
        itemPrice: itemPrice,
        unitId: unitId,
        itemImage: imagePath,
        categoryId: categoryId,
      });
      if (!updatedItem) {
        const error = new Error("item update faild!");
        error.statusCode = 422;
        throw error;
      }
      return res
        .status(201)
        .json({ success: true, message: "Item update succeeded!" });
    }
    const updatedItem = await Item.findByIdAndUpdate(itemId, {
      itemTitle: itemTitle,
      itemPrice: itemPrice,
      unitId: unitId,
      categoryId: categoryId,
    });
    if (!updatedItem) {
      const error = new Error("item update faild!");
      error.statusCode = 422;
      throw error;
    }
    res.status(201).json({ success: true, message: "Item update succeeded!" });
  } catch (err) {
    next(err);
  }
};

exports.deleteItem = async (req, res, next) => {
  const itemId = req.query.itemId;
  try {
    const deletedItem = await Item.findByIdAndDelete(itemId);
    if (!deletedItem) {
      throw new Error("Could not delete item!");
    }
    res
      .status(201)
      .json({ success: true, message: "Removing item succeeded!" });
  } catch (err) {
    next(err);
  }
};

//Units CRUD Operation
exports.postCreateUnit = async (req, res, next) => {
  const { unitName, unitValue } = req.body;
  try {
    let unit = await Unit.findOne({ unitName: unitName });
    if (unit) {
      const error = new Error("This unit already created!");
      error.statusCode = 422;
      throw error;
    }
    unit = new Unit({
      unitName,
      unitValue,
    });
    await unit.save();
    res
      .status(201)
      .json({ success: true, message: "Unit created successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getAllUnits = async (req, res, next) => {
  try {
    const units = await Unit.find();
    if (!units) {
      const error = new Error("No units found!");
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({ success: true, units: units });
  } catch (err) {
    next(err);
  }
};

exports.getUnit = async (req, res, next) => {
  const unitId = req.query.unitId;
  try {
    const unit = await Unit.findById(unitId);
    if (!unit) {
      const error = new Error("No units found!");
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({ success: true, unit: unit });
  } catch (err) {
    next(err);
  }
};

exports.putEditUnit = async (req, res, next) => {
  const { unitName, unitValue, unitId } = req.body;
  try {
    const updatedUnit = await Unit.findByIdAndUpdate(unitId, {
      unitName: unitName,
      unitValue: unitValue,
    });
    if (!updatedUnit) {
      const error = new Error("no unit found!");
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({ success: true, message: "unit update successful" });
  } catch (err) {
    next(err);
  }
};

exports.deleteUnit = async (req, res, next) => {
  const unitId = req.query.unitId;
  try {
    const deletedUnit = await Unit.findByIdAndDelete(unitId);
    if (!deletedUnit) {
      const error = new Error("No units found!");
      error.statusCode = 422;
      throw error;
    }
    res
      .status(201)
      .json({ success: true, message: "Unit deleted successfully!" });
  } catch (err) {
    next(err);
  }
};

//search
exports.getSearchResult = async (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  const searchCategory = req.query.searchCategory;
  try {
    if (req.callcenterId) {
      const searchResults = await Item.find({
        itemTitle: { $regex: searchTerm, $options: "i" },
      });
      if (!searchResults) {
        const error = new Error("No results found!");
        error.statusCode = 422;
        throw error;
      }
      return res.status(200).json({ success: true, results: searchResults });
    }
    if (searchCategory === "categories") {
      const searchResults = await Category.find({
        categoryName: { $regex: searchTerm, $options: "i" },
      });
      if (!searchResults) {
        const error = new Error("No results found!");
        error.statusCode = 422;
        throw error;
      }
      return res.status(200).json({ success: true, results: searchResults });
    } else if (searchCategory === "items") {
      const searchResults = await Item.find({
        itemTitle: { $regex: searchTerm, $options: "i" },
      });
      if (!searchResults) {
        const error = new Error("No results found!");
        error.statusCode = 422;
        throw error;
      }
      return res.status(200).json({ success: true, results: searchResults });
    } else if (searchCategory === "branches") {
      const searchResults = await Branch.find({
        $or: [
          { branchName: { $regex: searchTerm, $options: "i" } },
          { branchAddress: { $regex: searchTerm, $options: "i" } },
          { branchRegion: { $regex: searchTerm, $options: "i" } },
        ],
      });
      if (!searchResults) {
        const error = new Error("No results found!");
        error.statusCode = 422;
        throw error;
      }
      return res.status(200).json({ success: true, results: searchResults });
    } else if (searchCategory === "clients") {
      const searchResults = await Client.find({
        $or: [
          { clientName: { $regex: searchTerm, $options: "i" } },
          { phoneNumber: { $regex: searchTerm, $options: "i" } },
          { clientAddress: { $regex: searchTerm, $options: "i" } },
        ],
      });
      if (!searchResults) {
        const error = new Error("No results found!");
        error.statusCode = 422;
        throw error;
      }
      return res.status(200).json({ success: true, results: searchResults });
    } else if (searchCategory === "users") {
      const searchResults = await User.find({
        $or: [
          { fullName: { $regex: searchTerm, $options: "i" } },
          { username: { $regex: searchTerm, $options: "i" } },
        ],
      });
      if (!searchResults) {
        const error = new Error("No results found!");
        error.statusCode = 422;
        throw error;
      }
      return res.status(200).json({ success: true, results: searchResults });
    }
  } catch (err) {
    next(err);
  }
};

//settings
exports.postTaxRate = async (req, res, next) => {
  const taxRate = req.body.taxRate;
  try {
    let settings = await Setting.findOne({});
    if (settings) {
      settings.taxRate = taxRate;
      await settings.save();
    } else {
      settings = new Setting({
        taxRate,
      });
      await settings.save();
    }
    res
      .status(201)
      .json({ success: true, message: "Your settings has been saved!" });
  } catch (err) {
    err.statusCode = 422;
    next(err);
  }
};

exports.postDiscount = async (req, res, next) => {
  const { discountType, discountAmount } = req.body;
  try {
    let settings = await Setting.findOne({});
    if (settings) {
      settings.discountType = discountType;
      settings.discountAmount = discountAmount;
      await settings.save();
    } else {
      settings = new Setting({
        discountType,
        discountAmount,
      });
      await settings.save();
    }
    res
      .status(201)
      .json({ success: true, message: "Your settings has been saved!" });
  } catch (err) {
    err.statusCode = 422;
    next(err);
  }
};

exports.getSettings = async (req, res, next) => {
  try {
    const settings = await Setting.findOne({});
    res.status(200).json({ success: true, settings: settings });
  } catch (err) {
    next(err);
  }
};

//payment methods
exports.postCreatePayment = async (req, res, next) => {
  const paymentMethod = req.body.paymentMethod;
  try {
    let payment = await Payment.findOne({ paymentMethod: paymentMethod });
    if (payment) {
      const error = new Error("Payment mehtod already exist!");
      error.statusCode = 422;
      throw error;
    }
    payment = new Payment({
      paymentMethod,
    });
    await payment.save();
    res.status(201).json({ success: true, message: "Payment method created!" });
  } catch (err) {
    next(err);
  }
};

exports.getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find();
    if (!payments) {
      const error = new Error("No payments found!");
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({ payments: payments });
  } catch (err) {
    next(err);
  }
};

exports.deletePayment = async (req, res, next) => {
  const paymentId = req.query.paymentId;
  try {
    const deletedPayment = await Payment.findByIdAndDelete(paymentId);
    if (!deletedPayment) {
      const error = new Error("faild to delete payment");
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({ success: true, message: "Payment method deleted!" });
  } catch (err) {
    next(err);
  }
};
