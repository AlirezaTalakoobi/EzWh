"use strict";
const express = require("express");
const router = express.Router();
const SKUItemsController = require("../Controller/SKUItemsController");
const SIDAO = require("../DB/SkuItemDAO");
const sidao = new SIDAO();
const sic = new SKUItemsController(sidao);
const { check, param, validationResult } = require("express-validator");

router.post(
  "/skuitem",
  [
    check("RFID").isString().isLength({ min: 32, max: 32 }),
    check("SKUId").isNumeric(),
    //check("DateOfStock").optional().toDate(),
    check("DateOfStock").optional().isDate(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  sic.newSKUItem
);
router.get("/skuitems", sic.getSKUItems);
router.get(
  "/skuitems/sku/:id",
  [param("id").isNumeric()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  sic.getSKUItemsBySKUId
);
router.get(
  "/skuitems/:rfid",
  [param("rfid").isString().isLength({ min: 32, max: 32 }).not().optional()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  sic.getSKUItemsByRFID
);
router.put(
  "/skuitems/:rfid",
  [
    param("rfid").isString().isLength({ min: 32, max: 32 }).not().optional(),
    check("newRFID").optional().isString().isLength({ max: 32 }),
    check("newAvailable").isNumeric().optional(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  sic.editRFID
);
router.delete(
  "/skuitems/:rfid",
  [param("rfid").isString().isLength({ min: 32, max: 32 }).not().optional()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  sic.deleteItem
);
module.exports = router;
