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
    const sql = `INSERT INTO POSITION (ID,aislelID, ROW, COL, MAXWEIGHT,MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDWEIGHT) VALUES(?,?,?,?,?,?,?,?) `;
    const args = [ApiInfo.positionID, ApiInfo.aisleID, ApiInfo.row, ApiInfo.col, ApiInfo.maxWeight, ApiInfo.maxVolume, 0, 0];
    let result = await this.dao.run(sql, args);
    res.status(201);

  };
  modifyPosition =async (req, res) => {

  };

  changePositionID = async (req, res) => {

  };


  deletePosition = async (req, res) => {

  };
  
  
}

module.exports = PositionController;
