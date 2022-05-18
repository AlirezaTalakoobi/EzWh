"use strict";
const express = require("express");
const router = express.Router();
const InternalOrderController = require("../Controller/InternalOrderController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const sic = new InternalOrderController(dao);


router.get("/internalOrders", sic.getInternalOrders);
router.get("/internalOrder/:id", sic.getInternalOrder);
router.get("/internalOrdersIssued", sic.getInternalOrdersIssued);
router.get("/internalOrdersAccepted", sic.getInternalOrdersAccepted);
router.post("/internalOrder", sic.createInternalOrder);
router.put("/internalOrder/:id", sic.changeStateOfInternalOrder);
router.delete("internalOrder/:id", sic.deleteInternalOrder);

module.exports = router;