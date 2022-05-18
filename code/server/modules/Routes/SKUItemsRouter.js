"use strict";
const express = require("express");
const router = express.Router();
const SKUItemsController = require("../Controller/SKUItemsController");
const SIDAO = require("../DB/SkuItemDAO");
const sidao = new SIDAO();
const sic = new SKUItemsController(sidao);

router.post("/skuitem", sic.newSKUItem);
router.get("/skuitems", sic.getSKUItems);
router.get("/skuitems/sku/:id", sic.getSKUItemsBySKUId);
router.get("/skuitems/:rfid", sic.getSKUItemsByRFID);
router.put("/skuitems/:rfid", sic.editRFID);
router.delete("/skuitems/:rfid", sic.deleteItem);
module.exports = router;
