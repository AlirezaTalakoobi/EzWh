"use strict";

class SKUItemsController {
  constructor(dao) {
    this.dao = dao;
  }

  getSKUItems = async (req, res) => {
    if (Object.keys(req.body)) {
    }
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

  newSKUItem = (req, res) => {
    console.log(req);
    const sql =
      "INSERT INTO SKUItems(rfid, SKUId, available, dateofstock) VALUES (?,?,?,?)";
    //returns this.dao.run(sql)

    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({ error: "Empty Body request" });
    }
    // const result = this.dao.get("Select * from SKUItems where rfid=?");
    // if (result.length != 0) {
    //   return res.status(422).json("Unprocessable Entity");
    // } else {
    let data = req.body;
    this.dao
      .run(sql, [data.rfid, data.SKUId, 1, data.DateOfStock])
      .then(res.status(201).json("CREATED"))
      .catch(res.status(503).json("Service Unavailable"));
    //}
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
}

module.exports = SKUItemsController;
