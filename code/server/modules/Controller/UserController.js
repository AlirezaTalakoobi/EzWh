"use strict";

class UserController {
  constructor(dao) {
    this.dao = dao;
  }

  newUser = (req, res) => {
    console.log(req);
    const sql =
      "INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)";
    //returns this.dao.run(sql)

    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({ error: "Empty Body request" });
    }
    let data = req.body;
    this.dao
      .run(sql, [
        data.username,
        data.name,
        data.surname,
        data.password,
        data.type,
      ])
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
      email: user.username,
      type: user.type,
    }));
    return res.status(200).json(result);
  };

  getUser = async (req, res) => {
    const sql =
      "SELECT id, username, name, surname FROM USERS WHERE username=? AND password=?";
    let data = req.body;
    let result = await this.dao.get(sql, [
      data.username,
      data.password,
      data.type,
    ]);
    return res.status(200).json(result);
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
      const sql = "SELECT id,name,surname,username FROM USERS WHERE type=?";
      let result = await this.dao.all(sql, ["supplier"]);
      return res
        .status(200)
        .json(
          result.map((user) => ({
            id: user.id,
            name: user.name,
            surname: user.name,
            email: user.username,
          }))
        );
    } catch {
      res.status(500).json("Internal Server Error");
    }
  };
  editUser = async (req, res) => {
    try {
      let data = req.body;
      console.log(req.params.username);
      const sql = "UPDATE USERS SET type=? where username=?";
      let result = await this.dao.run(sql, [data.newType, req.params.username]);
      return res.status(200).json(result);
    } catch {
      res.status(500).json("Internal Server Error");
    }
  };
  deleteUser = async (req, res) => {
    try {
      let data = req.body;
      const sql = "DELETE FROM USERS where username=? and type=?";
      let result = await this.dao.run(sql, [
        req.params.username,
        req.params.type,
      ]);
      return res.status(204).json("Successful");
    } catch {
      res.status(500).json("Internal Server Error");
    }
  };
  
}

module.exports = UserController;
