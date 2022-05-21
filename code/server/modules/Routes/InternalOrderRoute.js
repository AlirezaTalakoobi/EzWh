"use strict";
const express = require("express");
const router = express.Router();
const InternalOrderController = require("../Controller/InternalOrderController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const sic = new InternalOrderController(dao);
const { check, param, validationResult } = require("express-validator");

router.get("/internalOrders", sic.getInternalOrders);

router.get(
  "/internalOrder/:id",
  [param("id").isNumeric()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  sic.getInternalOrder
);

router.get("/internalOrdersIssued", sic.getInternalOrdersIssued);

router.get("/internalOrdersAccepted", sic.getInternalOrdersAccepted);

router.post(
  "/internalOrder",
  [
    check("issueDate").notEmpty().custom(d => dayjs(d)),
    check("customerId").isNumeric(),
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
  sic.createInternalOrder
);

router.put(
  "/internalOrder/:id",
  [
    param("id").isNumeric(),
    check("newState")
      .isString()
      .isIn(["ISSUED", "ACCEPTED", "REFUSED", "CANCELED", "COMPLETED"]),
    check("products").optional().isArray(),
    check("products.*.SkuId").isNumeric(),
    check("products.*.RFID").isString().isLength({ min: 32, max: 32 }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  sic.changeStateOfInternalOrder
);

router.delete(
  "/internalOrder/:id",
  [param("id").isNumeric()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  sic.deleteInternalOrder
);

module.exports = router;
