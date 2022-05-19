"use strict";

const express = require("express");
const router = express.Router();
const TDController = require("../Controller/TDController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const td = new TDController(dao);

router.get("/testdescriptors", td.TestDescriptor);
router.get("/testdescriptors/:id", td.getTestDescriptionById);
router.post("/testdescriptor", td.newTestDescriptor);
router.put("/testdescriptor/:id", td.editTDbyid);
router.delete("/testdescriptor/:id", td.deleteTD);

module.exports = router;
