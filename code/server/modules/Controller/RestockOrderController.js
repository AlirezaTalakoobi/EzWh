"use strict";

const dayjs = require('dayjs');

class RestockOrderController {

  constructor(dao) {
    this.dao = dao;
    this.possibleStates = ["ISSUED", "DELIVERY", "DELIVERED", "TESTED", "COMPLETEDRETURN", "COMPLETED"];
  }


  validateProductsInRestockOrder = async (supplierId, products) => {
    const itemSql = "SELECT ID, price FROM ITEM WHERE supplierID = ? AND skuID = ?";
    for(let product of products){
      let item = await this.dao.get(itemSql, [supplierId, product.SKUId]);
      if(item === undefined || item.price !== product.price){
          return false;
      }
    }
    
    return true;
  }


  validateSkuItemsInRestockOrder = async (skuItems, products) => {
    const skus = products.map(p => ({skuID: p.SKUId, max: p.qty, current: 0}));
    const itemSql = "SELECT RFID FROM SKU_ITEM WHERE RFID = ?";

    for(let skuItem of skuItems){
      let sku = skus.find(s => s.skuID === skuItem.SKUId);
      let rfid = await this.dao.get(itemSql, [skuItem.rfid]);
      if(sku === undefined || rfid !== undefined || sku.current >= sku.max){
          return false;
      }
      sku.current += 1;
    }
    return true;
  }


  addProductsToRestockOrder = async (restockOrderId, supplierId, products) => {
    for(let product of products){
      let itemSql = "SELECT ID FROM ITEM WHERE supplierID = ? AND skuID = ?";
      let item = await this.dao.get(itemSql, [supplierId, product.SKUId]);
      let itemInRestockOrderSql = "INSERT INTO ITEM_IN_RESTOCK_ORDER (restockOrderID, itemID, description, price, quantity) VALUES (?, ?, ?, ?, ?)";
      await this.dao.run(itemInRestockOrderSql, [restockOrderId, item.ID, product.description, product.price, product.qty]);
    }
  }

