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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  uc.newUser
);
router.get("/users", uc.getStoredUsers);

/* MANAGER  */
router.get("/managerSessions", uc.getStoredUsers);
router.get("/suppliers", uc.getSuppliers);
router.get("/userinfo", uc.loggedin);
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
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  uc.getUser
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
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  uc.getUser
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
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  uc.getUser
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
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  uc.getUser
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
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  uc.getUser
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
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  uc.getUser
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  uc.editUser
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
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  uc.deleteUser
);
module.exports = router;
