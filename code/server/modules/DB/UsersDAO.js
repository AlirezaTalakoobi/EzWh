"use strict";
const sqlite = require("sqlite3");

class DAO {
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
      const sql =
        "CREATE TABLE IF NOT EXISTS USERS(id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR UNIQUE, name VARCHAR, surname VARCHAR, password VARCHAR, type VARCHAR)";
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

module.exports = DAO;
