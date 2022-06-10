"use strict";

const dayjs = require('dayjs');

class ReturnOrderController {
  constructor(dao) {
    this.dao = dao;
  }


  validateSkuItemsInReturnOrder = async (skuItems, restockOrderId) => {
    //const sql = "SELECT RFID FROM SKU_ITEM WHERE restockOrderID = ? AND RFID = ?";
    //const sql2 = "SELECT IRO.description, IRO.price FROM ITEM I, ITEM_IN_RESTOCK_ORDER IRO WHERE I.skuID = ? AND I.ID = IRO.itemID AND IRO.restockOrderID = ?";
   
    const sql1 = "SELECT RFID FROM SKU_ITEM WHERE RFID = ?";
    const sql2 = "SELECT ID FROM RESTOCK_ORDER WHERE ID = ?";

    for(let skuItem of skuItems){
      //const result = await this.dao.get(sql, [restockOrderId, skuItem.RFID]);
      //const result2 = await this.dao.get(sql2, [skuItem.SKUId, restockOrderId])
      const result1 = await this.dao.get(sql1, [skuItem.RFID]);
      const result2 = await this.dao.get(sql2, [restockOrderId]);
      if(result1 === undefined || result2 === undefined) { //|| result2 === undefined || result2.description !== skuItem.description || result2.price !== skuItem.price){
        return false;
      }
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
    const skuItemsSql = "SELECT RFID, SI.skuID, IRO.description, IRO.price FROM SKU_ITEM SI, ITEM I, ITEM_IN_RESTOCK_ORDER IRO WHERE SI.skuID = I.skuID AND I.ID = IRO.itemID AND IRO.restockOrderID = SI.restockOrderID AND returnOrderID = ?";
    const skuItems = await this.dao.all(skuItemsSql, [id]);

    return skuItems.map(skuItem => ({
        SKUId: skuItem.skuID,
        description: skuItem.description,
        price: skuItem.price,
        RFID: skuItem.RFID
    }));
  }


  getReturnOrders = async () => {
    try {
      const sql = "SELECT ID, returnDate, restockOrderID FROM RETURN_ORDER";
      let returnOrders = await this.dao.all(sql, []);

      if(returnOrders === undefined){
        return -1;
      }

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

      return returnOrders;
    } catch {
      return false;
    }
    
  };

  getReturnOrder = async (id) => {
    try{
      const sql = "SELECT ID, returnDate, restockOrderID FROM RETURN_ORDER WHERE ID = ?";
      const result = await this.dao.get(sql, [id]);
      if(!result){
        return -1;
      }

      let returnOrder = {
        id: result.ID,
        returnDate: result.returnDate,
        products: [],
        restockOrderId: result.restockOrderID
      };

      const skuItems = await this.getSkuItemsForReturnOrder(returnOrder.id);
      returnOrder.products = [...skuItems];

      return returnOrder;
    } catch {
      return false;
    }
    
  }


  createReturnOrder = async (returnDate, restockOrderId, products) => {
    try {
      if (!await this.validateSkuItemsInReturnOrder(products, restockOrderId)) {
        return -1;
      }

      const sql = "INSERT INTO RETURN_ORDER (returnDate, restockOrderID) VALUES (?,?)";

      const id = await this.dao.run(sql, [returnDate, restockOrderId]);

      await this.addSkuItemsToReturnOrder(id.id, products);

      return id.id;
    } catch {
      return false;
    }

  }


  deleteReturnOrder = async (id) => {
    try {
      
      const sql = "DELETE FROM RETURN_ORDER WHERE ID = ?";
      const idSql = "SELECT ID FROM RETURN_ORDER WHERE ID = ?";
      const idRes = await this.dao.get(idSql, [id]);

      if(idRes === undefined){
        return -1;
      }

      await this.dao.run(sql, [id]);

      return id;
    } catch {
      return false;
    }

  }


  deleteAllReturnOrders = async () => {
    try {
      
      const sql = "DELETE FROM RETURN_ORDER";

      await this.dao.run(sql, []);

      return true;
    } catch {
      return false;
    }

  }
  
}

module.exports = ReturnOrderController;