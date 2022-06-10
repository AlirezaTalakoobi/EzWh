"use strict";
const bcrypt = require("bcrypt");
const saltRounds = 10;

class UserController {
  constructor(dao) {
    this.dao = dao;
  }

  newUser = async (name, surname, username, password, type) => {
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hash = await bcrypt.hashSync(password, salt);
    const sql =
      "INSERT INTO USER(name, surname,email, type, password) VALUES (?,?,?,?,?)";
    try {
      let check = await this.dao.get("select * from USER where email=?", [
        username,
      ]);
      if (check === undefined) {
        const result = await this.dao.run(sql, [
          name,
          surname,
          username,
          type,
          hash,
        ]);
        return result;
      } else {
        return { message: "Conflict" };
      }
    } catch {
      return false;
    }
  };

  getStoredUsers = async () => {
    const sql = "SELECT * FROM USER WHERE TYPE <>?";
    let result = await this.dao.all(sql, ["manager"]);
    result = result.map((user) => ({
      id: user.ID,
      name: user.name,
      surname: user.surname,
      email: user.email.replace("ezwh", `${user.type}.ezwh`),
      type: user.type,
    }));
    if (result != undefined) {
      return result;
    }
    return false;
  };

  getUser = async (username, password) => {
    const sql =
      "SELECT id, name, surname,email, password, type FROM USER WHERE email=?";
    let result = await this.dao.get(sql, [username]);
    if (result != undefined) {
      const check = await bcrypt.compare(password, result.password);
      console.log(check);
      if (check === true) {
        return {
          id: result.ID,
          username: result.email,
          name: result.name,
          surname: result.surname,
          type: result.type,
        };
      } else if (!check) {
        return { message: "Wrong Username/Password" };
      }
    }
    return result;
  };

  getSuppliers = async () => {
    try {
      const sql = "SELECT ID,name,surname,email,type FROM USER WHERE type=?";
      let result = await this.dao.all(sql, ["supplier"]);
      if (result.length !== 0) {
        return result.map((user) => ({
          id: user.ID,
          name: user.name,
          surname: user.name,
          email: user.email.replace("ezwh", `${user.type}.ezwh`),
        }));
      } else {
        return { error: "Users Not found" };
      }
    } catch {
      return false;
    }
  };
  editUser = async (username, oldType, newType) => {
    try {
      if (
        (await this.dao.get("Select * from USER where email=? and type=?", [
          username,
          oldType,
        ])) === undefined
      ) {
        return {
          message: "wrong username or oldType fields or user doesn't exists",
        };
      } else {
        const sql = "UPDATE USER SET type=? where email=? and type=?";
        let result = await this.dao.run(sql, [newType, username, oldType]);
        return result;
      }
    } catch {
      return false;
    }
  };
  deleteUser = async (username, type) => {
    try {
      // if (
      //   (await this.dao.get("Select * from USER where email=? and type=?", [
      //     username,
      //     type,
      //   ])) === undefined
      // ) {
      //   return {
      //     message: "wrong username or oldType fields or user doesn't exists",
      //   };
      // }
      const sql = "DELETE FROM USER where email=? and type=?";
      const sql2 = "UPDATE SQLITE_SEQUENCE SET seq = ? WHERE name = ?";
      let result = await this.dao.run(sql, [
        username.replace(`${type}.ezwh`, "ezwh"),
        type,
      ]);
      await this.dao.run(sql2, [0, "USER"]);
      return result;
    } catch {
      return false;
    }
  };
  deleteAll = async () => {
    try {
      const res = await this.dao.run("Delete from USER", []);

      if (res) {
        return true;
      }
    } catch {
      return -1;
    }
  };
}

module.exports = UserController;
