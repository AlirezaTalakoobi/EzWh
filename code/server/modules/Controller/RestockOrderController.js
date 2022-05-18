"use strict";

const dayjs = require('dayjs');

class RestockOrderController {
  constructor(dao) {
    this.dao = dao;
    this.possibleStates = ["ISSUED", "DELIVERY", "DELIVERED", "TESTED", "COMPLETEDRETURN", "COMPLETED"];
  }

  validateRestockOrder = (restockOrder) => {
    if(Object.keys(restockOrder).length !== 3 ||
      !Object.keys(restockOrder).includes("issueDate") ||
      !Object.keys(restockOrder).includes("products") ||
      !Object.keys(restockOrder).includes("supplierId") ||
      !dayjs(restockOrder.issueDate, "YYYY/MM/DD HH:mm").isValid() ||
      !Number.isInteger(restockOrder.supplierId) ||
      !restockOrder.products.every(p => this.validateProductInRestockOrder(p))) {
      return false;
    }
    return true;
  }

  validateProductInRestockOrder = (product) => {
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

  validateSkuItemInRestockOrder = (skuItem) => {
    if(Object.keys(skuItem).length !== 2 ||
      !Object.keys(skuItem).includes("rfid") ||
      !Object.keys(skuItem).includes("SKUId") ||
      skuItem.rfid.length !== 32 ||
      !Number.isInteger(parseInt(skuItem.rfid)) ||
      !Number.isInteger(skuItem.SKUId)){
      return false;
    }
    return true;
  }

  addProductsToRestockOrder = async (restockOrderID, restockOrder) => {
    for(let product of restockOrder.products){
      let itemSql = "SELECT ID FROM ITEM WHERE supplierID = ? AND skuID = ?";
      let itemID = await this.dao.get(itemSql, [restockOrder.supplierId, product.SKUId]);
      let itemInRestockOrderSql = "INSERT INTO ITEM_IN_RESTOCK_ORDER (restockOrderID, itemID, quantity) VALUES (?, ?, ?)";
      await this.dao.run(itemInRestockOrderSql, [restockOrderID, itemID.ID, product.qty]);
    }
  }

  getProductsForRestockOrder = async (id) => {
    const productsSql = "SELECT skuID, description, price, quantity FROM ITEM I, ITEM_IN_RESTOCK_ORDER IRO WHERE I.ID = IRO.itemID AND IRO.restockOrderID = ?";
    const products = await this.dao.all(productsSql, [id]);
    return products.map(product => ({
      SKUId: product.skuID,
      description: product.description,
      price: product.price,
      qty: product.quantity
    }));
  }


  getSkuItemsForRestockOrder = async (id) => {
    const skuItemsSql = "SELECT skuID, RFID FROM SKU_ITEM WHERE restockOrderID = ?";
    const skuItems = await this.dao.all(skuItemsSql, [id]);
    return skuItems.map(skuItem => ({
      rfid: skuItem.RFID,
      SKUId: skuItem.skuID
    }));
  }


  getRestockOrders = async (req, res) => {
    try {
      const sql = "SELECT ID, issueDate, state, supplierID, transportNote FROM RESTOCK_ORDER";
      let restockOrders = await this.dao.all(sql, []);

      restockOrders = restockOrders.map(element => {
        if(element.transportNote){
          return {
            id: element.ID,
            issueDate: element.issueDate,
            state: element.state,
            products: [],
            skuItems: [],
            supplierId: element.supplierID,
            transportNote: {deliveryDate: element.transportNote}
          }
        }
        return {
          id: element.ID,
          issueDate: element.issueDate,
          state: element.state,
          products: [],
          skuItems: [],
          supplierId: element.supplierID
        }
      });

      for (let restockOrder of restockOrders) {
        const products = await this.getProductsForRestockOrder(restockOrder.id);
        restockOrder.products = [...products];
        const skuItems = await this.getSkuItemsForRestockOrder(restockOrder.id);
        restockOrder.skuItems = [...skuItems];
      }

      return res.status(200).json(restockOrders);
    } catch {
      return res.status(500).json({message: "Internal server error"});
    }
    
  };

  getRestockOrder = async (req, res) => {
    try{
      if(!Number.isInteger(parseInt(req.params.id))){
        return res.status(422).json({message: "Unprocessable Entity"});
      }
      const sql = "SELECT ID, issueDate, state, supplierID, transportNote FROM RESTOCK_ORDER WHERE ID = ?";
      const result = await this.dao.get(sql, [req.params.id]);
      if(!result){
        return res.status(404).json({message: "Not Found"});
      }

      let restockOrder = result.transportNote ? {
        id: result.ID,
        issueDate: result.issueDate,
        state: result.state,
        products: [],
        skuItems: [],
        supplierId: result.supplierID,
        transportNote: {deliveryDate: result.transportNote}
      } : {
        id: result.ID,
        issueDate: result.issueDate,
        state: result.state,
        products: [],
        skuItems: [],
        supplierId: result.supplierID
      };


      const products = await this.getProductsForRestockOrder(restockOrder.id);
      restockOrder.products = [...products];
      const skuItems = await this.getSkuItemsForRestockOrder(restockOrder.id);
      restockOrder.skuItems = [...skuItems];

      return res.status(200).json(restockOrder);
    } catch {
      return res.status(500).json({message: "Internal server error"});
    }
    
  }


  getRestockOrdersIssued = async (req, res) => {
    try{
      const sql = "SELECT ID, issueDate, state, supplierID FROM RESTOCK_ORDER WHERE state = ?";
      let restockOrders = await this.dao.all(sql, ["ISSUED"]);
      restockOrders = restockOrders.map(element => ({
        id: element.ID,
        issueDate: element.issueDate,
        state: element.state,
        products: [],
        skuItems: [],
        supplierId: element.supplierID
      }));

      for (let restockOrder of restockOrders) {
        const products = await this.getProductsForRestockOrder(restockOrder.id);
        restockOrder.products = [...products];
        const skuItems = await this.getSkuItemsForRestockOrder(restockOrder.id);
        restockOrder.skuItems = [...skuItems];
      }

      return res.status(200).json(restockOrders);
    } catch {
      return res.status(500).json({message: "Internal server error"});
    }
  }

  getRestockOrderReturnItems = async (req, res) => {
    try{
      if(!Number.isInteger(parseInt(req.params.id))){
        return res.status(422).json({message: "Unprocessable Entity"});
      }
      const skuItemsSql = "SELECT SI.skuID, SI.RFID FROM SKU_ITEM SI WHERE restockOrderID = ? AND SI.RFID NOT IN (SELECT DISTINCT T.RFID FROM TEST_RESULT T WHERE T.result = 0)";
      const skuItems = await this.dao.all(skuItemsSql, [req.params.id]);
      if(!skuItems){
        return res.status(404).json({message: "Not Found"});
      }
      return res.status(200).json(skuItems.map(skuItem => ({
        rfid: skuItem.RFID,
        SKUId: skuItem.skuId
      })));
    } catch {
      return res.status(500).json({message: "Internal server error"});
    }
    
  }

  createRestockOrder = async (req, res) => {
    try{
      
      if (!this.validateRestockOrder(req.body)) {
        return res.status(422).json({ error: "Unprocessable Entity" });
      }
      console.log("VALID");
      const sql = "INSERT INTO RESTOCK_ORDER (issueDate, state, supplierID) VALUES (?,?,?)";

      const id = await this.dao.run(sql, [req.body.issueDate, "ISSUED", req.body.supplierId]);

      await this.addProductsToRestockOrder(id.id, req.body);

      return res.status(201).json({message: "Created"});
    } catch {
      return res.status(503).json({message: "Service Unavailable"});
    }

  }

  
  changeStateOfRestockOrder = async (req, res) => {
    try{
      if (!Number.isInteger(parseInt(req.params.id)) ||
          Object.keys(req.body).length !== 1 ||
          !Object.keys(req.body).includes("newState") ||
          !this.possibleStates.includes(req.body.newState)) {
        return res.status(422).json({ message: "Unprocessable Entity" });
      }

      const idSql = "SELECT ID FROM RESTOCK_ORDER WHERE ID = ?";
      const id = await this.dao.get(idSql, [req.params.id]);

      if(!id){
        return res.status(404).json({message: "Not Found"});
      }

      const sql = "UPDATE RESTOCK_ORDER SET state = ? WHERE ID = ?";

      const result = await this.dao.run(sql, [req.body.newState, req.params.id]);

      return res.status(200).json({message: "OK"});

    } catch {
      return res.status(503).json({message: "Internal server error"});
    }
    
  }


  addSkuItemsToRestockOrder = async (req, res) => {
    try{
      if (!Number.isInteger(parseInt(req.params.id)) ||
          Object.keys(req.body).length !== 1 ||
          !Object.keys(req.body).includes("skuItems") ||
          !req.body.skuItems.every(si => this.validateSkuItemInRestockOrder(si))) {
        return res.status(422).json({ message: "Unprocessable server entity" });
      }

      const idSql = "SELECT ID FROM RESTOCK_ORDER WHERE ID = ?";
      const id = await this.dao.get(idSql, [req.params.id]);

      if(!id){
        return res.status(404).json({message: "Not Found"});
      }

      const sql = "UPDATE SKU_ITEM SET restockOrderID = ? WHERE RFID = ?";

      for(let skuItem of req.body.skuItems){
        await this.dao.run(sql, [req.params.id, skuItem.rfid]);
      }

      return res.status(200).json({message: "OK"});
    } catch {
      return res.status(503).json({message: "Service Unavailable"});
    }

  }


  addTransportNoteToRestockOrder = async (req, res) => {
    try {
      if (!Number.isInteger(parseInt(req.params.id)) ||
          Object.keys(req.body).length !== 1 ||
          !Object.keys(req.body).includes("transportNote") ||
          !Object.keys(req.body.transportNote).length !== 1 ||
          !Object.keys(req.body.transportNote).includes("deliveryDate") ||
          !dayjs(req.body.transportNote.deliveryDate)) {
        return res.status(422).json({ message: "Unprocessable Entity" });
      }

      const idSql = "SELECT ID, state FROM RESTOCK_ORDER WHERE ID = ?";
      const result = await this.dao.get(idSql, [req.params.id]);

      if(result.state !== "DELIVERED"){
        return res.status(422).json({ message: "Unprocessable Entity" });
      }

      if(!result.id){
        return res.status(404).json({message: "Not Found"});
      }

      const sql = "UPDATE RESTOCK_ORDER SET transportNote = ? WHERE ID = ?";

      await this.dao.run(sql, [req.body.transportNote.deliveryDate, req.params.id]);

      return res.status(200).json({message: "OK"});
    } catch {
      return res.status(503).json({message: "Service Unavailable"});
    }

  }


  deleteRestockOrder = async (req, res) => {
    try{
      if(!Number.isInteger(parseInt(req.params.id))){
        return res.status(422).json({message: "Unprocessable Entity"});
      }
      
      const sql = "DELETE FROM RESTOCK_ORDER WHERE ID = ?";
      const idSql = "SELECT ID FROM RESTOCK_ORDER WHERE ID = ?";
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

module.exports = RestockOrderController;
