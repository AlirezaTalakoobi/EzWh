"use strict";
const sqlite = require("sqlite3");

class SKUItemDAO {
  static db;
  constructor() {
    this.db = new sqlite.Database("EZWH", (err) => {
      if (err) throw err;
    });

    this.newTableName();
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          console.log("Error running sql " + sql);
          console.log(err);
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          console.log("Error running sql: " + sql);
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.log("Error running sql: " + sql);
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  newTableName() {
    return new Promise((resolve, reject) => {
      const sql = //FOREIGN KEY REFERENCES SKU(SKUId)
        "CREATE TABLE IF NOT EXISTS SKUItems(rfid VARCHAR PRIMARY KEY,SKUId INTEGER , available INTEGER, dateofstock DATE)";
      this.db.run(sql, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  }
}

module.exports = SKUItemDAO;
