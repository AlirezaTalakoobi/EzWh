"use strict";

const express = require("express");
const router = express.Router();
const TDController = require("../Controller/TDController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const td = new TDController(dao);
const { check, param, validationResult} = require("express-validator");

router.get("/testdescriptors", td.TestDescriptor);
router.get("/testdescriptors/:id",[param("id").isNumeric().not().optional()],
(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}, td.getTestDescriptionById);
router.post("/testdescriptor",[
    check("name").isString().isLength({ min: 1, max: 32 }),
    check("procedureDescription").isString(),
    check("idSKU").isNumeric()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  }, td.newTestDescriptor);
router.put("/testdescriptor/:id", [
    check("newName").isString().isLength({ min: 1, max: 32 }).optional(),
    check("newProcedureDescription").isString().optional(),
    check("newIdSKU").isNumeric().optional()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },td.editTDbyid);
router.delete("/testdescriptor/:id",  [param("id").isNumeric().not().optional()],
(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
},td.deleteTD);

module.exports = router;
