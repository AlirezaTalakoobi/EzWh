"use strict";
const { body, param, validationResult, check } = require("express-validator");
const { db } = require("../DB/DAO");

class PositionController {
  constructor(dao) {
    this.dao = dao;
    this.dao.run("Delete FROM sqlite_sequence");
  }

  getPosition = async () => {
    try {
      const sql = "SELECT * FROM POSITION";
      let result = await this.dao.all(sql, []);
      result = result.map((row) => ({
        positionID: row.ID,
        aisleID: row.aisleID,
        row: row.row,
        col: row.col,
        maxWeight: row.maxWeight,
        maxVolume: row.maxVolume,
        occupiedWeight: row.occupiedWeight,
        occupiedVolume: row.occupiedVolume,
      }));
      let ret = {
        ans: 200,
        result: result,
      };
      return ret;
    } catch (error) {
      let ret = {
        ans: 500,
        result: {},
      };
      return ret;
    }
  };

  createPosition = async (
    positionID,
    aisleID,
    row,
    col,
    maxWeight,
    maxVolume
  ) => {
    try {
      const sql = `INSERT INTO POSITION (ID,aisleID, ROW, COL, MAXWEIGHT,MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME) VALUES(?,?,?,?,?,?,?,?) `;
      const args = [positionID, aisleID, row, col, maxWeight, maxVolume, 0, 0];
      let result = await this.dao.run(sql, args);
      return 201;
    } catch (err) {
      return 503;
    }
  };

  modifyPosition = async (
    positionID,
    newAisleID,
    newRow,
    newCol,
    newMaxWeight,
    newMaxVolume,
    newOccupiedWeight,
    newOccupiedVolume
  ) => {
    try {
      const sql_c_1 = "SELECT ID FROM POSITION WHERE ID=? ";
      const args_c_1 = [positionID];
      let check1 = await this.dao.all(sql_c_1, args_c_1);
      if (check1.length === 0) {
        return 404;
      }

      const sql =
        "UPDATE POSITION SET aisleID = ?, row = ?, col = ?, maxWeight = ?, maxVolume = ?, occupiedWeight = ?, occupiedVolume = ?  WHERE ID = ? ";
      const args = [
        newAisleID,
        newRow,
        newCol,
        newMaxWeight,
        newMaxVolume,
        newOccupiedWeight,
        newOccupiedVolume,
        positionID,
      ];
      let result = await this.dao.run(sql, args);
      return 200;
    } catch (err) {
      return 500;
    }
  };

  changePositionID = async (positionID, newPositionID) => {
    try {
      const sql_c_1 = "SELECT * FROM POSITION WHERE ID=? ";
      const args_c_1 = [positionID];
      let check1 = await this.dao.all(sql_c_1, args_c_1);
      if (check1.length === 0) {
        return 404;
      }
      const check2 = await this.dao.get("SELECT * FROM POSITION WHERE ID=?", [
        newPositionID,
      ]);
      if (check2 !== undefined) {
        await this.dao.run("DELETE FROM POSITION WHERE ID=?", [positionID]);
        await this.dao.run(
          "UPDATE POSITION SET aisleID=?,row=?,col=?,maxWeight=maxWeight+?, maxVolume=maxVolume+?, occupiedWeight=occupiedWeight+?, occupiedVolume=occupiedVolume+? WHERE ID=?",
          [
            check2.aisleID,
            check2.row,
            check2.col,
            check2.maxWeight,
            check2.maxVolume,
            check2.occupiedWeight,
            check2.occupiedVolume,
            newPositionID,
          ]
        );
        return 200;
      } else {
        const sql = "UPDATE POSITION SET ID = ? WHERE ID = ? ";
        const args = [newPositionID, positionID];
        let result = await this.dao.run(sql, args);
        return 200;
      }
    } catch (err) {
      return 503;
    }
  };

  deletePosition = async (positionID) => {
    const sql = "DELETE FROM POSITION WHERE ID = ? ";
    const args = [positionID];
    try {
      let result = await this.dao.run(sql, args);
      return 204;
    } catch (err) {
      return 503;
    }
  };

  deleteAll = async () => {
    const sql = "DELETE FROM POSITION";
    try {
      let result = await this.dao.run(sql, []);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };
}

module.exports = PositionController;
