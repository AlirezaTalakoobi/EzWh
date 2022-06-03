"use strict";
const express = require("express");
const router = express.Router();
const PositionController = require("../Controller/PositionController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const uc = new PositionController(dao);
const { body, param, validationResult } = require("express-validator");
const { unix } = require("dayjs");

/* MANAGER  */
router.get("/positions", async (req, res) => {
  const result = await uc.getPosition();
  if (result["ans"] === 200) {
    return res.status(200).json(result["result"]);
  } else {
    return res.status(500).send("500 Internal Server Error");
  }
});

router.post(
  "/position",
  body("positionID").isString(),
  body("positionID").isLength({ min: 12 }),
  body("positionID").isLength({ max: 12 }),
  body("aisleID").isString(),
  body("aisleID").isLength({ min: 4 }),
  body("aisleID").isLength({ max: 4 }),
  body("row").isString(),
  body("row").isLength({ min: 4 }),
  body("row").isLength({ max: 4 }),
  body("col").isString(),
  body("col").isLength({ min: 4 }),
  body("col").isLength({ max: 4 }),
  body("maxWeight").isInt(),
  body("maxVolume").isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .send(
          "422 Unprocessable Entity (validation of request body or of positionID failed)"
        );
    }
    if (Object.keys(req.body).length === 0) {
      return res
        .status(422)
        .send(
          "422 Unprocessable Entity (validation of request body or of positionID failed)"
        );
    }
    const ApiInfo = req.body;
    if (
      ApiInfo === undefined ||
      ApiInfo.positionID === undefined ||
      ApiInfo.aisleID === undefined ||
      ApiInfo.row === undefined ||
      ApiInfo.col === undefined ||
      ApiInfo.maxWeight === undefined ||
      ApiInfo.maxVolume === undefined
    ) {
      return res
        .status(422)
        .send(
          "422 Unprocessable Entity (validation of request body or of positionID failed)"
        );
    }
    let ans = await uc.createPosition(
      ApiInfo.positionID,
      ApiInfo.aisleID,
      ApiInfo.row,
      ApiInfo.col,
      ApiInfo.maxWeight,
      ApiInfo.maxVolume
    );
    if (ans === 201) {
      res.status(201).send("201 Created");
    } else {
      res.status(503).send("503 Service Unavailable");
    }
  },
  uc.createPosition
);

router.put(
  "/position/:positionID",
  param("positionID").isString(),
  param("positionID").isLength({ min: 12 }),
  param("positionID").isLength({ max: 12 }),
  body("newAisleID").isString(),
  body("newAisleID").isLength({ min: 4 }),
  body("newAisleID").isLength({ max: 4 }),
  body("newRow").isString(),
  body("newRow").isLength({ min: 4 }),
  body("newRow").isLength({ max: 4 }),
  body("newCol").isString(),
  body("newCol").isLength({ min: 4 }),
  body("newCol").isLength({ max: 4 }),
  body("newMaxWeight").isInt({ min: 0 }),
  body("newMaxVolume").isInt({ min: 0 }),
  body("newOccupiedWeight").isInt({ min: 0 }),
  body("newOccupiedVolume").isInt({ min: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .send(
          "422 Unprocessable Entity (validation of request body or of positionID failed)"
        );
    }
    if (Object.keys(req.body).length === 0) {
      return res
        .status(422)
        .send(
          "422 Unprocessable Entity (validation of request body or of positionID failed)"
        );
    }
    const ApiInfo = req.body;
    if (
      ApiInfo === undefined ||
      ApiInfo.newAisleID === undefined ||
      ApiInfo.newRow === undefined ||
      ApiInfo.newCol === undefined ||
      ApiInfo.newMaxWeight === undefined ||
      ApiInfo.newMaxVolume === undefined ||
      ApiInfo.newOccupiedWeight === undefined ||
      ApiInfo.newOccupiedVolume === undefined
    ) {
      return res
        .status(422)
        .send(
          "422 Unprocessable Entity (validation of request body or of positionID failed)"
        );
    }
    let ans = await uc.modifyPosition(
      req.params.positionID,
      ApiInfo.newAisleID,
      ApiInfo.newRow,
      ApiInfo.newCol,
      ApiInfo.newMaxWeight,
      ApiInfo.newMaxVolume,
      ApiInfo.newOccupiedWeight,
      ApiInfo.newOccupiedVolume
    );
    if (ans === 404) {
      return res.status(404).send("404 NOT FOUND");
    } else if (ans === 500) {
      return res.status(503).send("503 Service Unavailable");
    }
    return res.send(200).send("200 OK");
  }
);

router.put(
  "/position/:positionID/changeID",
  param("positionID").isString(),
  param("positionID").isLength({ min: 12 }),
  param("positionID").isLength({ max: 12 }),
  body("newPositionID").isString(),
  body("newPositionID").isLength({ min: 12 }),
  body("newPositionID").isLength({ max: 12 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .send(
          "422 Unprocessable Entity (validation of request body or of positionID failed)"
        );
    }
    if (Object.keys(req.body).length === 0) {
      return res
        .status(422)
        .send(
          "422 Unprocessable Entity (validation of request body or of positionID failed)"
        );
    }
    const ApiInfo = req.body;
    if (ApiInfo === undefined || ApiInfo.newPositionID === undefined) {
      return res
        .status(422)
        .send(
          "422 Unprocessable Entity (validation of request body or of positionID failed)"
        );
    }
    let ans = await uc.changePositionID(
      req.params.positionID,
      ApiInfo.newPositionID
    );
    if (ans === 404) {
      return res.status(404).send("404 NOT FOUND");
    } else if (ans === 500) {
      return res.status(503).send("503 Service Unavailable");
    }
    return res.send(200).send("200 OK");
  }
);

router.delete(
  "/position/:positionID",
  param("positionID").isString(),
  param("positionID").isLength({ min: 12 }),
  param("positionID").isLength({ max: 12 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .send("422 Unprocessable Entity(validation of positionID failed)");
    }
    let ans = await uc.deletePosition(req.params.positionID);
    if (ans === 204) {
      return res.status(204).send("204 No Content");
    } else {
      return res.status(503).send("503 Service Unavailable");
    }
  }
);

router.delete("/deleteAllPositions", async (req, res) => {
  let ans = await uc.deleteAll();
  if (ans) {
    return res.status(204).send("204 No Content");
  } else {
    return res.status(503).send("503 Service Unavailable");
  }
});
/* Clerk  */
// router.get("/position", uc.getPosition);
// router.put("/position/:positionID/changeID", uc.changePositionID);

module.exports = router;
