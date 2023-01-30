const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.post("/create/role", adminController.postCreateRole);

router.get("/get/roles", adminController.getRoles);

router.put("/edit/role", adminController.putEditRole);

router.delete("/delete/role", adminController.deleteRole);

router.post("/create/user", adminController.postCreateUser);

router.get("/get/all/users", adminController.getAllUsers);

router.delete("/remove/user", adminController.deleteUser);

router.put("/reset/password", adminController.putResetPassword);

module.exports = router;
