"use strict";

const dayjs = require('dayjs');

class InternalOrderController {
  constructor(dao) {
    this.dao = dao;
    this.possibleStates = ["ISSUED", "ACCEPTED", "REFUSED", "CANCELED", "COMPLETED"];
  }


  validateInternalOrder = (internalOrder) => {
    if(Object.keys(internalOrder).length !== 3 ||
      !Object.keys(internalOrder).includes("issueDate") ||
      !Object.keys(internalOrder).includes("products") ||
      !Object.keys(internalOrder).includes("customerId") ||
      !dayjs(internalOrder.issueDate, "YYYY/MM/DD HH:mm").isValid() ||
      !Number.isInteger(internalOrder.customerId) ||
      !internalOrder.products.every(p => this.validateProductInInternalOrder(p))) {
      return false;
    }
    return true;
  }

  validateProductInInternalOrder = (product) => {
    if(Object.keys(product).length !== 4 ||
      !Object.keys(product).includes("SKUId") ||
      !Object.keys(product).includes("description") ||
      !Object.keys(product).includes("price") ||
      !Object.keys(product).includes("qty") ||
      !Number.isInteger(product.SKUId) ||
      !Number.isInteger(product.qty) ||
      Number.isNaN(Number(product.price))){
        return false;
    }
    return true;
  }

  validateSkuItemInInternalOrder = (skuItem) => {
    if(Object.keys(skuItem).length !== 2 ||
      !Object.keys(skuItem).includes("RFID") ||
      !Object.keys(skuItem).includes("SkuId") ||
      skuItem.RFID.length !== 32 ||
      !Number.isInteger(parseInt(skuItem.RFID)) ||
      !Number.isInteger(skuItem.SkuId)){
      return false;
    }
    return true;
  }

  addProductsToInternalOrder = async (internalOrderID, products) => {
    for(let product of products){
      let itemInInternalOrderSql = "INSERT INTO SKU_IN_INTERNAL_ORDER (internalOrderID, skuID, quantity) VALUES (?, ?, ?)";
      await this.dao.run(itemInInternalOrderSql, [internalOrderID, product.SKUId, product.qty]);
    }
  }

  addSkuItemsToInternalOrder = async (internalOrderID, products) => {
    for(let product of products){
      let itemInInternalOrderSql = "UPDATE SKU_ITEM SET internalOrderID = ? WHERE RFID = ? AND skuID = ?";
      await this.dao.run(itemInInternalOrderSql, [internalOrderID, product.RFID, product.SkuId]);
    }
  }

  getProductsForInternalOrder = async (id) => {
    const productsSql = "SELECT skuID, description, price, quantity FROM SKU_IN_INTERNAL_ORDER SIO, SKU S WHERE SIO.skuID = S.ID AND SIO.internalOrderID = ?";
    const products = await this.dao.all(productsSql, [id]);
    return products.map(product => ({
      SKUId: product.skuID,
      description: product.description,
      price: product.price,
      qty: product.quantity
    }));
  }


  getSkuItemsForInternalOrder = async (id) => {
    const skuItemsSql = "SELECT RFID, skuID, description, price FROM SKU_ITEM, SKU WHERE skuID = ID AND internalOrderID = ?";
    const skuItems = await this.dao.all(skuItemsSql, [id]);
    return skuItems.map(skuItem => ({
        SKUId: skuItem.skuID,
        description: skuItem.description,
        price: skuItem.price,
        RFID: skuItem.RFID
    }));
  }


  getInternalOrders = async (req, res) => {
    try {
      const sql = "SELECT ID, issueDate, state, customerID FROM INTERNAL_ORDER";
      let internalOrders = await this.dao.all(sql, []);

      internalOrders = internalOrders.map(element => ({
          id: element.ID,
          issueDate: element.issueDate,
          state: element.state,
          products: [],
          customerId: element.customerID
        }));

      for (let internalOrder of internalOrders) {
        const products = internalOrder.state !== "COMPLETED" ? await this.getProductsForInternalOrder(internalOrder.id) : await this.getSkuItemsForInternalOrder(internalOrder.id);
        console.log(products)
        internalOrder.products = [...products];
      }

      return res.status(200).json(internalOrders);
    } catch {
      return res.status(500).json({message: "Internal server error"});
    }
    
  };

