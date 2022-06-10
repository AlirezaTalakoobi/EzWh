"use strict";
const express = require("express");
const router = express.Router();
const ReturnOrderController = require("../Controller/ReturnOrderController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const sic = new ReturnOrderController(dao);
const { check, param, validationResult } = require("express-validator");
const dayjs = require("dayjs");


router.get("/returnOrders", async (req, res) =>  {
  const orders = await sic.getReturnOrders();
  if(!orders){
    return res.status(500).json({error: "Internal Server Error"});
  }
  if(orders === -1){
    return res.status(404).json({error: "No Orders Found"});
  }
  return res.status(200).json(orders);
});

router.get(
  "/returnOrders/:id",
  [param("id").notEmpty().isNumeric()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: "Request Format Incorrect" });
    }
    next();
  },
  async (req, res) => {
    const order = await sic.getReturnOrder(req.params.id);
    
    if(!order){
      return res.status(500).json({error: "Internal Server Error"})
    }
    
    if(order === -1){
      return res.status(404).json({error: "Order Not Found"});
    }
    return res.status(200).json(order);
  }
);

router.post(
  "/returnOrder",
  [
    check("returnDate").notEmpty().custom(d => dayjs(d)),
    check("restockOrderId").notEmpty().isNumeric(),
    check("products").notEmpty().isArray(),
    check("products.*.SKUId").notEmpty().isNumeric(),
    check("products.*.description").notEmpty().isString(),
    check("products.*.price").notEmpty().isNumeric(),
    check("products.*.RFID").notEmpty().isString().isLength({ min: 32, max: 32 }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: "Request Format Error" });
    }
    next();
  },
  async (req, res) => {

    const orderId = await sic.createReturnOrder(req.body.returnDate, req.body.restockOrderId, req.body.products);
    if(!orderId){
      return res.status(503).json({error: "Service Unavailable"});
    }
    if(orderId === -1){
      return res.status(404).json({error: "Restock order or sku item not found not found"});
    }
    return res.status(201).json({id: orderId});
  }
);

router.delete(
  "/returnOrder/:id",
  [param("id").notEmpty().isNumeric()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: "Request Format Error" });
    }
    next();
  },
  async (req, res) => {
    const orderId = await sic.deleteReturnOrder(req.params.id);
    if(!orderId){
      return res.status(503).json({error: "Service Unavailable"});
    }
    if(orderId === -1){
      return res.status(404).json({error: "Order Not Found"});
    }
    return res.status(204).json(orderId);
  }
);


router.delete(
  "/returnOrders",
  async (req, res) => {
    const orderId = await sic.deleteAllReturnOrders();
    if(!orderId){
      return res.status(503).json({error: "Service Unavailable"});
    }
    return res.status(204).json(orderId);
  }
);

module.exports = router;
