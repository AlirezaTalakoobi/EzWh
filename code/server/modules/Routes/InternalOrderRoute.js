"use strict";
const express = require("express");
const router = express.Router();
const InternalOrderController = require("../Controller/InternalOrderController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const sic = new InternalOrderController(dao);
const { check, param, validationResult } = require("express-validator");
const dayjs = require("dayjs");



router.get("/internalOrders", async (req, res) => {
  const orders = await sic.getInternalOrders();
  if(!orders){
    return res.status(500).json({error: "Internal Server Error"});
  }
  if(orders === -1){
    return res.status(404).json({error: "No Orders Found"});
  }
  return res.status(200).json(orders);
});

router.get(
  "/internalOrder/:id",
  [param("id").notEmpty().isNumeric()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: "Request Format Incorrect" });
    }
    next();
  },
  async (req, res) => {
    const order = await sic.getInternalOrder(req.params.id);
    
    if(!order){
      return res.status(500).json({error: "Internal Server Error"})
    }
    
    if(order === -1){
      return res.status(404).json({error: "Order Not Found"});
    }
    return res.status(200).json(order);
  }
);

router.get("/internalOrdersIssued", async (req, res) => {
  const orders = await sic.getInternalOrdersIssued();
  if(!orders){
    return res.status(500).json({error: "Internal Server Error"})
  }
  if(orders === -1){
    return res.status(404).json({error: "No Issued Orders Found"})
  }
  return res.status(200).json(orders);
});

router.get("/internalOrdersAccepted", async (req, res) => {
  const orders = await sic.getInternalOrdersAccepted();
  if(!orders){
    return res.status(500).json({error: "Internal Server Error"})
  }
  if(orders === -1){
    return res.status(404).json({error: "No Issued Orders Found"})
  }
  return res.status(200).json(orders);
});

router.post("/internalOrders", 
    [
        check("issueDate").notEmpty().custom(d => dayjs(d)),
        check("customerId").notEmpty().isNumeric(),
        check("products").notEmpty().isArray(),
        check("products.*.SKUId").notEmpty().isNumeric(),
        check("products.*.description").notEmpty().isString(),
        check("products.*.price").notEmpty().isNumeric(),
        check("products.*.qty").notEmpty().isNumeric()
    ],
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ error: "Request Format Incorrect" });
      }
      next();
    },
    async (req, res) => {
      const orderId = await sic.createInternalOrder(req.body.issueDate, req.body.customerId, req.body.products);
      if(!orderId){
        return res.status(503).json({error: "Service Unavailable"});
      }
      if(orderId === -1){
        return res.status(422).json({error: "Invalid products"});
      }
      if(orderId === -2){
        return res.status(422).json({error: "Invalid customer ID"});
      }
      return res.status(201).json({id: orderId});
    }
);

router.put(
  "/internalOrders/:id",
  [
    param("id").notEmpty().isNumeric(),
    check("newState")
      .notEmpty()
      .isString()
      .isIn(["ISSUED", "ACCEPTED", "REFUSED", "CANCELED", "COMPLETED"]),
    check("products").optional().isArray(),
    check("products.*.SkuID").isNumeric(),
    check("products.*.RFID").isString().isLength({ min: 32, max: 32 }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: "Request Format Incorrect" });
    }
    next();
  },
  async (req, res) => {
    const orderId = await sic.changeStateOfInternalOrder(req.params.id, req.body.newState, req.body.products);
    if(!orderId){
      return res.status(503).json({error: "Service Unavailable"});
    }
    if(orderId === -1){
      return res.status(404).json({error: "Order Not Found"});
    }
    if(orderId === -2){
      return res.status(422).json({error: "Invalid Products Data"});
    }
    return res.status(200).json(orderId);
  }
);

router.delete(
  "/internalOrder/:id",
  [param("id").notEmpty().isNumeric()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: "Request Format Error" });
    }
    next();
  },
  async (req, res) => {
    const orderId = await sic.deleteInternalOrder(req.params.id);
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
  "/internalOrders",
  async (req, res) => {
    const orderId = await sic.deleteAllInternalOrders();
    if(!orderId){
      return res.status(503).json({error: "Service Unavailable"});
    }
    return res.status(204).json(orderId);
  }
);

module.exports = router;
