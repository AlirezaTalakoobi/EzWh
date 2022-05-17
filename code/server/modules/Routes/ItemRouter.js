"use strict";
const express = require("express");
const router = express.Router();
const ItemController = require("../Controller/ItemController");
const DAO = require("../DB/ItemDao");
const dao = new DAO();
const uc = new ItemController(dao);

/* Manager  */
// router.get("/items", uc.getItems);
router.get("/items/:id", uc.getItemByID);

/* supplier  */
router.get("/items", uc.getItems);
router.post("/item", uc.createItem);
router.put("/item/:id", uc.modifyItem);
router.delete("/items/:id", uc.deleteItem);


module.exports = router;