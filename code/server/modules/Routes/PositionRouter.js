"use strict";
const express = require("express");
const router = express.Router();
const PositionController = require("../Controller/PositionController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const uc = new PositionController(dao);
const { body, param, validationResult } = require('express-validator');


/* MANAGER  */
router.get("/positions", uc.getPosition);
router.post("/position",
body('positionID').isString(),body('positionID').isLength({ min: 12 }),body('positionID').isLength({ max: 12 }),
body('aisleID').isString(),body('aisleID').isLength({ min: 4 }),body('aisleID').isLength({ max: 4 }),
body('row').isString(),body('row').isLength({ min: 4 }),body('row').isLength({ max: 4 }),
body('col').isString(),body('col').isLength({ min: 4 }),body('col').isLength({ max: 4 }),
body('maxWeight').isInt(),body('maxVolume').isInt(),
uc.createPosition);

router.put("/position/:positionID", 
param('positionID').isString(),param('positionID').isLength({ min: 12 }),param('positionID').isLength({ max: 12 }),
body('newAisleID').isString(),body('newAisleID').isLength({ min: 4 }),body('newAisleID').isLength({ max: 4 }),
body('newRow').isString(),body('newRow').isLength({ min: 4 }),body('newRow').isLength({ max: 4 }),
body('newCol').isString(),body('newCol').isLength({ min: 4 }),body('newCol').isLength({ max: 4 }),
body('newMaxWeight').isInt(),body('newMaxVolume').isInt(),body('newOccupiedWeight').isInt(),body('newOccupiedVolume').isInt(),
uc.modifyPosition);

router.put("/position/:positionID/changeID",
param('positionID').isString(),param('positionID').isLength({ min: 12 }),param('positionID').isLength({ max: 12 }),
body('newPositionID').isString(),body('newPositionID').isLength({ min: 12 }),body('newPositionID').isLength({ max: 12 }),
uc.changePositionID);

router.delete("/position/:positionID",
param('positionID').isString(),param('positionID').isLength({ min: 12 }),param('positionID').isLength({ max: 12 }),
 uc.deletePosition);

/* Clerk  */
// router.get("/position", uc.getPosition);
// router.put("/position/:positionID/changeID", uc.changePositionID);



module.exports = router;
