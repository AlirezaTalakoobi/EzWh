"use strict";
const { body, param, validationResult } = require('express-validator');


class TestResultController {
  constructor(dao) {
    this.dao = dao;
  }

  getTestResultsByRFID = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send("422 Unprocessable Entity(validation of rfid failed)")
    }
    const sql = 'select * from TEST_RESULT where RFID=?';
    
    const args = [req.params.rfid];
    try{
        const result = await this.dao.all(sql, args);
        if (result.length === 0) {
            return res.status(404).send("404 NOT FOUND");
        }
        return res.status(200).json(
            result.map((rows)=>({
                id:rows.ID,
                idTestDescriptor:rows.idTestDescriptor,
                Date:rows.Date,
                Result:rows.result
            }))
        )
    }
    catch(err){
        res.status(500).send("500 INTERNAL SERVER ERROR");
    }
  
   

};

getTestResultsForRFIDByID = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send("422 Unprocessable Entity(validation of rfid failed)")
    }
    const sql = 'select * from TEST_RESULT where RFID=? and idTestDescriptor=?';
    
    const args = [req.params.rfid, req.params.id];
    try{
        const result = await this.dao.all(sql, args) ;
        if (result.length === 0) {
            return res.status(404).send("404 NOT FOUND");
        }
        return res.status(200).json(
            result.map((rows)=>({
                id:rows.ID,
                idTestDescriptor:rows.idTestDescriptor,
                Date:rows.Date,
                Result:rows.result
            }))
        )
    }
    catch(err){
        res.status(500).send("500 INTERNAL SERVER ERROR");
    }
};

createTestResult = async (req, res) => {
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
        ApiInfo.Date === undefined ||
        ApiInfo.Result === undefined
      ) {
        return res.status(422).send("422 Unprocessable Entity(validation of request body or of rfid failed)");
    }
    try{
        const sql_c_1 = 'SELECT ID FROM TEST_DESCRIPTOR WHERE ID=? ';
        const args_c_1 = [req.body.idTestDescriptor];
        let check1 = await this.dao.all(sql_c_1,args_c_1);
        if (check1.length === 0) {
            return res.status(404).send("404 NOT FOUND");
        }
        const sql_c_2 = 'SELECT RFID FROM SKU_ITEM WHERE RFID=? ';
        const args_c_2 = [req.body.rfid];
        let check2 = await this.dao.all(sql_c_2,args_c_2);
        if (check2.length === 0) {
            return res.status(404).send("404 NOT FOUND");
        }
        const sql = `INSERT INTO TEST_RESULT (RFID,idTestDescriptor, date, result) VALUES(?,?,?,?) `;
        const args = [ApiInfo.rfid, ApiInfo.idTestDescriptor, ApiInfo.Date, (ApiInfo.Result === true) ? 1 : 0];
        let result = await this.dao.run(sql, args);
        if (result.length === 0) {
            return res.status(404).send("404 NOT FOUND");
          }
        return res.status(201).send("201 CREATED");

    }
    catch(err){
        console.log(err);
        return res.status(503).send("503 SERVICE UNAVAILABLE");
    }
};

modifyTestResult = async (req, res) => {
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

    try{
        const sql_c_1 = 'SELECT ID FROM TEST_DESCRIPTOR WHERE ID=? ';
        const args_c_1 = [req.body.idTestDescriptor];
        let check1 = await this.dao.all(sql_c_1,args_c_1);
        if (check1.length === 0) {
            return res.status(404).send("404 NOT FOUND");
        }
        const sql_c_2 = 'SELECT RFID FROM SKU_ITEM WHERE RFID=? ';
        const args_c_2 = [req.body.rfid];
        let check2 = await this.dao.all(sql_c_2,args_c_2);
        if (check2.length === 0) {
            return res.status(404).send("404 NOT FOUND");
        }
        const sql_c_3 = 'SELECT ID FROM TEST_RESULT WHERE ID=? ';
        const args_c_3 = [req.param.id];
        let check3 = await this.dao.all(sql_c_3,args_c_3);
        if (check3.length === 0) {
            return res.status(404).send("404 NOT FOUND");
        }
        const sql = "UPDATE TEST_RESULT SET idTestDescriptor = ?, date = ?, result = ?  WHERE RFID = ? and idTestDescriptor = ?";
        const args = [ApiInfo.newIdTestDescriptor, ApiInfo.newDate, (ApiInfo.newResult === true) ? 1 : 0, req.params.rfid, req.params.id];
        let result = await this.dao.run(sql, args);
        return res.status(201).send("200 OK");

    }
    catch(err){
        return res.status(503).send("503 SERVICE UNAVAILABLE");
    }

};

deleteTestResult = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send("422 Unprocessable Entity(validation of rfid or id failed)")
    }
    const sql = "DELETE FROM TEST_RESULT WHERE RFID = ? and idTestDescriptor = ?";
    const args = [req.params.rfid, req.params.id];
    try{
        let result = await this.dao.run(sql, args);
        return res.status(204).send("204 No Content");
    }
    catch(err){
        return res.status(503).send("Service Unavailable");
    }
};


}

module.exports = TestResultController;