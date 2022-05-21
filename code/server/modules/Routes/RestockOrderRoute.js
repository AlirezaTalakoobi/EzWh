"use strict";
const express = require("express");
const router = express.Router();
const RestockOrderController = require("../Controller/RestockOrderController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const sic = new RestockOrderController(dao);
const { check, param, validationResult } = require("express-validator");

router.get("/restockOrders", sic.getRestockOrders);

router.get(
  "/restockOrder/:id",
  [param("id").isNumeric()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  sic.getRestockOrder
);

router.get("/restockOrdersIssued", sic.getRestockOrdersIssued);

router.post(
  "/restockOrder",
  [
    check("supplierId").isNumeric(),
    check("issueDate").isDate(),
    check("products").isArray(),
    check("products.*.SKUId").isNumeric(),
    check("products.*.description").isString(),
    check("products.*.price").isNumeric(),
    check("products.*.qty").isNumeric(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  sic.createRestockOrder
);

router.put(
  "/restockOrder/:id",
  [
    param("id").isNumeric(),
    check("newState")
      .isString()
      .isIn([
        "ISSUED",
        "DELIVERY",
        "DELIVERED",
        "TESTED",
        "COMPLETEDRETURN",
        "COMPLETED",
      ]),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  sic.changeStateOfRestockOrder
);

router.put(
  "/restockOrder/:id/skuItems",
  [
    param("id").isNumeric(),
    check("skuItems").isArray(),
    check("skuItems.*.rfid").isString().isLength({ min: 32, max: 32 }),
    check("skuItems.*.SKUId").isNumeric(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  sic.addSkuItemsToRestockOrder
);

router.put(
  "/restockOrder/:id/transportNote",
  [
    param("id").isNumeric(),
    check("transportNote").isObject(),
    check("transportNote.deliveryDate").isDate(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  sic.addTransportNoteToRestockOrder
);

router.delete(
  "/restockOrder/:id",
  [param("id").isNumeric()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  sic.deleteRestockOrder
);

module.exports = router;
