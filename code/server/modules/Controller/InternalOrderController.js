"use strict";

const dayjs = require("dayjs");

class InternalOrderController {
  static lastInternalOrderId = 1;
  constructor(dao) {
    this.dao = dao;
    this.possibleStates = [
      "ISSUED",
      "ACCEPTED",
      "REFUSED",
      "CANCELED",
      "COMPLETED",
    ];
  }

  validateProductsInInternalOrder = async (products) => {
    const skuSql = "SELECT ID, price, availableQuantity FROM SKU WHERE ID = ?";
    for (let product of products) {
      let sku = await this.dao.get(skuSql, [product.SKUId]);
      if (
        sku === undefined ||
        //sku.price !== product.price ||
        product.qty > sku.availableQuantity
      ) {
        console.log("COULDN'T CREATE ORDER")
        return false;
      }
    }
    return true;
  };

  validateSkuItemsInInternalOrder = async (skuItems, products) => {
    const skus = products.map((p) => ({
      skuID: p.SKUId,
      max: p.qty,
      current: 0,
    }));
    //const itemSql = "SELECT RFID FROM SKU_ITEM WHERE RFID = ?";
    for (let skuItem of skuItems) {
      let sku = skus.find((s) => s.skuID === skuItem.SkuID);
      //let rfid = await this.dao.get(itemSql, [skuItem.RFID]);
      if (sku === undefined || sku.current >= sku.max) {// || rfid === undefined) {
        return false;
      }
      sku.current += 1;
    }
    return true;
  };

  addProductsToInternalOrder = async (internalOrderID, products) => {
    for (let product of products) {
      let itemInInternalOrderSql =
        "INSERT INTO SKU_IN_INTERNAL_ORDER (internalOrderID, skuID, description, price, quantity) VALUES (?, ?, ?, ?, ?)";
      await this.dao.run(itemInInternalOrderSql, [
        internalOrderID,
        product.SKUId,
        product.description,
        product.price,
        product.qty,
      ]);
    }
  };

  addSkuItemsToInternalOrder = async (internalOrderID, products) => {
    const checkSkuItemSql = "SELECT RFID FROM SKU_ITEM WHERE RFID = ?";
    const newSkuItemSql = "INSERT INTO SKU_ITEM (RFID, available, dateOfStock, skuID, internalOrderID) VALUES (?,?,?,?,?)";
    const updateSkuItemSql = "UPDATE SKU_ITEM SET internalOrderID = ? WHERE RFID = ?";

    let rfid;
    for (let product of products) {
      rfid = this.dao.get(checkSkuItemSql, [product.RFID]);
      if(rfid === undefined){
        await this.dao.run(newSkuItemSql, [product.RFID, 0, dayjs().format("YYYY/MM/DD"), product.SkuID, internalOrderID]);
      } else {
        await this.dao.run(updateSkuItemSql, [internalOrderID, product.RFID]);
      }
    }
  };

  deleteSkuItemsFromInternalOrder = async (internalOrderID) => {
    const sql =
      "UPDATE SKU_ITEM SET internalOrderID = ? WHERE internalOrderID = ?";
    await this.dao.run(sql, [0, internalOrderID]);
  };

  getProductsForInternalOrder = async (id) => {
    const productsSql =
      "SELECT skuID, description, price, quantity FROM SKU_IN_INTERNAL_ORDER WHERE internalOrderID = ?";
    const products = await this.dao.all(productsSql, [id]);
    return products.map((product) => ({
      SKUId: product.skuID,
      description: product.description,
      price: product.price,
      qty: product.quantity,
    }));
  };

  getSkuItemsForInternalOrder = async (id) => {
    const skuItemsSql =
      "SELECT RFID, SI.skuID, SIO.description, SIO.price FROM SKU_ITEM SI, SKU_IN_INTERNAL_ORDER SIO WHERE SIO.skuID = SI.skuID AND SIO.internalOrderID = SI.internalOrderID AND SI.internalOrderID = ?";
    const skuItems = await this.dao.all(skuItemsSql, [id]);
    console.log(skuItems);
    return skuItems.map((skuItem) => ({
      SKUId: skuItem.skuID,
      description: skuItem.description,
      price: skuItem.price,
      RFID: skuItem.RFID,
    }));
  };

  getInternalOrders = async () => {
    try {
      const sql = "SELECT ID, issueDate, state, customerID FROM INTERNAL_ORDER";
      let internalOrders = await this.dao.all(sql, []);

      if (internalOrders === undefined) {
        return -1;
      }

      internalOrders = internalOrders.map((element) => ({
        id: element.ID,
        issueDate: element.issueDate,
        state: element.state,
        products: [],
        customerId: element.customerID,
      }));

      for (let internalOrder of internalOrders) {
        const products =
          internalOrder.state !== "COMPLETED"
            ? await this.getProductsForInternalOrder(internalOrder.id)
            : await this.getSkuItemsForInternalOrder(internalOrder.id);
        //console.log(products)
        internalOrder.products = [...products];
      }

      return internalOrders;
    } catch {
      return false;
    }
  };