  getProductsForRestockOrder = async (id) => {
    const productsSql = "SELECT skuID, IRO.description, IRO.price, quantity FROM ITEM I, ITEM_IN_RESTOCK_ORDER IRO WHERE I.ID = IRO.itemID AND IRO.restockOrderID = ?";
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


  getRestockOrders = async () => {
    try {
      const sql = "SELECT ID, issueDate, state, supplierID, transportNote FROM RESTOCK_ORDER";
      let restockOrders = await this.dao.all(sql, []);

      if(restockOrders === undefined){
        return -1;
      }

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

      //return res.status(200).json(restockOrders);
      return restockOrders;
    } catch {
      //return res.status(500).json({message: "Internal server error"});
      return false;
    }
    
  };

  getRestockOrder = async (id) => {
    try{
      const sql = "SELECT ID, issueDate, state, supplierID, transportNote FROM RESTOCK_ORDER WHERE ID = ?";
      const result = await this.dao.get(sql, [id]);
      if(!result){
        //return res.status(404).json({message: "Not Found"});
        return -1;
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

      //return res.status(200).json(restockOrder);
      return restockOrder;
    } catch {
      //return res.status(500).json({message: "Internal server error"});
      return false;
    }
    
  }


  getRestockOrdersIssued = async () => {
    try{
      const sql = "SELECT ID, issueDate, state, supplierID FROM RESTOCK_ORDER WHERE state = ?";
      let restockOrders = await this.dao.all(sql, ["ISSUED"]);

      if(restockOrders === undefined){
        return -1;
      }

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

      // return res.status(200).json(restockOrders);
      return restockOrders;
    } catch {
      // return res.status(500).json({message: "Internal server error"});
      return false;
    }
  }

  getRestockOrderReturnItems = async (id) => {
    try{
      const skuItemsSql = "SELECT SI.skuID, SI.RFID FROM SKU_ITEM SI WHERE restockOrderID = ? AND SI.RFID NOT IN (SELECT DISTINCT T.RFID FROM TEST_RESULT T WHERE T.result = 0)";
      const skuItems = await this.dao.all(skuItemsSql, [req.params.id]);
      if(skuItems === undefined){
        // return res.status(404).json({message: "Not Found"});
        return -1;
      }
      return skuItems.map(skuItem => ({
        rfid: skuItem.RFID,
        SKUId: skuItem.skuId
      }));
    } catch {
      return false;
    }
    
  }

  createRestockOrder = async (issueDate, supplierId, products) => {
    try{
      if(!await this.validateProductsInRestockOrder(supplierId, products)){
        return -1;
      }
      const sql = "INSERT INTO RESTOCK_ORDER (issueDate, state, supplierID) VALUES (?,?,?)";

      const id = await this.dao.run(sql, [issueDate, "ISSUED", supplierId]);

      await this.addProductsToRestockOrder(id.id, supplierId, products);

      //return res.status(201).json({message: "Created"});
      return id.id;
    } catch {
      return false;
    }

  }

  
  changeStateOfRestockOrder = async (id, state) => {
    try{
      // if (!Number.isInteger(parseInt(req.params.id)) ||
      //     Object.keys(req.body).length !== 1 ||
      //     !Object.keys(req.body).includes("newState") ||
      //     !this.possibleStates.includes(req.body.newState)) {
      //   return res.status(422).json({ message: "Unprocessable Entity" });
      // }

      const idSql = "SELECT ID FROM RESTOCK_ORDER WHERE ID = ?";
      const idRes = await this.dao.get(idSql, [id]);

      if(idRes === undefined){
        return -1;
      }

      const sql = "UPDATE RESTOCK_ORDER SET state = ? WHERE ID = ?";

      await this.dao.run(sql, [state, id]);

      return id;

    } catch {
      return false;
    }
    
  }


  addSkuItemsToRestockOrder = async (id, skuItems) => {
    try{
      // if (!Number.isInteger(parseInt(req.params.id)) ||
      //     Object.keys(req.body).length !== 1 ||
      //     !Object.keys(req.body).includes("skuItems") ||
      //     !req.body.skuItems.every(si => this.validateSkuItemInRestockOrder(si))) {
      //   return res.status(422).json({ message: "Unprocessable server entity" });
      // }      
      const idSql = "SELECT ID FROM RESTOCK_ORDER WHERE ID = ? AND state = ?";
      const idRes = await this.dao.get(idSql, [id, "DELIVERED"]);

      if(idRes === undefined){
        return -1;
      }

      const products = await this.getProductsForRestockOrder(id);
      const oldSkuItems = await this.getSkuItemsForRestockOrder(id);

      if(!await this.validateSkuItemsInRestockOrder([...oldSkuItems, ...skuItems], products)){
        return -2;
      }


      //const sql = "UPDATE SKU_ITEM SET restockOrderID = ? WHERE RFID = ?";
      const sql = "INSERT INTO SKU_ITEM (RFID, available, dateOfStock, skuID, restockOrderID) VALUES (?,?,?,?,?)";

      for(let skuItem of skuItems){
        await this.dao.run(sql, [skuItem.rfid, 0, dayjs().format("YYYY/MM/DD"), skuItem.SKUId, id]);
      }

      return id;
    } catch {
      return false;
    }

  }


  addTransportNoteToRestockOrder = async (id, transportNote) => {
    try {
      // if (!Number.isInteger(parseInt(req.params.id)) ||
      //     Object.keys(req.body).length !== 1 ||
      //     !Object.keys(req.body).includes("transportNote") ||
      //     !Object.keys(req.body.transportNote).length !== 1 ||
      //     !Object.keys(req.body.transportNote).includes("deliveryDate") ||
      //     !dayjs(req.body.transportNote.deliveryDate)) {
      //   return res.status(422).json({ message: "Unprocessable Entity" });
      // }

      const idSql = "SELECT ID, state FROM RESTOCK_ORDER WHERE ID = ?";
      const result = await this.dao.get(idSql, [id]);
      
      if(result.ID === undefined){
              return -1;
      }
      
      if(result.state !== "DELIVERED"){
        return -2;
      }

      

      const sql = "UPDATE RESTOCK_ORDER SET transportNote = ? WHERE ID = ?";

      await this.dao.run(sql, [transportNote.deliveryDate, id]);

      return result.ID;
    } catch {
      return false;
    }

  }


  deleteRestockOrder = async (id) => {
    try{
      // if(!Number.isInteger(parseInt(req.params.id))){
      //   return res.status(422).json({message: "Unprocessable Entity"});
      // }
      
      const sql = "DELETE FROM RESTOCK_ORDER WHERE ID = ?";
      const idSql = "SELECT ID FROM RESTOCK_ORDER WHERE ID = ?";
      const idRes = await this.dao.get(idSql, [id]);

      if(idRes.ID === undefined){
        return -1;
      }

      await this.dao.run(sql, [id]);

      return id;
    } catch {
      return false;
    } 
  }


  deleteAllRestockOrders = async () => {
    try{
      const sql = "DELETE FROM RESTOCK_ORDER";
      await this.dao.run(sql);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = RestockOrderController;
