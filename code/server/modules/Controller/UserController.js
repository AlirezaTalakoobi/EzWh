"use strict";
const bcrypt = require("bcrypt");
const saltRounds = 10;

class UserController {
  constructor(dao) {
    this.dao = dao;
  }

  loggedin = (req, res) => {};
  newUser = (req, res) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const sql =
      "INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)";
    //returns this.dao.run(sql)
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({ error: "Empty Body request" });
    }
    let data = req.body;
    this.dao
      .run(sql, [data.username, data.name, data.surname, hash, data.type])
      .then(res.status(201).json("Successful"))
      .catch(console.log(res));
  };

  getStoredUsers = async (req, res) => {
    if (Object.keys(req.body)) {
    }
    const sql = "SELECT * FROM USERS WHERE TYPE <>?";
    let result = await this.dao.all(sql, ["manager"]);
    result = result.map((user) => ({
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.username.replace("@ezwh", `@${user.type}`),
      type: user.type,
    }));
    if (result != undefined) {
      return res.status(200).json(result);
    }
    return res.status(500).end();
  };

  getUser = async (req, res) => {
    console.log(req.body);
    const sql =
      "SELECT id, username, name, surname ,password FROM USERS WHERE username=?";
    let data = req.body;
    let result = await this.dao.get(sql, [data.username]);
    if (result === undefined) {
      return res.status(404).json("User not found");
    }
    const check = await bcrypt.compare(req.body.password, result.password);
    console.log(check);
    if (check === true) {
      return res.status(200).json({
        id: result.id,
        username: result.username,
        name: result.name,
        surname: result.surname,
      });
    }
    return res.status(401).json("Wrong Password");
  };

  logout = (req, res) => {
    try {
      return res.status(200);
    } catch {
      res.status(500).json("Internal Server Error");
    }
  };

  getSuppliers = async (req, res) => {
    try {
      const sql =
        "SELECT id,name,surname,username,type FROM USERS WHERE type=?";
      let result = await this.dao.all(sql, ["supplier"]);
      return res.status(200).json(
        result.map((user) => ({
          id: user.id,
          name: user.name,
          surname: user.name,
          email: user.username.replace("ezwh", `${user.type}.ezwh`),
        }))
      );
    } catch {
      res.status(500).json("Internal Server Error");
    }
  };
  editUser = async (req, res) => {
    try {
      let data = req.body;
      if (
        (await this.dao.get("Select * from USERS where username=?", [
          req.params.username,
        ])) === undefined
      ) {
        return res.status(404).json("Not found, wrong fields");
      }
      const sql = "UPDATE USERS SET type=? where username=?";
      let result = await this.dao.run(sql, [data.newType, req.params.username]);
      return res.status(200).json(result);
    } catch {
      res.status(503).json("Service Unavailable");
    }
  };
  deleteUser = async (req, res) => {
    try {
      let data = req.body;
      if (
        (await this.dao.get("Select * from USERS where username=? and type=?", [
          req.params.username,
          req.params.type,
        ])) === undefined
      ) {
        return res.status(404).json("Not found, wrong fields");
      }
      const sql = "DELETE FROM USERS where username=? and type=?";
      let result = await this.dao.run(sql, [
        req.params.username,
        req.params.type,
      ]);
      if (result === undefined) {
        return res.status(404).json("User not found");
      }
      return res.status(204).json("Successful");
    } catch {
      res.status(503).json("Service Unavailable");
    }
  };
}

module.exports = UserController;
