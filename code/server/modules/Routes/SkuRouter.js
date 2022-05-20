"use strict";

const express = require("express");
const router = express.Router();
const SKUController = require("../Controller/SKUController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const su = new SKUController(dao);
const { check, param, validationResult} = require("express-validator");

router.get("/skus", su.getsku);
router.get("/skus/:id", [param("id").isNumeric()],
(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}, su.getSKUbyId);

router.post("/sku/", [
    check("description").isString().isLength({ min: 1, max: 32 }),
    check("weight").isNumeric(),
    check("volume").isNumeric(),
    check("notes").isString(),
    check("price").isNumeric(),
    check("availableQuantity").isNumeric()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },su.newSKU);
router.put("/sku/:id", [
    param("id").isString().isLength({ min: 1, max: 32 }).not().optional(),
    check("newWeight").isNumeric().optional(),
    check("newVolume").isNumeric().optional(),
    check("newNotes").isString().optional(),
    check("newPrice").isNumeric().optional(),
    check("newAvailableQuantity").isNumeric().optional()
],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  }, su.editsku);
  
router.put("/sku/:id/position", [param("id").isNumeric().not().optional(),
check("position").isString().not().optional()],
(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
},su.editskuPosition);
router.delete("/skus/:id", [param("id").isNumeric().not().optional()],
(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}, su.deleteSKU);

module.exports = router;
