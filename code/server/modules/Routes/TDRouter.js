"use strict";

const express = require("express");
const router = express.Router();
const SKUController = require("../Controller/SKUController");
const DAO = require("../DB/DAO");
const dao = new DAO();
console.log("test");
const su = new SKUController(dao);

router.get("/skus", su.getsku);
router.get("/skus/:id", su.getSKUbyId);
router.post("/sku/", su.newSKU);
router.put("/sku/:id", su.editsku);
router.put("/sku/:id/position", su.editskuPosition);
router.delete("/skus/:id", su.deleteSKU);

module.exports = router;
