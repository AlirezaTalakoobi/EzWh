"use strict";
const { getRounds } = require("bcrypt");
const express = require("express");
const router = express.Router();
const UserController = require("../Controller/UserController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const uc = new UserController(dao);
const { check, oneOf, param, validationResult } = require("express-validator");

router.post(
  "/newUser",
  oneOf([
    [
      check("username").isEmail().not().isEmpty(),
      check("name").isString().not().isEmpty(),
      check("surname").isString(),
      check("password").isLength({ min: 8 }).isString().not().isEmpty(),
      check("type").isIn([
        "customer",
        "qualityEmployee",
        "clerk",
        "deliveryEmployee",
        "supplier",
        "manager",
      ]),
    ],
  ]),
  (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({ error: "Empty Body request" });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ error: "Validation Failed " + errors.array() });
    }
    next();
  },
  async (req, res) => {
    const user = await uc.newUser(
      req.body.name,
      req.body.surname,
      req.body.username,
      req.body.password,
      req.body.type
    );
    if (user === false) {
      return res.status(500).json({ message: "Internal Server Error" });
    } else if (user.message) {
      return res.status(409).json(user.message);
    } else {
      return res.status(201).json(user);
    }
  }
);
router.post("/login", async (req, res) => {
  logout = await uc.logout;
  if (log) {
    return res.status(200).json({ message: "Success" });
  } else {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/users", async (req, res) => {
  const users = await uc.getStoredUsers();
  if (users) {
    return res.status(200).json(users);
  } else {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/* MANAGER  */
router.get("/suppliers", async (req, res) => {
  const suppliers = await uc.getSuppliers();
  if (suppliers.error) {
    return res.status(404).json(suppliers.error);
  } else if (res === false) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
  return res.status(200).json(suppliers);
});
//router.get("/userinfo", uc.loggedin);
router.post(
  "/managerSessions",
  oneOf([
    [
      check("username").isEmail().not().isEmpty(),
      check("password").isLength({ min: 8 }).isString().not().isEmpty(),
      check("type").isIn(["manager"]),
    ],
  ]),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ error: "Validation problems " + errors.array() });
    }
    next();
  },
  async (req, res) => {
    const user = await uc.getUser(req.body.username, req.body.password);
    if (user === undefined) {
      return res.status(404).json({ message: "User not existing" });
    } else if (user.message) {
      return res.status(401).json(user.message);
    } else {
      return res.status(200).json(user);
    }
  }
);

/* CUSTOMER */
router.post(
  "/customerSessions",
  oneOf([
    [
      check("username").isEmail().not().isEmpty(),
      check("password").isLength({ min: 8 }).isString().not().isEmpty(),
      check("type").isIn(["customer"]),
    ],
  ]),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ error: "Validation problems " + errors.array() });
    }
    next();
  },
  async (req, res) => {
    const user = await uc.getUser(req.body.username, req.body.password);
    if (user === undefined) {
      return res.status(404).json({ message: "User not existing" });
    } else if (user.message) {
      return res.status(401).json(user.message);
    } else {
      return res.status(200).json(user);
    }
  }
);

/* SUPPLIER */
router.post(
  "/supplierSessions",
  oneOf([
    [
      check("username").isEmail().not().isEmpty(),
      check("password").isLength({ min: 8 }).isString().not().isEmpty(),
      check("type").isIn(["supplier"]),
    ],
  ]),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ error: "Validation problems " + errors.array() });
    }
    next();
  },
  async (req, res) => {
    const user = await uc.getUser(req.body.username, req.body.password);
    if (user === undefined) {
      return res.status(404).json({ message: "User not existing" });
    } else if (user.message) {
      return res.status(401).json(user.message);
    } else {
      return res.status(200).json(user);
    }
  }
);

/* CLERK */
router.post(
  "/clerkSessions",
  oneOf([
    [
      check("username").isEmail().not().isEmpty(),
      check("password").isLength({ min: 8 }).isString().not().isEmpty(),
      check("type").isIn(["clerk"]),
    ],
  ]),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ error: "Validation problems " + errors.array() });
    }
    next();
  },
  async (req, res) => {
    const user = await uc.getUser(req.body.username, req.body.password);

    if (user === undefined) {
      return res.status(404).json({ message: "User not existing" });
    } else if (user.message) {
      return res.status(401).json(user.message);
    } else {
      return res.status(200).json(user);
    }
  }
);

/* QUALITY EMPLOYEE */
router.post(
  "/qualityEmployeeSessions",
  oneOf([
    [
      check("username").isEmail().not().isEmpty(),
      check("password").isLength({ min: 8 }).isString().not().isEmpty(),
      check("type").isIn(["qualityEmployee"]),
    ],
  ]),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ error: "Validation problems " + errors.array() });
    }
    next();
  },
  async (req, res) => {
    const user = await uc.getUser(req.body.username, req.body.password);

    if (user === undefined) {
      return res.status(404).json({ message: "User not existing" });
    } else if (user.message) {
      return res.status(401).json(user.message);
    } else {
      return res.status(200).json(user);
    }
  }
);

/* DELIVERY EMPLOYEE */
router.post(
  "/deliveryEmployeeSessions",
  oneOf([
    [
      check("username").isEmail().not().isEmpty(),
      check("password").isLength({ min: 8 }).isString().not().isEmpty(),
      check("type").isIn(["deliveryEmployee"]),
    ],
  ]),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ error: "Validation problems " + errors.array() });
    }
    next();
  },
  async (req, res) => {
    const user = await uc.getUser(req.body.username, req.body.password);

    // if (user === undefined) {
    //   return res.status(404).json({ message: "User not existing" });
    // } else
    if (user.message) {
      return res.status(401).json(user.message);
    } else {
      return res.status(200).json(user);
    }
  }
);

router.put(
  "/users/:username",
  oneOf([
    [
      param("username").isEmail().not().isEmpty(),
      check("oldType").not().isIn(["manager"]),
      check("newType").isIn([
        "customer",
        "qualityEmployee",
        "clerk",
        "deliveryEmployee",
        "supplier",
      ]),
    ],
  ]),
  (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({ error: "Empty Body request" });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: "Validation of body or username failed" + errors.array(),
      });
    }
    next();
  },
  async (req, res) => {
    const user = await uc.editUser(
      req.params.username,
      req.body.oldType,
      req.body.newType
    );

    if (user === false) {
      return res.status(500).json({ message: "generic error" });
    } else if (user.message) {
      return res.status(404).json(user.message);
    } else {
      return res.status(200).end();
    }
  }
);
router.delete(
  "/users/:username/:type",
  oneOf([
    [
      param("username").isEmail(),
      param("type").not().isIn(["manager"]),
      param("type").isIn([
        "customer",
        "qualityEmployee",
        "clerk",
        "deliveryEmployee",
        "supplier",
      ]),
    ],
  ]),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ error: "Validation problems " + errors.array() });
    }
    next();
  },
  async (req, res) => {
    const result = await uc.deleteUser(req.params.username, req.params.type);
    if (result === false) {
      return res.status(500).json({ message: "generic error" });
    } else if (result.message) {
      return res.status(404).json(result.message);
    } else {
      return res.status(204).end();
    }
  }
);
router.delete("/deleteAllUsers", async (req, res) => {
  const result = await uc.deleteAll();
  var httpStatusCode = 204;
  if (!result) {
    httpStatusCode = 500;
  }
  res.status(httpStatusCode).end();
});

module.exports = router;