  getInternalOrder = async (id) => {
    try {
      // if(!Number.isInteger(parseInt(req.params.id))){
      //   return res.status(422).json({message: "Unprocessable Entity"});
      // }
      const sql =
        "SELECT ID, issueDate, state, customerID FROM INTERNAL_ORDER WHERE ID = ?";
      const result = await this.dao.get(sql, [id]);
      if (!result) {
        return -1;
      }

      let internalOrder = {
        id: result.ID,
        issueDate: result.issueDate,
        state: result.state,
        products: [],
        customerId: result.customerID,
      };

      const products =
        internalOrder.state !== "COMPLETED"
          ? await this.getProductsForInternalOrder(internalOrder.id)
          : await this.getSkuItemsForInternalOrder(internalOrder.id);
      internalOrder.products = [...products];

      return internalOrder;
    } catch {
      return false;
    }
  };

  getInternalOrdersIssued = async () => {
    try {
      const sql =
        "SELECT ID, issueDate, state, customerID FROM INTERNAL_ORDER WHERE state = ?";
      let internalOrders = await this.dao.all(sql, ["ISSUED"]);

      if (internalOrders === undefined) {
        return -1;
      }

      internalOrders = internalOrders.map((element) => ({
        id: element.ID,
        issueDate: element.issueDate,
        state: element.state,
        products: [],
        customerId: element.customerID,
      }));

      for (let internalOrder of internalOrders) {
        const products = await this.getProductsForInternalOrder(
          internalOrder.id
        );
        internalOrder.products = [...products];
      }

      return internalOrders;
    } catch {
      return false;
    }
  };

  getInternalOrdersAccepted = async () => {
    try {
      const sql =
        "SELECT ID, issueDate, state, customerID FROM INTERNAL_ORDER WHERE state = ?";
      let internalOrders = await this.dao.all(sql, ["ACCEPTED"]);

      if (internalOrders === undefined) {
        return -1;
      }

      internalOrders = internalOrders.map((element) => ({
        id: element.ID,
        issueDate: element.issueDate,
        state: element.state,
        products: [],
        customerId: element.customerID,
      }));

      for (let internalOrder of internalOrders) {
        const products = await this.getProductsForInternalOrder(
          internalOrder.id
        );
        internalOrder.products = [...products];
      }

      return internalOrders;
    } catch {
      return false;
    }
  };

  createInternalOrder = async (issueDate, customerId, products) => {
    try {
      if (!(await this.validateProductsInInternalOrder(products))) {
        return -1;
      }

      const customer = await this.dao.get(
        "SELECT ID FROM USER WHERE ID = ? AND type = ?",
        [customerId, "customer"]
      );
      if (customer === undefined) {
        return -2;
      }

      const sql =
        "INSERT INTO INTERNAL_ORDER (issueDate, state, customerID) VALUES (?,?,?)";

      const id = await this.dao.run(sql, [issueDate, "ISSUED", customerId]);
      if (id.id > 0) {
        InternalOrderController.lastInternalOrderId = id.id;
      }

      await this.addProductsToInternalOrder(id.id, products);

      return id.id;
    } catch {
      return false;
    }
  };

  changeStateOfInternalOrder = async (id, state, skuItems) => {
    try {
      const idSql = "SELECT ID FROM INTERNAL_ORDER WHERE ID = ?";
      const idRes = await this.dao.get(idSql, [id]);

      if (idRes === undefined) {
        return -1;
      }

      const sql = "UPDATE INTERNAL_ORDER SET state = ? WHERE ID = ?";

      await this.dao.run(sql, [state, id]);

      const products = await this.getProductsForInternalOrder(id);

      await this.deleteSkuItemsFromInternalOrder(id);

      if (
        state === "COMPLETED" &&
        skuItems !== undefined &&
        (await this.validateSkuItemsInInternalOrder(skuItems, products))
      ) {
        await this.addSkuItemsToInternalOrder(id, skuItems);
      } else if (
        state === "COMPLETED" &&
        skuItems !== undefined &&
        !(await this.validateSkuItemsInInternalOrder(skuItems, products))
      ) {
        return -2;
      }

      return id;
    } catch {
      return false;
    }
  };

  deleteInternalOrder = async (id) => {
    try {
      // if(!Number.isInteger(parseInt(id))){
      //   return res.status(422).json({message: "Unprocessable Entity"});
      // }

      const sql = "DELETE FROM INTERNAL_ORDER WHERE ID = ?";
      const sql3 = "UPDATE SQLITE_SEQUENCE SET seq = ? WHERE name = ?";
      const idSql = "SELECT ID FROM INTERNAL_ORDER WHERE ID = ?";
      const idRes = await this.dao.get(idSql, [id]);

      if (idRes === undefined) {
        return -1;
      }

      await this.dao.run(sql, [id]);
      await this.dao.run(sql3, [0, "INTERNAL_ORDER"]);

      return id;
    } catch {
      return false;
    }
  };

  deleteAllInternalOrders = async () => {
    try {
      // if(!Number.isInteger(parseInt(id))){
      //   return res.status(422).json({message: "Unprocessable Entity"});
      // }

      const sql = "DELETE FROM INTERNAL_ORDER";
      const sql1 = "DELETE FROM SKU_IN_INTERNAL_ORDER";

      await this.dao.run(sql, []);
      await this.dao.run(sql1, []);

      return true;
    } catch {
      return false;
    }
  };
}

module.exports = InternalOrderController;
