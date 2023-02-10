const express = require("express");
const isAuth = require("../validation/is-Auth");
const callcenterController = require("../controllers/callcenterController");
const adminController = require("../controllers/adminController");
const router = express.Router();

router.get(
  "/categories",
  isAuth.callcenterIsAuth,
  adminController.getAllCategories
);

router.get("/items", isAuth.callcenterIsAuth, adminController.getAllItems);

router.get(
  "/cate/items",
  isAuth.callcenterIsAuth,
  adminController.getCategoryItems
);

router.get("/settings", isAuth.callcenterIsAuth, adminController.getSettings);

router.get("/search", isAuth.callcenterIsAuth, adminController.getSearchResult);

router.get(
  "/client/info",
  isAuth.callcenterIsAuth,
  callcenterController.getClientInfo
);

router.get("/branches", isAuth.callcenterIsAuth, adminController.getBranches);

router.get(
  "/recommend/branch",
  isAuth.callcenterIsAuth,
  callcenterController.getRecommendedBranch
);

router.post(
  "/create/order",
  isAuth.callcenterIsAuth,
  callcenterController.postCreateOrder
);

module.exports = router;
