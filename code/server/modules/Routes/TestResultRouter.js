"use strict";
const express = require("express");
const router = express.Router();
const TestResultController = require("../Controller/TestResultController");
const DAO = require("../DB/TestResultDAO");
const dao = new DAO();
const uc = new TestResultController(dao);

/* MANAGER  */
router.get("/skuitems/:rfid/testResults", uc.getTestResultsByRFID);
router.get("/skuitems/:rfid/testResults/:id", uc.getTestResultsForRFIDByID);
router.post("/skuitems/testResult", uc.createTestResult);
router.put("/skuitems/:rfid/testResult/:id", uc.modifyTestResult);
router.delete("/skuitems/:rfid/testResult/:id", uc.deleteTestResult);





/* QualityEmployee  */
// router.get("/skuitems/:rfid/testResults", uc.getTestResults);
// router.get("/skuitems/:rfid/testResults/:id", uc.getTestResultsID);
// router.post("/skuitems/testResult", uc.postTestResults);
// router.put("/skuitems/:rfid/testResult/:id", uc.putTestResultsID);
// router.delete("/skuitems/:rfid/testResult/:id", uc.deleteTestResultsID);





module.exports = router;