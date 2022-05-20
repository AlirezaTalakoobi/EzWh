"use strict";
const { body, param, validationResult } = require('express-validator');


class PositionController {
  constructor(dao) {
    this.dao = dao;
  }

  getPosition = async (req, res) => {
    const sql =
      "SELECT * FROM POSITION";
    let result = await this.dao.all(sql, []);
     try{
      res.status(200).json(
        result.map((row) => ({
        
          positionID: row.ID,
          aislelID : row.aislelID,
          row: row.ROW,
          col: row.COL,
          maxWeight: row.MAXWEIGHT,
          maxVolume: row.MAXVOLUME,
          occupiedWeight: row.OCCUPIEDWEIGHT,
          occipiedVolume: row.OCCUPIEDWEIGHT
      }))
      );
     }
     catch{
      res.status(500).send("500 Internal Server Error");
     }
    }
  

  createPosition = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("422 Unprocessable Entity (validation of request body or of positionID failed)")
    }
    if (Object.keys(req.body).length === 0) {
    return res.status(422).send("422 Unprocessable Entity (validation of request body or of positionID failed)");
    }
    const ApiInfo = req.body;
    if (
      ApiInfo === undefined ||
      ApiInfo.positionID === undefined ||
      ApiInfo.aisleID === undefined ||
      ApiInfo.row === undefined ||
      ApiInfo.col === undefined ||
      ApiInfo.maxWeight === undefined ||
      ApiInfo.maxVolume === undefined
    ) {
      return res.status(422).send("422 Unprocessable Entity (validation of request body or of positionID failed)");
  }
  try{  
    const sql = `INSERT INTO POSITION (ID,aisleID, ROW, COL, MAXWEIGHT,MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME) VALUES(?,?,?,?,?,?,?,?) `;
    const args = [ApiInfo.positionID, ApiInfo.aisleID, ApiInfo.row, ApiInfo.col, ApiInfo.maxWeight, ApiInfo.maxVolume, 0, 0];
    let result = await this.dao.run(sql, args);
    res.status(201).send("201 Created");
  }
  catch(err){
    res.status(503).send("503 Service Unavailable")
  }

  };

  modifyPosition =async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("422 Unprocessable Entity (validation of request body or of positionID failed)")
    }
    if (Object.keys(req.body).length === 0) {
    return res.status(422).send("422 Unprocessable Entity (validation of request body or of positionID failed)");
    }
    const ApiInfo = req.body;
    if (
      ApiInfo === undefined ||
      ApiInfo.newAisleID === undefined ||
      ApiInfo.newRow === undefined ||
      ApiInfo.newCol === undefined ||
      ApiInfo.newMaxWeight === undefined ||
      ApiInfo.newMaxVolume === undefined ||
      ApiInfo.newOccupiedWeight === undefined ||
      ApiInfo.newOccupiedVolume === undefined
    ) {
      return res.status(422).send("422 Unprocessable Entity (validation of request body or of positionID failed)");
  }
    
    try{
        const sql_c_1 = 'SELECT ID FROM POSITION WHERE ID=? ';
        const args_c_1 = [req.params.positionID];
        let check1 = await this.dao.all(sql_c_1,args_c_1);
        if (check1.length === 0) {
            return res.status(404).send("404 NOT FOUND");
        }

        const sql = "UPDATE POSITION SET aisleID = ?, ROW = ?, COL = ?, MAXWEIGHT = ?, MAXVOLUME = ?, OCCUPIEDWEIGHT = ?, OCCUPIEDVOLUME = ?  WHERE ID = ? ";
        const args = [ApiInfo.newAisleID, ApiInfo.newRow, ApiInfo.newCol,ApiInfo.newMaxWeight, ApiInfo.newMaxVolume, ApiInfo.newOccupiedWeight, ApiInfo.newOccupiedVolume, req.params.positionID];
        let result = await this.dao.run(sql, args);
        res.send(200).send("200 OK");

    }
    catch(err){
        res.status(503).send("503 Service Unavailable")
    }
  };

  changePositionID = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("422 Unprocessable Entity (validation of request body or of positionID failed)")
    }
    if (Object.keys(req.body).length === 0) {
    return res.status(422).send("422 Unprocessable Entity (validation of request body or of positionID failed)");
    }
    const ApiInfo = req.body;
    if (
      ApiInfo === undefined ||
      ApiInfo.newPositionID === undefined
    ) {
      return res.status(422).send("422 Unprocessable Entity (validation of request body or of positionID failed)");
  }
    try{
        const sql_c_1 = 'SELECT * FROM POSITION WHERE ID=? ';
        const args_c_1 = [req.params.positionID];
        let check1 = await this.dao.all(sql_c_1,args_c_1);
        if (check1.length === 0) {
            return res.status(404).send("404 NOT FOUND");
        }
        const sql = "UPDATE POSITION SET ID = ? WHERE ID = ? ";
        const args = [ApiInfo.newPositionID, req.params.positionID];
        let result = await this.dao.run(sql, args);
        res.send(200).send("200 OK");

    }
    catch(err){
        res.status(503).send("503 Service Unavailable")
    }
  };


  deletePosition = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("422 Unprocessable Entity(validation of positionID failed)")
    }
    const sql = "DELETE FROM POSITION WHERE ID = ? ";
    const args = [req.params.positionID];
    try{
        let result = await this.dao.run(sql, args);
        res.status(204).send("204 No Content");

    }
    catch(err){
        res.status(503).send("503 Service Unavailable")
    }
};
  
  
}

module.exports = PositionController;
