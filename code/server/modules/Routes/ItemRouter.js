"use strict";
const express = require("express");
const router = express.Router();
const ItemController = require("../Controller/ItemController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const uc = new ItemController(dao);
const { check, body, param, validationResult } = require("express-validator");

/* Manager  */
// router.get("/items", uc.getItems);
router.get(
  "/items/:id/:supplierId",
  param("id").isInt({ min: 0 }).notEmpty().not().optional(),
  param("supplierId").isInt({ min: 0 }).notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  async (req, res) => {
    const result = await uc.getItemByID(req.params.id, req.params.supplierId);
    if (result["ans"] === 404) {
      return res.status(404).send("404 ITEM NOT FOUND");
    } else if (result["ans" === 500]) {
      return res.status(500).send("500 Internal Server Error");
    }
    return res.status(200).json(result["result"]);
  }
);

/* supplier  */
router.get("/items", async (req, res) => {
  const result = await uc.getItems();
  if (result["ans"] == 200) {
    res.status(200).json(result["result"]);
  } else {
    res.status(500).send("500 Internal Server Error");
  }
});

router.post(
  "/item",
  body("id").isInt({ min: 0 }),
  body("SKUId").isInt({ min: 0 }),
  body("supplierId").isInt({ min: 0 }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send("422 Unprocessable Entity");
    }
    if (Object.keys(req.body).length === 0) {
      return res.status(422).send("422 Unprocessable Entity");
    }
    const ApiInfo = req.body;
    if (
      ApiInfo === undefined ||
      ApiInfo.id === undefined ||
      ApiInfo.description === undefined ||
      ApiInfo.price === undefined ||
      ApiInfo.SKUId === undefined ||
      ApiInfo.supplierId === undefined ||
      Number(ApiInfo.price) <= 0
    ) {
      return res.status(422).send("422 Unprocessable Entity");
    }

    let ans = await uc.createItem(
      ApiInfo.id,
      ApiInfo.description,
      ApiInfo.price,
      ApiInfo.SKUId,
      ApiInfo.supplierId
    );
    if (ans == 201) {
      return res.status(201).send("201 Created");
    } else if (ans == 404) {
      return res.status(404).send("404 NOT FOUND");
    } else {
      return res.status(503).send("503 Service Unavailable");
    }
  }
);

router.put(
  "/item/:id/:supplierId",
  param("id").isInt({ min: 0 }).notEmpty().not().optional(),
  param("supplierId").isInt({ min: 0 }).notEmpty().not().optional(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send("422 Unprocessable Entity");
    }
    if (Object.keys(req.body).length === 0) {
      return res.status(422).send("422 Unprocessable Entity");
    }
    const ApiInfo = req.body;
    if (
      ApiInfo === undefined ||
      ApiInfo.newDescription === undefined ||
      ApiInfo.newPrice === undefined ||
      Number(ApiInfo.newPrice) <= 0
    ) {
      return res.status(422).send("422 Unprocessable Entity");
    }
    let ans = await uc.modifyItem(
      req.params.id,
      req.params.supplierId,
      ApiInfo.newPrice,
      ApiInfo.newDescription
    );
    if (ans == 404) {
      return res.status(404).send("404 NOT FOUND");
    } else if (ans == 200) {
      return res.send(200).send("200 OK");
    } else {
      return res.status(503).send("503 Service Unavailable");
    }
  }
);

router.delete(
  "/items/:id/:supplierId",
  param("id").isInt({ min: 0 }),
  param("supplierId").isInt({ min: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send("422 Unprocessable Entity");
    }
    let ans = await uc.deleteItem(req.params.id, req.params.supplierId);
    if (ans == 204) {
      return res.status(204).send("204 No Content");
    } else {
      return res.status(503).send("503 Service Unavailable");
    }
  }
);

router.delete("/deleteAllItems", async (req, res) => {
  let ans = await uc.deleteAll();
  if (ans) {
    return res.status(204).send("204 No Content");
  } else {
    return res.status(503).send("503 Service Unavailable");
  }
});

router.delete("/items", async (req, res) => {
  let ans = await uc.deleteAll();
  if (ans) {
    return res.status(204).send("204 No Content");
  } else {
    return res.status(503).send("503 Service Unavailable");
  }
});

module.exports = router;
