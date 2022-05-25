"use strict";

const express = require("express");
const router = express.Router();
const SKUController = require("../Controller/SKUController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const su = new SKUController(dao);
const { check, param, validationResult } = require("express-validator");
const { init } = require("express/lib/application");

router.get("/skus", async (req, res) => {
  const skus = await su.getsku();
  //console.log(skus);
  if (skus === undefined) {
    return res.status(401).json({ message: "SKU does not exist" });
  } else if (skus.message) {
    return res.status(500).json(skus.message);
  } else {
    return res.status(200).json(skus);
  }
});
router.get(
  "/skus/:id",
  [param("id").isNumeric()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  async (req, res) => {
    const params = req.params.id;

    const sku = await su.getSKUbyId(params);
    if (!sku) {
      return res.status(404).json({ message: "No SKU associated to id" });
    } else {
      return res.status(200).json(sku);
    }
  },
  su.getSKUbyId
);

router.post(
  "/sku/",
  [
    check("description").isString().isLength({ min: 1, max: 32 }),
    check("weight").isNumeric(),
    check("volume").isNumeric(),
    check("notes").isString(),
    check("price").isNumeric(),
    check("availableQuantity").isNumeric(),
  ],
  (req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  async (req, res) => {
    const sku = await su.newSKU(req.body);

    if (sku.message) {
      return res.status(503).json(sku.message);
    } else {
      //console.log(result);

      return res.status(200).json(sku);
    }
  },
  su.newSKU
);
router.put(
  "/sku/:id",
  [
    param("id").isString().isLength({ min: 1, max: 32 }).not().optional(),
    check("newWeight").isNumeric().optional(),
    check("newVolume").isNumeric().optional(),
    check("newNotes").isString().optional(),
    check("newPrice").isNumeric().optional(),
    check("newAvailableQuantity").isNumeric().optional(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  async (req, res) => {
    const sku = await su.editsku(req.body, req.params.id);

    if (sku.message) {
      return res.status(404).json(sku.message);
    } else if (sku) {
      return res.status(200).json({ message: "Success" });
    } else if (sku == 2) {
      return res.status(422).json({ message: "Not enough space" });
    } else if (sku == 3) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  su.editsku
);

router.put(
  "/sku/:id/position",
  [
    param("id").isNumeric().not().optional(),
    check("position").isString().not().optional(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  async (req, res) => {
    const sku = await su.editsku(req.body.position, req.params.id);

    if (sku.message) {
      return res.status(404).json(sku.message);
    } else if (sku) {
      return res.status(200).json({ message: "Success" });
    } else if (sku == 2) {
      return res.status(422).json({ message: "Unprocessable Entity" });
    } else if (sku == 3) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  su.editskuPosition
);
router.delete(
  "/skus/:id",
  [param("id").isNumeric().not().optional()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  async (req, res) => {
    const params = req.params.id;

    const sku = await su.deleteSKU(params);
    // if (sku.message) {
    //   return res.status(404).json(sku.message);

    // } else if(sku == 1){
    //   res.status(500).json({message:"Internal server Error"});

    // }else if (sku) {
    //   console.log(sku);
    //   return res.status(200).json({message:"Seccess"});
    // }

    if (sku == 1) {
      return res.status(404).json({ message: "No SKU associated to id" });
    } else if (sku == false) {
      res.status(500).json("Internal Server Error");
    } else {
      return res.status(204).json({ message: "Seccess" });
    }
  },
  su.deleteSKU
);

module.exports = router;