  getInternalOrder = async (req, res) => {
    try{
      if(!Number.isInteger(parseInt(req.params.id))){
        return res.status(422).json({message: "Unprocessable Entity"});
      }
      const sql = "SELECT ID, issueDate, state, customerID FROM INTERNAL_ORDER WHERE ID = ?";
      const result = await this.dao.get(sql, [req.params.id]);
      if(!result){
        return res.status(404).json({message: "Not Found"});
      }

      let internalOrder = {
        id: result.ID,
        issueDate: result.issueDate,
        state: result.state,
        products: [],
        customerId: result.customerID
      };

      const products = internalOrder.state !== "COMPLETED" ? await this.getProductsForInternalOrder(internalOrder.id) : await this.getSkuItemsForInternalOrder(internalOrder.id);
      internalOrder.products = [...products];

      return res.status(200).json(internalOrder);
    } catch {
      return res.status(500).json({message: "Internal server error"});
    }
    
  }


  getInternalOrdersIssued = async (req, res) => {
    try{
      const sql = "SELECT ID, issueDate, state, customerID FROM INTERNAL_ORDER WHERE state = ?";
      let internalOrders = await this.dao.all(sql, ["ISSUED"]);
      internalOrders = internalOrders.map(element => ({
        id: element.ID,
        issueDate: element.issueDate,
        state: element.state,
        products: [],
        customerId: element.customerID
      }));

      for (let internalOrder of internalOrders) {
        const products = await this.getProductsForInternalOrder(internalOrder.id);
        internalOrder.products = [...products];
      }

      return res.status(200).json(internalOrders);
    } catch {
      return res.status(500).json({message: "Internal server error"});
    }
  }

  getInternalOrdersAccepted = async (req, res) => {
    try{
      const sql = "SELECT ID, issueDate, state, customerID FROM INTERNAL_ORDER WHERE state = ?";
      let internalOrders = await this.dao.all(sql, ["ACCEPTED"]);
      internalOrders = internalOrders.map(element => ({
        id: element.ID,
        issueDate: element.issueDate,
        state: element.state,
        products: [],
        customerId: element.customerID
      }));

      for (let internalOrder of internalOrders) {
        const products = await this.getProductsForInternalOrder(internalOrder.id);
        internalOrder.products = [...products];
      }

      return res.status(200).json(internalOrders);
    } catch {
      return res.status(500).json({message: "Internal server error"});
    }
  }


  createInternalOrder = async (req, res) => {
    try{
      console.log("CREATING...")
      if (!this.validateInternalOrder(req.body)) {
        return res.status(422).json({ error: "Unprocessable Entity" });
      }
      console.log("VALID");
      const sql = "INSERT INTO INTERNAL_ORDER (issueDate, state, customerID) VALUES (?,?,?)";

      const id = await this.dao.run(sql, [req.body.issueDate, "ISSUED", req.body.customerId]);

      await this.addProductsToInternalOrder(id.id, req.body.products);

      return res.status(201).json({message: "Created"});
    } catch {
      return res.status(503).json({message: "Service Unavailable"});
    }

  }

  
  changeStateOfInternalOrder = async (req, res) => {
    try{
      if (!Number.isInteger(parseInt(req.params.id)) ||
          Object.keys(req.body).length > 2 ||
          !Object.keys(req.body).includes("newState") ||
          !this.possibleStates.includes(req.body.newState) ||
          (Object.keys(req.body).length === 2 && !Object.keys(req.body).includes("products")) ||
          (Object.keys(req.body).length === 2 && !req.body.products.every(p => this.validateSkuItemInInternalOrder(p)))) {
        return res.status(422).json({ message: "Unprocessable Entity" });
      }

      const idSql = "SELECT ID FROM INTERNAL_ORDER WHERE ID = ?";
      const id = await this.dao.get(idSql, [req.params.id]);

      if(!id){
        return res.status(404).json({message: "Not Found"});
      }

      const sql = "UPDATE INTERNAL_ORDER SET state = ? WHERE ID = ?";

      await this.dao.run(sql, [req.body.newState, req.params.id]);

      if(req.body.newState === "COMPLETED" && req.body.products){
        await this.addSkuItemsToInternalOrder(req.params.id, req.body.products);
      }

      return res.status(200).json({message: "OK"});

    } catch {
      return res.status(503).json({message: "Internal server error"});
    }
    
  }



  deleteInternalOrder = async (req, res) => {
    try{
      if(!Number.isInteger(parseInt(req.params.id))){
        return res.status(422).json({message: "Unprocessable Entity"});
      }
      
      const sql = "DELETE FROM INTERNAL_ORDER WHERE ID = ?";
      const idSql = "SELECT ID FROM INTERNAL_ORDER WHERE ID = ?";
      const id = await this.dao.get(idSql, [req.params.id]);

      if(!id){
        return res.status(404).json({message: "Not Found"});
      }

      await this.dao.run(sql, [req.params.id]);

      return res.status(200).json({message: "Success"});
    } catch {
      return res.status(500).json({message: "Internal server error"});
    }

  }
  
 }

module.exports = InternalOrderController;
