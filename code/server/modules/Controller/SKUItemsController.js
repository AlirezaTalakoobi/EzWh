"use strict";

class SKUItemsController {
  constructor(dao) {
    this.dao = dao;
  }

  getSKUItems = async () => {
    try {
      const sql = "SELECT * FROM SKU_ITEM";
      let result = await this.dao.all(sql);

      result = result.map((sku) => ({
        RFID: sku.RFID,
        SKUId: sku.skuID,
        Available: sku.available,
        DateOfStock: sku.dateOfStock,
      }));
      return result;
    } catch {
      false;
    }
  };

  newSKUItem = async (RFID, SKUId, DateOfStock) => {
    const sql =
      "INSERT INTO SKU_ITEM(RFID, available, skuID, dateOfStock) VALUES (?,?,?,?)";

    let result = await this.dao.all("Select * from SKU where ID=?", [SKUId]);
    if (result.length === 0) {
      return { skuid: "No SKU associated to SKUId" };
    } else {
      try {
        if (
          (await this.dao.get("Select * from SKU_ITEM where RFID=?", RFID)) ===
          undefined
        ) {
          result = this.dao.run(sql, [RFID, 0, parseInt(SKUId), DateOfStock]);
          return result;
        } else {
          return { message: "Item with RFID already existing" };
        }
      } catch {
        return false;
      }
    }
  };

  getSKUItemsBySKUId = async (id) => {
    try {
      const sql =
        "SELECT RFID,skuID,dateOfStock FROM SKU_ITEM WHERE available=? and skuID=?";
      const result = await this.dao.all(sql, [1, id]);
      if (result.length === 0) {
        return { message: "no item associated to id" };
      }
      return result.map((sku) => ({
        RFID: sku.RFID,
        SKUId: sku.skuID,
        DateOfStock: sku.dateOfStock,
      }));
    } catch {
      false;
    }
  };
  getSKUItemsByRFID = async (rfid) => {
    try {
      const sql =
        "SELECT RFID,skuID,available, dateOfStock FROM SKU_ITEM WHERE RFID=?";
      const sku = await this.dao.get(sql, [rfid]);
      if (sku === undefined) {
        return { message: "no SKU found with this rfid" };
      }
      return {
        RFID: sku.RFID,
        SKUId: sku.skuID,
        Available: sku.available,
        DateOfStock: sku.dateOfStock,
      };
    } catch {
      return false;
    }
  };

  editRFID = async (rfid, newRFID, newAvailable, newDateOfStock) => {
    try {
      const sql = await this.dao.all("Select * from SKU_ITEM where RFID=? ", [
        rfid,
      ]);

      if (sql.length === 0) {
        return { item: "Item not found" };
      } else {
        // if (
        //   (await this.dao.get("Select * from SKUItems where rfid=?", [
        //     req.body.newRFID,
        //   ])) === undefined
        // ) {
        try {
          const sql =
            "UPDATE SKU_ITEM SET RFID =? , available=? , dateOfStock=? where RFID=?";
          let result = await this.dao.run(sql, [
            newRFID.length < 32 ? rfid : newRFID,
            newAvailable,
            newDateOfStock,
            rfid,
          ]);
          return result;
        } catch {
          return { message: "Item with new RFID already existing" };
        }
      }
      //   else{return res.status(404).json("Item with RFID already")}
      // }
    } catch {
      return false;
    }
  };
  deleteItem = async (rfid) => {
    try {
      const check = await this.dao.all("Select * from SKU_ITEM where RFID=? ", [
        rfid,
      ]);
      if (check.length === 0) {
        return { message: "Item not found" };
      } else {
        const sql = "DELETE FROM SKU_ITEM where RFID=?";
        const result = await this.dao.run(sql, [rfid]);
        return result;
      }
    } catch {
      false;
    }
  };
  deleteAll = async () => {
    try {
      const res = await this.dao.run("Delete from SKU_ITEM", []);
      if (res) {
        return true;
      }
      return false;
    } catch {
      return -1;
    }
  };
}

module.exports = SKUItemsController;
