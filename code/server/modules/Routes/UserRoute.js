"use strict";
const express = require("express");
const router = express.Router();
const UserController = require("../Controller/UserController");
const DAO = require("../DB/UsersDAO");
const dao = new DAO();
const uc = new UserController(dao);
router.post("/newUser", uc.newUser);
router.get("/users", uc.getStoredUsers);

/* MANAGER  */
router.get("/managerSessions", uc.getStoredUsers);
router.post("/managerSessions", uc.getUser);

/* CUSTOMER */
router.post("/customerSessions", uc.getUser);

/* SUPPLIER */
router.post("/supplierSessions", uc.getUser);

/* CLERK */
router.post("/clerkSessions", uc.getUser);

/* QUALITY EMPLOYEE */
router.post("/qualityEmployeeSessions", uc.getUser);

/* DELIVERY EMPLOYEE */
router.post("/deliveryEmployeeSessions", uc.getUser);

router.get("/suppliers", uc.getSuppliers);
router.put("/users/:username", uc.editUser);
router.delete("/users/:username/:type", uc.deleteUser);
module.exports = router;
