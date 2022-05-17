"use strict";

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
      res.status(500).json("Internal Server Error");
     }
    }
  

  createPosition = async (req, res) => {

    const ApiInfo = req.body;
    const sql = `INSERT INTO POSITION (ID,aisleID, ROW, COL, MAXWEIGHT,MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME) VALUES(?,?,?,?,?,?,?,?) `;
    const args = [ApiInfo.positionID, ApiInfo.aisleID, ApiInfo.row, ApiInfo.col, ApiInfo.maxWeight, ApiInfo.maxVolume, 0, 0];
    let result = await this.dao.run(sql, args);
    res.status(201);

  };
  modifyPosition =async (req, res) => {
    const ApiInfo = req.body;
    const sql = "UPDATE POSITION SET aisleID = ?, ROW = ?, COL = ?, MAXWEIGHT = ?, MAXVOLUME = ?, OCCUPIEDWEIGHT = ?, OCCUPIEDVOLUME = ?  WHERE ID = ? ";
    const args = [ApiInfo.newAisleID, ApiInfo.newRow, ApiInfo.newCol,ApiInfo.newMaxWeight, ApiInfo.newMaxVolume, ApiInfo.newOccupiedWeight, ApiInfo.newOccupiedVolume, req.params.positionID];
    try{
        let result = await this.dao.run(sql, args);
        res.sendStatus(200);

    }
    catch(err){
        res.status(500).json(err)
    }
  };

  changePositionID = async (req, res) => {
    const ApiInfo = req.body;
    const sql = "UPDATE POSITION SET ID = ? WHERE ID = ? ";
    const args = [ApiInfo.newPositionID, req.params.positionID];
    try{
        let result = await this.dao.run(sql, args);
        res.sendStatus(200);

    }
    catch(err){
        res.status(500).json(err)
    }
  };


  deletePosition = async (req, res) => {
    const sql = "DELETE FROM POSITION WHERE ID = ? ";
    const args = [req.params.positionID];
    try{
        let result = await this.dao.run(sql, args);
        res.sendStatus(204);

    }
    catch(err){
        res.status(500).json(err)
    }
};
  
  
}

module.exports = PositionController;
