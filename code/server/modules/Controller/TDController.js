"use strict"

const { body } = require("express-validator")

class TDController {
  constructor(dao) {
    this.dao = dao
  }

  TestDescriptor = async (req, res) => {
    // if (Object.keys = req.body) {

    // }
    try {
      const sql = "SELECT * FROM TEST_DESCRIPTOR"
      const result = await this.dao.all(sql)
      return res.status(200).json(result.map((Test) => ({
        Id: Test.ID,
        Name: Test.name,
        proceduredescription: Test.procedureDescription,
        idSKU: Test.skuID

      }
      )
      ));
    } catch {
      res.status(500).json("Internal server Error")
    }
  }

  getTestDescriptionById = async (req, res) => {
    if (Object.keys(req.params.id).length === 0) {
      return res.status(422).json({ error: "validation of id failed" });
    }


    try {
      const sql =
        "SELECT ID,name,procedureDescription,skuID FROM TEST_DESCRIPTOR WHERE ID=?";
      //console.log(req.params.id);
      const result = await this.dao.all(sql, [req.params.id]);
      
      if (result.length === 0) {
        return res.status(404).json("no SKU associated to id");
      }

      return res.status(200).json(
        result.map((Test) => ({
          Id: Test.ID,
          Name: Test.name,
          proceduredescription: Test.procedureDescription,
          idSKU: Test.skuID

        }))
      );
    } catch {
      res.status(500).json("generic error");
    }
  };

  newTestDescriptor = (req, res) => {
    console.log(req.body);
    const sql =
      "INSERT INTO TEST_DESCRIPTOR(name,procedureDescription,skuID) VALUES (?,?,?)";
    //returns this.dao.run(sql)

    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({ error: "(validation of request body failed" });
    }
    // const result = this.dao.get("Select * from SKUItems where rfid=?");
    // if (result.length != 0) {
    //   return res.status(422).json("Unprocessable Entity");
    // } else {
    let data = req.body;
    this.dao
      .run(sql, [data.name,data.procedureDescription,data.idSKU])
      .then(res.status(201).json("Success"))
      .catch(res.status(503).json("generic error"));
    //}
  };
  

  editTDbyid = async (req, res) => {
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({ error: "(validation of request body failed" });
    }
    if(await this.dao.get('Select * from TEST_DESCRIPTOR where ID=?', [req.params.id])===undefined){
      return res.status(404).json({error:"Test descriptor not existing"})
    }else{
      try {
        let data = req.body;
        const sql = "update TEST_DESCRIPTOR set name=?, procedureDescription=?, skuID=? where ID=?";
        if(await this.dao.get('Select * from SKU where ID=?', [[data.newIdSKU]])!==undefined){
          let result = await this.dao.run(sql, [data.newName,data.newProcedureDescription,data.newIdSKU, req.params.id]);
          return res.status(200).json(result);
        }
        else{
          return res.status(404).json({error:"SKU not exists"})
        }
      } catch {
        res.status(500).json("Internal Server Error");
      }
    }  
  };

  deleteTD = async (req, res) => {
    if (Object.keys(req.params).length === 0) {
      return res.status(422).json({ error: "(validation of id failed" });
    }
    if(await this.dao.get('Select * from TEST_DESCRIPTOR where ID=?', [[req.params.id]])!==undefined){
      try {
        const sql = "DELETE FROM TEST_DESCRIPTOR where ID=?";
        let result = await this.dao.run(sql, [req.params.id]);
        return res.status(204).end();
      } catch {
        res.status(503).json("Internal Server Error");
      }
    }
    else{
      return res.status(404).json("Test descriptor not existing")
    }
  };
}
module.exports = TDController
