"use strict";
const bcrypt = require("bcrypt");
const saltRounds = 10;

class UserController {
  constructor(dao) {
    this.dao = dao;
  }

  loggedin = (req, res) => {};
  newUser = async (req, res) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const sql =
      "INSERT INTO USER(name, surname,email, type, password) VALUES (?,?,?,?,?)";
    //returns this.dao.run(sql)
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({ error: "Empty Body request" });
    }
    let data = req.body;
    try {
      let check = await this.dao.get("select * from USER where email=?", [
        data.username,
      ]);
      if (check === undefined) {
        await this.dao.run(sql, [
          data.name,
          data.surname,
          data.username,
          data.type,
          hash,
        ]);
        return res.status(201).end();
      } else {
        return res.status(409).json({ message: "Conflict" });
      }
    } catch {
      return res.status(503).json({ message: "Service Unavailable" });
    }
  };

  getStoredUsers = async (req, res) => {
    if (Object.keys(req.body)) {
    }
    const sql = "SELECT * FROM USER WHERE TYPE <>?";
    let result = await this.dao.all(sql, ["manager"]);
    console.log(result);
    result = result.map((user) => ({
      id: user.ID,
      name: user.name,
      surname: user.surname,
      email: user.email.replace("@ezwh", `@${user.type}`),
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
      "SELECT id, name, surname,email, password FROM USER WHERE email=?";
    let data = req.body;
    let result = await this.dao.get(sql, [data.username]);
    if (result === undefined) {
      return res.status(404).json("User not found");
    }
    const check = await bcrypt.compare(req.body.password, result.password);
    if (check === true) {
      return res.status(200).json({
        id: result.id,
        username: result.email,
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
      const sql = "SELECT ID,name,surname,email,type FROM USER WHERE type=?";
      let result = await this.dao.all(sql, ["supplier"]);
      if (result.length !== 0) {
        return res.status(200).json(
          result.map((user) => ({
            id: user.ID,
            name: user.name,
            surname: user.name,
            email: user.email.replace("ezwh", `${user.type}.ezwh`),
          }))
        );
      } else {
        return res.status(404).json({ error: "Users Not found" });
      }
    } catch {
      return res.status(500).json(error);
    }
  };
  editUser = async (req, res) => {
    try {
      let data = req.body;
      if (
        (await this.dao.get("Select * from USER where email=?", [
          req.params.username,
        ])) === undefined
      ) {
        return res.status(404).json("Not found, wrong fields");
      }
      const sql = "UPDATE USER SET type=? where email=?";
      let result = await this.dao.run(sql, [data.newType, req.params.username]);
      return res.status(200).json(result);
    } catch {
      res.status(503).json("Service Unavailable");
    }
  };
  deleteUser = async (req, res) => {
    try {
      if (
        (await this.dao.get("Select * from USER where email=? and type=?", [
          req.params.username,
          req.params.type,
        ])) === undefined
      ) {
        return res.status(404).json("Not found, wrong fields");
      }
      const sql = "DELETE FROM USER where email=? and type=?";
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
