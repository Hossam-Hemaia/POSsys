const express = require("express");
const isAuth = require("../validation/is-Auth");
const adminController = require("../controllers/adminController");

const router = express.Router();

//Roles Endpoints
router.post("/create/role", isAuth.adminIsAuth, adminController.postCreateRole);

router.get("/get/roles", isAuth.adminIsAuth, adminController.getRoles);

router.put("/edit/role", isAuth.adminIsAuth, adminController.putEditRole);

router.delete("/delete/role", isAuth.adminIsAuth, adminController.deleteRole);

//Users Endpoints
router.post("/create/user", isAuth.adminIsAuth, adminController.postCreateUser);

router.get("/get/all/users", isAuth.adminIsAuth, adminController.getAllUsers);

router.get("/get/user", isAuth.adminIsAuth, adminController.getUser);

router.put("/edit/user", isAuth.adminIsAuth, adminController.putEditUser);

router.post(
  "/set/user/status",
  isAuth.adminIsAuth,
  adminController.postSetUserStatus
);

router.delete("/remove/user", isAuth.adminIsAuth, adminController.deleteUser);

router.put(
  "/reset/password",
  isAuth.adminIsAuth,
  adminController.putResetPassword
);

//Branches Endpoints
router.post(
  "/create/branch",
  isAuth.adminIsAuth,
  adminController.postCreateBranch
);

router.get("/get/branches", isAuth.adminIsAuth, adminController.getAllBranches);

router.get(
  "/get/branches/list",
  isAuth.adminIsAuth,
  adminController.getBranches
);

router.get("/get/branch", isAuth.adminIsAuth, adminController.getBranch);

router.put("/edit/branch", isAuth.adminIsAuth, adminController.putEditBranch);

router.put(
  "/set/branch/status",
  isAuth.adminIsAuth,
  adminController.putBranchStatus
);

router.delete(
  "/remove/branch",
  isAuth.adminIsAuth,
  adminController.deleteBranch
);

//Category Endpoints
router.post(
  "/create/category",
  isAuth.adminIsAuth,
  adminController.postCreateCategory
);

router.get(
  "/get/categories",
  isAuth.adminIsAuth,
  adminController.getCategories
);

router.get(
  "/get/all/categories",
  isAuth.adminIsAuth,
  adminController.getAllCategories
);

router.get("/get/category", isAuth.adminIsAuth, adminController.getCategory);

router.put(
  "/edit/category",
  isAuth.adminIsAuth,
  adminController.putEditCategory
);

router.delete(
  "/remove/category",
  isAuth.adminIsAuth,
  adminController.deleteCategory
);
module.exports = router;

//Items Endpoints
router.post("/create/item", isAuth.adminIsAuth, adminController.postCreateItem);

router.get("/get/all/items/", isAuth.adminIsAuth, adminController.getAllItems);

router.get("/get/item", isAuth.adminIsAuth, adminController.getItem);

router.get(
  "/get/category/items",
  isAuth.adminIsAuth,
  adminController.getCategoryItems
);

router.put("/edit/item", isAuth.adminIsAuth, adminController.putEditItem);

router.delete("/delete/item", isAuth.adminIsAuth, adminController.deleteItem);

//Units Endpoints
router.post("/create/unit", isAuth.adminIsAuth, adminController.postCreateUnit);

router.get("/get/all/units", isAuth.adminIsAuth, adminController.getAllUnits);

router.get("/get/unit", isAuth.adminIsAuth, adminController.getUnit);

router.put("/edit/unit", isAuth.adminIsAuth, adminController.putEditUnit);

router.delete("/delete/unit", isAuth.adminIsAuth, adminController.deleteUnit);

//Search Endpoints
router.get("/search", isAuth.adminIsAuth, adminController.getSearchResult);

//Settings Endpoits
router.post("/set/tax", isAuth.adminIsAuth, adminController.postTaxRate);

router.post("/set/discount", isAuth.adminIsAuth, adminController.postDiscount);

router.get("/get/settings", isAuth.adminIsAuth, adminController.getSettings);

//Payment Endpoints
router.post(
  "/create/payment",
  isAuth.adminIsAuth,
  adminController.postCreatePayment
);

router.get("/get/payments", isAuth.adminIsAuth, adminController.getPayments);

router.delete(
  "/delete/payment",
  isAuth.adminIsAuth,
  adminController.deletePayment
);
