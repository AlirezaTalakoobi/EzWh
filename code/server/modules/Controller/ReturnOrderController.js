"use strict";

const dayjs = require('dayjs');

class ReturnOrderController {
  constructor(dao) {
    this.dao = dao;
  }

  validateReturnOrder = (returnOrder) => {
    if(Object.keys(returnOrder).length !== 3 ||
      !Object.keys(returnOrder).includes("returnDate") ||
      !Object.keys(returnOrder).includes("products") ||
      !Object.keys(returnOrder).includes("restockOrderId") ||
      !dayjs(returnOrder.returnDate, "YYYY/MM/DD HH:mm").isValid() ||
      !Number.isInteger(returnOrder.restockOrderId) ||
      !returnOrder.products.every(p => this.validateSkuItemInReturnOrder(p))) {
      return false;
    }
    return true;
  }

  validateSkuItemInReturnOrder = (skuItem) => {
    if(Object.keys(skuItem).length !== 4 ||
      !Object.keys(skuItem).includes("RFID") ||
      !Object.keys(skuItem).includes("SKUId") ||
      !Object.keys(skuItem).includes("description") ||
      !Object.keys(skuItem).includes("price") ||
      skuItem.RFID.length !== 32 ||
      !Number.isInteger(parseInt(skuItem.RFID)) ||
      !Number.isInteger(skuItem.SKUId) ||
      Number.isNaN(Number(skuItem.price))){
      return false;
    }
    return true;
  }

  addSkuItemsToReturnOrder = async (returnOrderID, products) => {
    for(let product of products){
      let itemInReturnOrderSql = "UPDATE SKU_ITEM SET returnOrderID = ? WHERE RFID = ? AND skuID = ?";
      await this.dao.run(itemInReturnOrderSql, [returnOrderID, product.RFID, product.SKUId]);
    }
  }



  getSkuItemsForReturnOrder = async (id) => {
    const skuItemsSql = "SELECT RFID, skuID, description, price FROM SKU_ITEM, SKU WHERE skuID = ID AND returnOrderID = ?";
    const skuItems = await this.dao.all(skuItemsSql, [id]);

    return skuItems.map(skuItem => ({
        SKUId: skuItem.skuID,
        description: skuItem.description,
        price: skuItem.price,
        RFID: skuItem.RFID
    }));
  }


  getReturnOrders = async (req, res) => {
    try {
      const sql = "SELECT ID, returnDate, restockOrderID FROM RETURN_ORDER";
      let returnOrders = await this.dao.all(sql, []);

      returnOrders = returnOrders.map(element => ({
          id: element.ID,
          returnDate: element.returnDate,
          products: [],
          restockOrderId: element.restockOrderID
        }));

      for (let returnOrder of returnOrders) {
        const skuItems = await this.getSkuItemsForReturnOrder(returnOrder.id);
        returnOrder.products = [...skuItems];
      }

      return res.status(200).json(returnOrders);
    } catch {
      return res.status(500).json({message: "Internal server error"});
    }
    
  };

  getReturnOrder = async (req, res) => {
    try{
      if(!Number.isInteger(parseInt(req.params.id))){
        return res.status(422).json({message: "Unprocessable Entity"});
      }
      const sql = "SELECT ID, returnDate, restockOrderID FROM RETURN_ORDER WHERE ID = ?";
      const result = await this.dao.get(sql, [req.params.id]);
      if(!result){
        return res.status(404).json({message: "Not Found"});
      }

      let returnOrder = {
        id: result.ID,
        returnDate: result.returnDate,
        products: [],
        restockOrderId: result.restockOrderID
      };

      const skuItems = await this.getSkuItemsForReturnOrder(returnOrder.id);
      returnOrder.products = [...skuItems];

      return res.status(200).json(returnOrder);
    } catch {
      return res.status(500).json({message: "Internal server error"});
    }
    
  }


  createReturnOrder = async (req, res) => {
    try{
      
      if (!this.validateReturnOrder(req.body)) {
        return res.status(422).json({ error: "Unprocessable Entity" });
      }

      const sql = "INSERT INTO RETURN_ORDER (returnDate, restockOrderID) VALUES (?,?)";

      const id = await this.dao.run(sql, [req.body.returnDate, req.body.restockOrderId]);

      await this.addSkuItemsToReturnOrder(id.id, req.body.products);

      return res.status(201).json({message: "Created"});
    } catch {
      return res.status(503).json({message: "Service Unavailable"});
    }

  }


  deleteReturnOrder = async (req, res) => {
    try{
      if(!Number.isInteger(parseInt(req.params.id))){
        return res.status(422).json({message: "Unprocessable Entity"});
      }
      
      const sql = "DELETE FROM RETURN_ORDER WHERE ID = ?";
      const idSql = "SELECT ID FROM RETURN_ORDER WHERE ID = ?";
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

module.exports = ReturnOrderController;