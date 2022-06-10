"use strict";
const express = require("express");
const router = express.Router();
const RestockOrderController = require("../Controller/RestockOrderController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const sic = new RestockOrderController(dao);
const { check, param, validationResult } = require("express-validator");
const dayjs = require("dayjs");

router.get("/restockOrders", async (req, res) =>  {
  const orders = await sic.getRestockOrders();
  if(!orders){
    return res.status(500).json({error: "Internal Server Error"});
  }
  if(orders === -1){
    return res.status(404).json({error: "No Orders Found"});
  }
  console.log(JSON.stringify(orders))
  return res.status(200).json(orders);
});

router.get(
  "/restockOrder/:id",
  [param("id").notEmpty().isNumeric()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: "Request Format Incorrect" });
    }
    next();
  },
  async (req, res) => {
    const order = await sic.getRestockOrder(req.params.id);
    
    if(!order){
      return res.status(500).json({error: "Internal Server Error"})
    }
    
    if(order === -1){
      return res.status(404).json({error: "Order Not Found"});
    }
    return res.status(200).json(order);
  }
);

router.get("/restockOrdersIssued", async (req, res) => {
  const orders = await sic.getRestockOrdersIssued();
  if(!orders){
    return res.status(500).json({error: "Internal Server Error"})
  }
  if(orders === -1){
    return res.status(404).json({error: "No Issued Orders Found"})
  }
  return res.status(200).json(orders);
});

router.get("/restockOrders/:id/returnItems", [param("id").notEmpty().isNumeric()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: "Request Format Incorrect" });
    }
    next();
  },
  async (req, res) => {
    const returnItems = await sic.getRestockOrderReturnItems(req.params.id);
    if(!returnItems){
      return res.status(500).json({error: "Internal Server Error"});
    }
    if(returnItems === -1){
      return res.status(404).json({error: "Order Not Found"});
    }
    return res.status(200).json(returnItems);
  });


router.post(
  "/restockOrder",
  [
    check("supplierId").notEmpty().isNumeric(),
    check("issueDate").notEmpty().custom(d => dayjs(d)),
    check("products").notEmpty().isArray(),
    check("products.*.SKUId").notEmpty().isNumeric(),
    check("products.*.description").notEmpty().isString(),
    check("products.*.price").notEmpty().isNumeric({min: 0}),
    check("products.*.qty").notEmpty().isNumeric({min: 0}),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: "Request Format Incorrect" });
    }
    next();
  },
  async (req, res) => {
    const orderId = await sic.createRestockOrder(req.body.issueDate, req.body.supplierId, req.body.products);
    if(!orderId){
      return res.status(503).json({error: "Service Unavailable"});
    }
    if(orderId === -1){
      return res.status(422).json({error: "Wrong data"});
    }
    return res.status(201).json({id: orderId});
  }
);

router.put(
  "/restockOrder/:id",
  [
    param("id").notEmpty().isNumeric(),
    check("newState")
      .notEmpty()
      .isString()
      .isIn([
        "ISSUED",
        "DELIVERY",
        "DELIVERED",
        "TESTED",
        "COMPLETEDRETURN",
        "COMPLETED",
      ]),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: "Request Format Incorrect" });
    }
    next();
  },
  async (req, res) => {
    const orderId = await sic.changeStateOfRestockOrder(req.params.id, req.body.newState);
    if(!orderId){
      return res.status(503).json({error: "Service Unavailable"});
    }
    if(orderId === -1){
      return res.status(404).json({error: "Order Not Found"});
    }
    return res.status(200).json(orderId);
  }
);

router.put(
  "/restockOrder/:id/skuItems",
  [
    param("id").notEmpty().isNumeric(),
    check("skuItems").notEmpty().isArray(),
    check("skuItems.*.rfid").notEmpty().isString().isLength({ min: 32, max: 32 }),
    check("skuItems.*.SKUId").notEmpty().isNumeric(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: "Request Format Incorrect" });
    }
    next();
  },
  async (req, res) => {
    const orderId = await sic.addSkuItemsToRestockOrder(req.params.id, req.body.skuItems);
    if(!orderId){
      return res.status(503).json({error: "Service Unavailable"});
    }
    if(orderId === -1){
      return res.status(404).json({error: "Order Not Found"});
    }
    if(orderId === -2){
        return res.status(422).json({error: "Invalid SKU Items"});
    }
    if(orderId === -3){
        return res.status(422).json({error: "Order Not In Delivered State"});
    }
    return res.status(200).json(orderId);
  }
);

router.put(
  "/restockOrder/:id/transportNote",
  [
    param("id").notEmpty().isNumeric(),
    check("transportNote").notEmpty().isObject(),
    check("transportNote.deliveryDate").notEmpty().custom(d => dayjs(d))
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: "Request Format Incorrect" });
    }
    next();
  },
  async (req, res) => {
    const orderId = await sic.addTransportNoteToRestockOrder(req.params.id, req.body.transportNote);
    if(!orderId){
      return res.status(503).json({error: "Service Unavailable"});
    }
    if(orderId === -1){
      return res.status(404).json({error: "Order Not Found"});
    }
    if(orderId === -2){
      return res.status(422).json({error: "Order not in state DELIVERED"})
    }
    return res.status(200).json(orderId);
  }
);

router.delete(
  "/restockOrder/:id",
  [param("id").notEmpty().isNumeric()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: "Request Format Error" });
    }
    next();
  },
  async (req, res) => {
    const orderId = await sic.deleteRestockOrder(req.params.id);
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
  "/restockOrders",
  async (req, res) => {
    const orderId = await sic.deleteAllRestockOrders();
    if(!orderId){
      return res.status(503).json({error: "Service Unavailable"});
    }
    return res.status(204).json({message: "All restock orders deleted"});
  }
);

module.exports = router;



