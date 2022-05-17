"use strict";
const express = require("express");
const router = express.Router();
const PositionController = require("../Controller/PositionController");
const DAO = require("../DB/PositionDAO");
const dao =new  DAO();
const uc = new PositionController(dao);

/* MANAGER  */
router.get("/position", uc.getPosition);
router.post("/position", uc.createPosition);
router.put("/position/:positionID", uc.modifyPosition);
router.put("/position/:positionID/changeID", uc.changePositionID);
router.delete("/position/:positionID", uc.deletePosition);

/* Clerk  */
// router.get("/position", uc.getPosition);
// router.put("/position/:positionID/changeID", uc.changePositionID);



module.exports = router;
