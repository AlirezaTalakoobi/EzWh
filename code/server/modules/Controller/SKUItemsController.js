"use strict";

class SKUItemsController {
  constructor(dao) {
    this.dao = dao;
  }

  getSKUItems = async (req, res) => {
    try {
      const sql = "SELECT * FROM SKU_ITEM";
      let result = await this.dao.all(sql);
      return res.status(200).json(
        result.map((sku) => ({
          RFID: sku.RFID,
          SKUId: sku.skuID,
          Available: sku.available,
          DateOfStock: sku.dateOfStock,
        }))
      );
    } catch {
      res.status(500).json("Internal Server Error");
    }
  };

  newSKUItem = async (req, res) => {
    const sql =
      "INSERT INTO SKU_ITEM(RFID, available, skuID, dateOfStock) VALUES (?,?,?,?)";

    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({ error: "Empty Body request" });
    }
    let result = await this.dao.all("Select * from SKU where ID=?", [
      req.body.SKUId,
    ]);
    if (result.length === 0) {
      res.status(422).json("No SKU associated to SKUId");
    } else {
      try {
        if (
          (await this.dao.get(
            "Select * from SKU_ITEM where RFID=?",
            req.body.RFID
          )) === undefined
        ) {
          let data = req.body;
          this.dao.run(sql, [data.RFID, data.SKUId, 1, data.DateOfStock]);
          return res.status(201).json(data);
        } else {
          return res
            .status(404)
            .json({ message: "Item with RFID already existing" });
        }
      } catch {
        return res.status(503).json({ message: "Service Unavailable" });
      }
    }
  };

  getSKUItemsBySKUId = async (req, res) => {
    try {
      const sql =
        "SELECT RFID,skuID,dateOfStock FROM SKU_ITEM WHERE available=? and skuID=?";
      const result = await this.dao.all(sql, [1, req.params.id]);
      if (result.length === 0) {
        return res.status(404).json("no SKU associated to id");
      }
      return res.status(200).json(
        result.map((sku) => ({
          RFID: sku.RFID,
          SKUId: sku.skuID,
          DateOfStock: sku.dateOfStock,
        }))
      );
    } catch {
      res.status(500).json("Internal Server Error");
    }
  };
  getSKUItemsByRFID = async (req, res) => {
    try {
      const sql = "SELECT * FROM SKU_ITEM WHERE RFID=?";
      const result = await this.dao.all(sql, [req.params.rfid]);
      if (result.length === 0) {
        return res.status(404).json(result);
      } else {
        return res.status(200).json(
          result.map((sku) => ({
            RFID: sku.RFID,
            SKUId: sku.skuID,
            Available: sku.available,
            DateOfStock: sku.dateOfStock,
          }))
        );
      }
    } catch {
      res.status(500).json("Internal Server Error");
    }
  };

  editRFID = async (req, res) => {
    try {
      if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: "Empty Body request" });
      }
      const sql = await this.dao.all("Select * from SKU_ITEM where RFID=? ", [
        req.params.rfid,
      ]);
      if (sql.length === 0) {
        res.status(404).json("Item not found");
      } else {
        let data = req.body;
        // if (
        //   (await this.dao.get("Select * from SKUItems where rfid=?", [
        //     req.body.newRFID,
        //   ])) === undefined
        // ) {
        try {
          const sql =
            "UPDATE SKU_ITEM SET RFID =? , available=available+? , dateOfStock=? where RFID=?";
          let result = await this.dao.run(sql, [
            data.newRFID.length < 32 ? req.params.rfid : data.newRFID,
            data.newAvailable,
            data.newDateOfStock,
            req.params.rfid,
          ]);
          return res.status(200).json(result);
        } catch {
          return res.status(404).json("Item with new RFID already existing");
        }
      }
      //   else{return res.status(404).json("Item with RFID already")}
      // }
    } catch {
      res.status(503).json("Service Unavailable");
    }
  };
  deleteItem = async (req, res) => {
    try {
      const check = await this.dao.all("Select * from SKU_ITEM where RFID=? ", [
        req.params.rfid,
      ]);
      if (check.length === 0) {
        res.status(404).json("Item not found");
      } else {
        const sql = "DELETE FROM SKU_ITEM where RFID=?";
        await this.dao.run(sql, [req.params.rfid]);
        return res.status(204).json("Successful");
      }
    } catch {
      res.status(503).json("Service Unavailable");
    }
  };
}

module.exports = SKUItemsController;
