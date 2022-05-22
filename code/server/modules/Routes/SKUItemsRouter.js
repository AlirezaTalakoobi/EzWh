"use strict";
const express = require("express");
const router = express.Router();
const SKUItemsController = require("../Controller/SKUItemsController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const sic = new SKUItemsController(dao);
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
      return res
        .status(422)
        .json({ error: "Validation Failed " + errors.array() });
    }
    next();
  },
  async (req, res) => {
    //sic.newSKUItem;
    const response = await sic.newSKUItem(
      req.body.RFID,
      req.body.SKUId,
      req.body.DateOfStock
    );
    if (response === false) {
      return res.status(500).json({ message: "Internal Server Error" });
    } else if (response.message) {
      return res.status(409).json(response.message);
    } else if (response.skuid) {
      return res.status(404).json(response.skuid);
    } else {
      return res.status(200).json(response);
    }
  }
);
router.get("/skuitems", async (req, res) => {
  const skus = await sic.getSKUItems();
  if (skus) {
    return res.status(200).json(skus);
  } else {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get(
  "/skuitems/sku/:id",
  [param("id").isNumeric()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ error: "Validation Failed " + errors.array() });
    }
    next();
  },
  async (req, res) => {
    const sku = await sic.getSKUItemsBySKUId(req.params.id);
    if (sku) {
      return res.status(200).json(sku);
    } else if (sku.message) {
      return res.status(404).json(sku.message);
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
router.get(
  "/skuitems/:rfid",
  [param("rfid").isString().isLength({ min: 32, max: 32 }).not().optional()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ error: "Validation Failed " + errors.array() });
    }
    next();
  },
  async (req, res) => {
    const sku = await sic.getSKUItemsByRFID(req.params.rfid);
    if (sku) {
      return res.status(200).json(sku);
    } else if (sku.message) {
      return res.status(404).json(sku.message);
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
router.put(
  "/skuitems/:rfid",
  [
    param("rfid").isString().isLength({ min: 32, max: 32 }).not().optional(),
    check("newRFID").optional().isString().isLength({ max: 32 }),
    check("newAvailable").isNumeric().optional(),
  ],
  (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({ error: "Empty Body request" });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: "validation of body or of rfid failed " + errors.array(),
      });
    }
    next();
  },
  async (req, res) => {
    const response = await sic.editRFID(
      req.params.rfid,
      req.body.newRFID,
      parseInt(req.body.newAvailable),
      req.body.newDateOfStock
    );
    if (response) {
      return res.status(200).json(response);
    } else if (response.message) {
      return res.status(404).json(response.message);
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
router.delete(
  "/skuitems/:rfid",
  [param("rfid").isString().isLength({ min: 32, max: 32 }).not().optional()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: "Wrong RFID" });
    }
    next();
  },
  async (req, res) => {
    const result = await sic.deleteItem(req.params.rfid);
    if (result === false) {
      return res.status(500).json({ message: "generic error" });
    } else if (result.message) {
      return res.status(404).json(result.message);
    } else {
      return res.status(204).end();
    }
  }
);
module.exports = router;
