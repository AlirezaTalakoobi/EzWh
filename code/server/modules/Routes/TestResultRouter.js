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
async (req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send("422 Unprocessable Entity(validation of rfid failed)")
    }
    const result = await uc.getTestResultsByRFID(req.params.rfid);
    if(result["ans"] == 200){
        return res.status(200).json(result["result"]);
    }
    else if(result["ans"] == 404){
      return res.status(404).send("404 NOT FOUND");
    }
    else{
        return res.status(500).send("500 Internal Server Error");
    }
});

router.get("/skuitems/:rfid/testResults/:id",
param('rfid').isString(),param('rfid').isLength({ min: 32 }),param('rfid').isLength({ max: 32 }),
async (req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send("422 Unprocessable Entity(validation of rfid failed)");
    }
    
    const result = await uc.getTestResultsForRFIDByID(req.params.rfid, req.params.id);
    if(result["ans"] == 200){
        return res.status(200).json(result["result"]);
    }
    else if(result["ans"] == 404){
      return res.status(404).send("404 NOT FOUND");
    }
    else{
        return res.status(500).send("500 Internal Server Error");
    }
});

router.post("/skuitems/testResult",
body('rfid').isString(),body('rfid').isLength({ min: 32 }),body('rfid').isLength({ max: 32 }),body('idTestDescriptor').isInt(),body('Result').isBoolean(),
async (req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("422 Unprocessable Entity(validation of rfid or id failed)")
    }
    if (Object.keys(req.body).length === 0) {
    return res.status(422).send("422 Unprocessable Entity(validation of request body or of rfid failed)");
    }
    const ApiInfo = req.body;
    if (
        ApiInfo === undefined ||
        ApiInfo.rfid === undefined ||
        ApiInfo.idTestDescriptor === undefined ||
        ApiInfo.Result === undefined
      ) {
        return res.status(422).send("422 Unprocessable Entity(validation of request body or of rfid failed)");
    }
    let ans = await uc.createTestResult(ApiInfo.rfid, ApiInfo.idTestDescriptor, ApiInfo.Date, (ApiInfo.Result === true) ? 1 : 0);
    if(ans == 201){
      return res.status(201).send("201 Created");
    }
    else if(ans == 404){
      return res.status(404).send("404 NOT FOUND");
    }
    else{
      return res.status(503).send("503 Service Unavailable")
  
    }
  }
);

router.put("/skuitems/:rfid/testResult/:id",
param('rfid').isString(), param('rfid').isLength({ min: 32 }), param('rfid').isLength({ max: 32 }), param('id').isInt(), body('newIdTestDescriptor').isInt(), body('newResult').isBoolean(),
async (req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send("422 Unprocessable Entity(validation of rfid or id failed)")
    }
    if (Object.keys(req.body).length === 0) {
      return res.status(422).send("422 Unprocessable Entity(validation of request body or of rfid failed)");
    }
    const ApiInfo = req.body;
    if (
        ApiInfo === undefined ||
        ApiInfo.newIdTestDescriptor === undefined ||
        ApiInfo.newDate === undefined ||
        ApiInfo.newResult === undefined
      ) {
        return res.status(422).send("422 Unprocessable Entity(validation of request body or of rfid failed)");
      }
      let ans = await uc.modifyTestResult(ApiInfo.newIdTestDescriptor, ApiInfo.newDate, (ApiInfo.newResult === true) ? 1 : 0, req.params.rfid, req.params.id)
    if(ans == 404){
      return res.status(404).send("404 NOT FOUND");
    }
    else if(ans == 200){
      return res.send(200).send("200 OK");
    }
    else{
      return res.status(503).send("503 Service Unavailable");
    }
});

router.delete("/skuitems/:rfid/testResult/:id",
param('rfid').isString(), param('rfid').isLength({ min: 32 }), param('rfid').isLength({ max: 32 }), param('id').isInt(),
async (req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send("422 Unprocessable Entity(validation of rfid or id failed)")
    }
    let ans = await uc.deleteTestResult(req.params.rfid,req.params.id);
  if(ans == 204){
    return res.status(204).send("204 No Content");
  }
  else{
      return res.status(503).send("503 Service Unavailable")
  }
});

router.delete("/deleteAllTests", async (req, res) => {
  const result = await uc.deleteAll();
  var httpStatusCode = 204;
  if (!result) {
    httpStatusCode = 500;
  }
  res.status(httpStatusCode).end();
});





/* QualityEmployee  */
// router.get("/skuitems/:rfid/testResults", uc.getTestResults);
// router.get("/skuitems/:rfid/testResults/:id", uc.getTestResultsID);
// router.post("/skuitems/testResult", uc.postTestResults);
// router.put("/skuitems/:rfid/testResult/:id", uc.putTestResultsID);
// router.delete("/skuitems/:rfid/testResult/:id", uc.deleteTestResultsID);





module.exports = router;