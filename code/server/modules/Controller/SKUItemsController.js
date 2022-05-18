"use strict";

class SKUItemsController {
  constructor(dao) {
    this.dao = dao;
  }

  getSKUItems = async (req, res) => {
    try {
      const sql = "SELECT * FROM SKUItems";
      let result = await this.dao.all(sql);
      return res.status(200).json(
        result.map((sku) => ({
          RFID: sku.rfid,
          SKUId: sku.SKUId,
          Available: sku.available,
          DateOfStock: sku.dateofstock,
        }))
      );
    } catch {
      res.status(500).json("Internal Server Error");
    }
  };

  newSKUItem = async (req, res) => {
    const sql =
      "INSERT INTO SKUItems(rfid, SKUId, available, dateofstock) VALUES (?,?,?,?)";
    //returns this.dao.run(sql)

    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({ error: "Empty Body request" });
    }
    let result = await this.dao.all("Select * from SKUItems where rfid=?", [
      req.body.rfid,
    ]);
    //return res.json(result.length);
    if (result.length !== 0) {
      res.status(422).json("Item with this RFID already existing");
    } else {
      try {
        let data = req.body;
        this.dao.run(sql, [data.rfid, data.SKUId, 1, data.DateOfStock]);
        return res.status(201).json(data);
      } catch {
        return res.status(503).json("service unavailable");
      }
    }
  };

  getSKUItemsBySKUId = async (req, res) => {
    try {
      const sql =
        "SELECT rfid,SKUId,dateofstock FROM SKUItems WHERE available=1 and SKUId=?";
      console.log(req.params.id);
      const result = await this.dao.all(sql, [req.params.id]);
      return res.status(200).json(
        result.map((sku) => ({
          RFID: sku.rfid,
          SKUId: sku.SKUId,
          DateOfStock: sku.dateofstock,
        }))
      );
    } catch {
      res.status(500).json("Internal Server Error");
    }
  };
  getSKUItemsByRFID = async (req, res) => {
    try {
      const sql = "SELECT * FROM SKUItems WHERE rfid=?";
      console.log(req.params.rfid);
      const result = await this.dao.all(sql, [req.params.rfid]);
      if (result.length === 0) {
        return res.status(404).json(result);
      } else {
        return res.status(200).json(
          result.map((sku) => ({
            RFID: sku.rfid,
            SKUId: sku.SKUId,
            Available: sku.available,
            DateOfStock: sku.dateofstock,
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
      const sql = await this.dao.all("Select * from SKUItems where rfid=? ", [
        req.params.rfid,
      ]);
      if (sql.length === 0) {
        res.status(404).json("Item not found");
      } else {
        let data = req.body;
        console.log(data);
        console.log(req.params.rfid);
        const sql =
          "UPDATE SKUItems SET rfid =? , available=? , dateofstock=? where rfid=?";
        let result = await this.dao.run(sql, [
          data.newRFID,
          data.newAvailable,
          data.newDateOfStock,
          req.params.rfid,
        ]);
        return res.status(200).json(result);
      }
    } catch {
      res.status(503).json("Service Unavailable");
    }
  };
  deleteItem = async (req, res) => {
    try {
      if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: "Empty Body request" });
      }
      const check = await this.dao.all("Select * from SKUItems where rfid=? ", [
        req.params.rfid,
      ]);
      if (check.length === 0) {
        res.status(404).json("Item not found");
      } else {
        const sql = "DELETE FROM SKUItems where rfid=?";
        let result = await this.dao.run(sql, [req.params.rfid]);
        return res.status(204).json("Successful");
      }
    } catch {
      res.status(503).json("Service Unavailable");
    }
  };
}

module.exports = SKUItemsController;
