const express = require("express");
const isAuth = require("../validation/is-Auth");
const callcenterController = require("../controllers/callcenterController");
const adminController = require("../controllers/adminController");
const cashierController = require("../controllers/cashierController");
const router = express.Router();

router.get(
  "/cashier/pending/orders",
  isAuth.cashierIsAuth,
  cashierController.getPendingOrders
);

router.get(
  "/cashier/print/order",
  isAuth.cashierIsAuth,
  cashierController.getPrintDispatchOrder
);

router.get(
  "/delivery/orders",
  isAuth.cashierIsAuth,
  cashierController.getDeliveryOrder
);

router.post(
  "/finish/order",
  isAuth.cashierIsAuth,
  cashierController.postFinishOrder
);

router.get(
  "/cashier/categories",
  isAuth.cashierIsAuth,
  adminController.getAllCategories
);

router.get("/cashier/items", isAuth.cashierIsAuth, adminController.getAllItems);

router.get(
  "/cashier/cate/items",
  isAuth.cashierIsAuth,
  adminController.getCategoryItems
);

router.get(
  "/cashier/settings",
  isAuth.cashierIsAuth,
  adminController.getSettings
);

router.get(
  "/cashier/search",
  isAuth.cashierIsAuth,
  adminController.getSearchResult
);

router.get(
  "/cashier/client/info",
  isAuth.cashierIsAuth,
  callcenterController.getClientInfo
);

router.post(
  "/cashier/create/order",
  isAuth.cashierIsAuth,
  callcenterController.postCreateOrder
);

router.get('/cashier/payment/methods', isAuth.cashierIsAuth)

module.exports = router;
