"use strict";
const express = require("express");
const router = express.Router();
const TestResultController = require("../Controller/TestResultController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const uc = new TestResultController(dao);
// const param = require('express-validator');
const { body, param, validationResult } = require('express-validator');




/* MANAGER  */
router.get("/skuitems/:rfid/testResults",
param('rfid').isString(),param('rfid').isLength({ min: 32 }),param('rfid').isLength({ max: 32 }),
 uc.getTestResultsByRFID);

router.get("/skuitems/:rfid/testResults/:id",
param('rfid').isString(),param('rfid').isLength({ min: 32 }),param('rfid').isLength({ max: 32 }),
uc.getTestResultsForRFIDByID);

router.post("/skuitems/testResult",
body('rfid').isString(),body('rfid').isLength({ min: 32 }),body('rfid').isLength({ max: 32 }),body('idTestDescriptor').isInt(),body('Result').isBoolean(),
uc.createTestResult);

router.put("/skuitems/:rfid/testResult/:id",
param('rfid').isString(), param('rfid').isLength({ min: 32 }), param('rfid').isLength({ max: 32 }), param('id').isInt(), body('newIdTestDescriptor').isInt(), body('newResult').isBoolean(),
uc.modifyTestResult);

router.delete("/skuitems/:rfid/testResult/:id",
param('rfid').isString(), param('rfid').isLength({ min: 32 }), param('rfid').isLength({ max: 32 }), param('id').isInt(),
uc.deleteTestResult);





/* QualityEmployee  */
// router.get("/skuitems/:rfid/testResults", uc.getTestResults);
// router.get("/skuitems/:rfid/testResults/:id", uc.getTestResultsID);
// router.post("/skuitems/testResult", uc.postTestResults);
// router.put("/skuitems/:rfid/testResult/:id", uc.putTestResultsID);
// router.delete("/skuitems/:rfid/testResult/:id", uc.deleteTestResultsID);





module.exports = router;