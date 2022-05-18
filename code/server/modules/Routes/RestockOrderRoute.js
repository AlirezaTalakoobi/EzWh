"use strict";
const express = require("express");
const router = express.Router();
const RestockOrderController = require("../Controller/RestockOrderController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const sic = new RestockOrderController(dao);


router.get("/restockOrders", sic.getRestockOrders);
router.get("/restockOrder/:id", sic.getRestockOrder);
router.get("/restockOrdersIssued", sic.getRestockOrdersIssued);
router.post("/restockOrder", sic.createRestockOrder);
router.put("/restockOrder/:id", sic.changeStateOfRestockOrder);
router.put("/restockOrder/:id/skuItems", sic.addSkuItemsToRestockOrder);
router.put("/restockOrder/:id/transportNote", sic.addTransportNoteToRestockOrder);
router.delete("restockOrder/:id", sic.deleteRestockOrder);

module.exports = router;