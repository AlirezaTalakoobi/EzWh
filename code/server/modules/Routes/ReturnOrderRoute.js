"use strict";
const express = require("express");
const router = express.Router();
const ReturnOrderController = require("../Controller/ReturnOrderController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const sic = new ReturnOrderController(dao);
const { check, param, validationResult } = require("express-validator");

router.get("/returnOrders", sic.getReturnOrders);

router.get(
  "/returnOrder/:id",
  [param("id").isNumeric()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  sic.getReturnOrder
);

router.post(
  "/returnOrder",
  [
    check("returnDate").notEmpty().custom(d => dayjs(d)),
    check("restockOrderId").isNumeric(),
    check("products").isArray(),
    check("products.*.SKUId").isNumeric(),
    check("products.*.description").isString(),
    check("products.*.price").isNumeric(),
    check("products.*.RFID").isString().isLength({ min: 32, max: 32 }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  sic.createReturnOrder
);

router.delete(
  "/returnOrder/:id",
  [param("id").isNumeric()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  sic.deleteReturnOrder
);

module.exports = router;
