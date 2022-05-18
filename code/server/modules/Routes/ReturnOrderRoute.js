"use strict";
const express = require("express");
const router = express.Router();
const ReturnOrderController = require("../Controller/ReturnOrderController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const sic = new ReturnOrderController(dao);


router.get("/returnOrders", sic.getReturnOrders);
router.get("/returnOrder/:id", sic.getReturnOrder);
router.post("/returnOrder", sic.createReturnOrder);
router.delete("internalOrder/:id", sic.deleteReturnOrder);

module.exports = router;