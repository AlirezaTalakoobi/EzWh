"use strict";

const { Result } = require("express-validator");

class SKUController {
  constructor(dao) {
    this.dao = dao;
  }

  getsku = async (req, res) => {
    try {
      const sql = "SELECT * FROM SKU";
      const result = await this.dao.all(sql);
      let skus = result.map((sku) => ({
        SKUId: sku.ID,
        description: sku.description,
        weight: sku.weight,
        volume: sku.volume,
        notes: sku.notes,
        availableQuantity: sku.availableQuantity,
        price: sku.price,
        positionID: sku.positionID,
        testDescriptors: [],
      }));

      for (let sku of skus) {
        //console.log("ciao")
        const testSql = "select ID from TEST_DESCRIPTOR WHERE skuID=?";
        const testDescriptors = await this.dao.all(testSql, [sku.SKUId]);

        sku.testDescriptors = testDescriptors.map((t) => t.ID);
      }
      return res.status(200).json(skus);
    } catch {
      res.status(500).json("Internal Server Error");
    }
  };

  getSKUbyId = async (req, res) => {
    try {
      const sql =
        "SELECT description,weight,volume,notes,availableQuantity,price,PositionID FROM SKU WHERE ID=?";
      const result = await this.dao.all(sql, [req.params.id]);
      if (result.length === 0) {
        return res.status(404).json("SKU not existing");
      }
      const testDescriptors = await this.dao.all(
        "select ID from TEST_DESCRIPTOR WHERE skuID=? ",
        [req.params.id]
      );

      let skus = result.map((item) => ({
        SKUId: item.ID,
        description: item.description,
        weight: item.weight,
        volume: item.volume,
        notes: item.notes,
        availableQuantity: item.availableQuantity,
        price: item.price,
        positionID: item.positionID,
        testDescriptors: [],
      }));

      for (let sku of skus) {
        sku.testDescriptors = testDescriptors.map((t) => t.ID);
      }
      return res.status(200).json(skus);
    } catch {
      res.status(500).json("Internal Server Error");
    }
  };

  newSKU = (req, res) => {
    const sql =
      "INSERT INTO SKU(description,weight,volume,notes,price,availableQuantity,price) VALUES (?,?,?,?,?,?,?)";
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({ error: "Empty Body request" });
    }
    // if (
    //   this.dao.get("Select * from SKU where positionID=?", [
    //     req.body.positionID,
    //   ]) !== undefined
    // ) {
    //   return res.status(404);
    // }
    let data = req.body;
    try {
      this.dao.run(sql, [
        data.description,
        data.weight,
        data.volume,
        data.notes,
        data.availableQuantity,
        data.price,
      ]);
      return res.status(201).json("CREATED");
    } catch {
      return res.status(503).json("Service Unavailable");
    }
    //}
  };
  editsku = async (req, res) => {
    try {
      let sku = await this.dao.get("Select * from SKU where ID=?", [
        req.params.id,
      ]);
      if (sku === undefined) {
        return res.status(404).json("SKU with this id not exists");
      } else {
        let data = req.body;
        const sql =
          "update SKU set description=?, weight=? , volume=?, notes=?, availableQuantity=? ,price=? where ID=?";
        await this.dao.run(sql, [
          data.newDescription.length < 1
            ? sku.description
            : data.newDescription,
          data.newWeight.length < 1 ? sku.weight : data.newWeight,
          data.newVolume.length < 1 ? sku.volume : data.newVolume,
          data.newNotes.length < 1 ? sku.notes : data.newNotes,
          data.newAvailableQuantity.length < 1
            ? sku.availableQuantity
            : data.newAvailableQuantity,
          data.newPrice.length < 1 ? sku.price : data.newPrice,
          req.params.id,
        ]);
        let position = await this.dao.get("Select * FROM POSITION where ID=?", [
          sku.positionID,
        ]);
        console.log(position);
        if (position === undefined) {
          return res.status(200).json("Position unavailable");
        } else {
          let new_sku = await this.dao.get("Select * from SKU where ID=?", [
            req.params.id,
          ]);
          if (
            position.maxVolume < new_sku.volume * new_sku.availableQuantity ||
            position.maxWeigth < new_sku.weight * new_sku.availableQuantity
          ) {
            await this.dao.run(
              "update SKU set description=?, weight=? , volume=?, notes=?, availableQuantity=? ,price=? where ID=?",
              [
                sku.description,
                sku.weight,
                sku.volume,
                sku.notes,
                sku.availableQuantity,
                sku.price,
                req.params.id,
              ]
            );
            return res.status(422).json("Not enough space");
          }
          await this.dao.run(
            "UPDATE POSITION SET occupiedWeight=?, occupiedVolume=? WHERE ID=?",
            [
              sku.weight * sku.availableQuantity,
              sku.volume * sku.availableQuantity,
              sku.positionID,
            ]
          );
        }
      }
    } catch {
      res.status(500).json("Internal Server Error");
    }
  };

  editskuPosition = async (req, res) => {
    try {
      let data = req.body;

      const sqlP = "select ID from POSITION where ID = ?";
      let resultp = await this.dao.get(sqlP, [req.body.position]);
      if (resultp === undefined) {
        return res.status(404).json({ message: "Position Not Found" });
      }
      const sqlS = "select * from SKU where ID=?";

      let resultS = await this.dao.get(sqlS, [req.params.id]);
      console.log(resultS);
      if (resultS.ID === undefined) {
        return res.status(404).json("Item not exists");
      }
      const sql = "update SKU set positionID=? where ID=?";
      const weight = await this.dao.get(
        "select weight*availableQuantity as W from SKU where ID=?",
        [req.params.id]
      );
      const volume = await this.dao.get(
        "select volume*availableQuantity as V from SKU where ID=?",
        [req.params.id]
      );

      await this.dao.run(sql, [data.position, req.params.id]);
      const old_position = await this.dao.get(
        "Select * from POSITION where ID=?",
        [resultS.positionID.toString()]
      );
      await this.dao.run(
        "UPDATE POSITION SET occupiedWeight=?, occupiedVolume=? WHERE ID=?",
        [0, 0, resultS.positionID.toString()]
      );
      const sqlposition =
        "update POSITION set occupiedWeight=?, occupiedVolume=? where ID=?";
      if (weight.W < resultp.maxWeigth && volume.V < resultp.maxVolume) {
        await this.dao.run(sqlposition, [weight.W, volume.V, data.positionID]);
        return res.status(200);
      } else {
        await this.dao.run(sqlposition, [
          old_position.weight,
          old_position.volume,
          resultS.positionID,
        ]);
      }
    } catch {
      res.status(500).json("Internal Server Error");
    }
  };

  deleteSKU = async (req, res) => {
    try {
      if (
        (await this.dao.get("Select * from SKU where ID=?", [
          req.params.id,
        ])) === undefined
      ) {
        return res.status(404).json("Already existing");
      } else {
        const sql = "DELETE FROM SKU where ID=?";
        let result = await this.dao.run(sql, [req.params.id]);
        return res.status(204).json(result);
      }
    } catch {
      res.status(500).json("Internal Server Error");
    }
  };
}

module.exports = SKUController;
