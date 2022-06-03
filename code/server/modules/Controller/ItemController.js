"use strict";
const { body, param, validationResult } = require("express-validator");

class ItemController {
  constructor(dao) {
    this.dao = dao;
  }

  getItems = async () => {
    try {
      const sql = "select * from ITEM";
      let result = await this.dao.all(sql, []);
      result = result.map((rows) => ({
        id: rows.ID,
        description: rows.description,
        price: rows.price,
        SKUId: rows.skuID,
        supplierId: rows.supplierID,
      }));
      let ret = {
        ans: 200,
        result: result,
      };
      return ret;
    } catch (err) {
      let ret = {
        ans: 500,
        result: {},
      };
      return ret;
    }
  };

  getItemByID = async (id) => {
    try {
      const sql = "select * from ITEM where ID=? ";
      const args = [id];
      let result = await this.dao.all(sql, args);
      if (result.length === 0) {
        let ret = {
          ans: 404,
          result: {},
        };
        return ret;
      }
      result = result.map((rows) => ({
        id: rows.ID,
        description: rows.description,
        price: rows.price,
        SKUId: rows.skuID,
        supplierId: rows.supplierID,
      }));
      let ret = {
        ans: 200,
        result: result[0],
      };
      return ret;
    } catch (err) {
      console.log(err);
      let ret = {
        ans: 500,
        result: {},
      };
      return ret;
    }
  };

  createItem = async (id, description, price, SKUId, supplierId) => {
    try {
      const sql_c_1 = "SELECT * FROM USER WHERE ID = ? ";
      const args_c_1 = [supplierId];
      let check1 = await this.dao.all(sql_c_1, args_c_1);
      if (check1.length === 0) {
        return 404;
      }
      const sql_c_2 = "SELECT * FROM SKU WHERE ID= ? ";
      const args_c_2 = [SKUId];
      let check2 = await this.dao.all(sql_c_2, args_c_2);
      if (check2.length === 0) {
        return 404;
      }

      const sql = `INSERT INTO ITEM (ID,description, price, skuId, supplierId) VALUES(?,?,?,?,?) `;
      const args = [id, description, price, SKUId, supplierId];
      let result = await this.dao.run(sql, args);
      return 201;
    } catch (err) {
      console.log(err);
      return 503;
    }
  };

  modifyItem = async (id, newPrice, newDescription) => {
    try {
      const sql_c_1 = "SELECT * FROM ITEM WHERE ID= ?";
      const args_c_1 = [id];
      let check1 = await this.dao.all(sql_c_1, args_c_1);
      if (check1.length === 0) {
        return 404;
      }

      const sql = "UPDATE ITEM SET description = ?, price = ? WHERE ID = ? ";
      const args = [newDescription, newPrice, id];
      let result = await this.dao.run(sql, args);
      return 200;
    } catch (err) {
      return 503;
    }
  };

  deleteItem = async (id) => {
    try {
      const sql = "DELETE FROM ITEM WHERE ID = ? ";
      const args = [id];
      let result = await this.dao.run(sql, args);
      return 204;
    } catch (err) {
      return 503;
    }
  };

  deleteAll = async () => {
    const sql = "DELETE FROM ITEM";
    try {
      let result = await this.dao.run(sql, []);
      return true;
    } catch (err) {
      return false;
    }
  };
}

module.exports = ItemController;
