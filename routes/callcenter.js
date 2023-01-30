const express = require("express");
const callcenterController = require("../controllers/callcenterController");
const router = express.Router();

router.get("/pos/system", callcenterController.getPosSystem);

module.exports = router;
