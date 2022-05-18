"use strict";
const express = require("express");
const router = express.Router();
const ItemController = require("../Controller/ItemController");
const DAO = require("../DB/ItemDao");
const dao = new DAO();
const uc = new ItemController(dao);
const { body, param, validationResult } = require('express-validator');


/* Manager  */
// router.get("/items", uc.getItems);
router.get("/items/:id",
param('id').isInt(),
uc.getItemByID);

/* supplier  */
router.get("/items", uc.getItems);

router.post("/item",
body('id').isInt(),body('SKUId').isInt(),body('supplierId').isInt(),
uc.createItem);

router.put("/item/:id",
param('id').isInt(),
 uc.modifyItem);

router.delete("/items/:id",
param('id').isInt(),
uc.deleteItem);


module.exports = router;