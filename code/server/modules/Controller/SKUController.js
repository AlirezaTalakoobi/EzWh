"use strict";

const { Result } = require("express-validator");

class SKUController {
  constructor(dao) {
    this.dao = dao;
  }

  getsku = async () => {
    try {
      const sql = "SELECT * FROM SKU";
      const result = await this.dao.all(sql);
      let skus = result.map((sku) => ({
        id: sku.ID,
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
        const testSql = "select ID from TEST_DESCRIPTOR WHERE skuID=?";
        const testDescriptors = await this.dao.all(testSql, [sku.SKUId]);

        sku.testDescriptors = testDescriptors.map((t) => t.ID);
      }
      return skus;
    } catch {
      return { message: "Internal error" };
    }
  };

  getSKUbyId = async (ID) => {
    try {
      const sql =
        "SELECT description,weight,volume,notes,availableQuantity,price,PositionID FROM SKU WHERE ID=?";
      const result = await this.dao.all(sql, [ID]);
      if (result.length === 0) {
        return false;
      }
      const testDescriptors = await this.dao.all(
        "select ID from TEST_DESCRIPTOR WHERE skuID=? ",
        [ID]
      );

      let skus = result.map((item) => ({
        id: item.ID,
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
      return skus;
    } catch {
      //res.status(500).json("Internal Server Error");
      false;
    }
  };

  newSKU = async (Body) => {
    const sql =
      "INSERT INTO SKU(description,weight,volume,notes,availableQuantity,price) VALUES (?,?,?,?,?,?)";
    // if (Object.keys(Body).length === 0) {
    //   return 1 ;
    // }
    // if (
    //   this.dao.get("Select * from SKU where positionID=?", [
    //     req.body.positionID,
    //   ]) !== undefined
    // ) {
    //   return res.status(404);
    // }
    let data = Body;
    try {
      let result = this.dao.run(sql, [
        data.description,
        data.weight,
        data.volume,
        data.notes,
        data.availableQuantity,
        data.price,
      ]);
      return result;
    } catch {
      return { message: "Service Unavailable" }; //res.status(503).json("Service Unavailable");
    }
    //}
  };
  editsku = async (Body, ID) => {
    try {
      let sku = await this.dao.get("Select * from SKU where ID=?", [ID]);
      if (sku === undefined) {
        return { message: "SKU with this id not exists" }; //res.status(404).json("SKU with this id not exists");
      } else {
        let data = Body;
        const sql =
          "update SKU set description=?, weight=? , volume=?, notes=?, availableQuantity=? ,price=? where ID=?";
        let skuupdate = await this.dao.run(sql, [
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
          ID,
        ]);
        let position = await this.dao.get("Select * FROM POSITION where ID=?", [
          sku.positionID,
        ]);

        if (position === undefined) {
          return skuupdate; //res.status(200).json("Position unavailable");
        } else {
          let new_sku = await this.dao.get("Select * from SKU where ID=?", [
            ID,
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
                ID,
              ]
            );
            return 2; //res.status(422).json("Not enough space");
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
      return 3; //res.status(500).json("Internal Server Error");
    }
  };

  editskuPosition = async (position, ID) => {
    try {
      
      const sqlP = "select ID from POSITION where ID = ?";
      let resultp = await this.dao.get(sqlP, [position]);
      if (resultp === undefined) {
        return { message: "Position Not Found" };
      }
      const sqlS = "select * from SKU where ID=?";

      let resultS = await this.dao.get(sqlS, [ID]);

      if (resultS.ID === undefined) {
        return { message: "SKU Not Found" };
      }
      const sql = "update SKU set positionID=? where ID=?";
      const weight = await this.dao.get(
        "select weight*availableQuantity as W from SKU where ID=?",
        [ID]
      );
      const volume = await this.dao.get(
        "select volume*availableQuantity as V from SKU where ID=?",
        [ID]
      );

      await this.dao.run(sql, [position, ID]);
      const old_position = await this.dao.get(
        "Select * from POSITION where ID=?",
        [resultS.positionID.toString()]
      );
      await this.dao.run(
        "UPDATE POSITION SET occupiedWeight=?, occupiedVolume=? WHERE ID=?",
        [0, 0, resultS.positionID.toString()]
      );
      console.log(resultS.positionID + ": " + position)
      const sqlposition =
        "update POSITION set occupiedWeight=?, occupiedVolume=? where ID=?";
      if (weight.W < resultp.maxWeigth && volume.V < resultp.maxVolume) {
        let Pupdate = await this.dao.run(sqlposition, [
          weight.W,
          volume.V,
          position,
        ]);
        return Pupdate; //res.status(200);
      } else {
        let oldposition = await this.dao.run(sqlposition, [
          old_position.weight,
          old_position.volume,
          resultS.positionID.toString(),
        ]);
        return 2;
      }
    } catch {
      return 3; //res.status(500).json("Internal Server Error");
    }
  };

  deleteSKU = async (param) => {
    try {
      if (
        (await this.dao.get("Select * from SKU where ID=?", [param])) ===
        undefined
      ) {
        return { message: "No SKU associated to id" }; //res.status(404).json("validation of id failed");
      } else {
        const sql = "DELETE FROM SKU where ID=?";
        const sql2 = "UPDATE SQLITE_SEQUENCE SET seq = ? WHERE name = ?";
        let result = await this.dao.run(sql, [param]);
        await this.dao.run(sql2, [0, "SKU"]);
        return result; //res.status(204).json(result);
      }
    } catch {
      return 1; //res.status(500).json("Internal Server Error");
    }
  };

  deleteAllSKU = async () => {
    try {
        const sql = "DELETE FROM SKU";
        let result = await this.dao.run(sql, []);
        return result; //res.status(204).json(result);
    } catch {
      return 1; //res.status(500).json("Internal Server Error");
    }
  }
  
  deleteAll = async () => {
    
    const sql = "DELETE FROM SKU";
    try{
        let result = await this.dao.run(sql, []);
        return true;
    }
    catch(err){
      return false;
    }
  };
}

module.exports = SKUController;
