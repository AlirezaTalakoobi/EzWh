"use strict"

const { promise, reject } = require("bcrypt/promises")
const { body } = require("express-validator")

class TDController {
  constructor(dao) {
    this.dao = dao
  }

  TestDescriptor = async () => {
    // if (Object.keys = req.body) {

    // }
    try {
      const sql = "SELECT * FROM TEST_DESCRIPTOR"
      const result = await this.dao.all(sql,[])
      result =result.map((Test) => ({
        Id: Test.ID,
        Name: Test.name,
        proceduredescription: Test.procedureDescription,
        idSKU: Test.skuID
  
      }
      ))
      let ret = {
        ans : 200,
        result : result
      }
      return ret;
     }
     catch(error){
       let ret = {
         ans : 500,
         result : {}
       }
      return ret;
     }
    }
  
      
    
  //}
  
  getTestDescriptionById = async (param) => {
    
    if (Object.keys(param).length === 0) {
      console.log(param)
      return { error: "validation of id failed" }//res.status(422).json({ error: "validation of id failed" });
    }


    try {
      const sql =
        "SELECT ID,name,procedureDescription,skuID FROM TEST_DESCRIPTOR WHERE ID=?";
      //console.log(req.params.id);
      const result = await this.dao.all(sql, [param]);
      
      if (result.length === 0) {
        return 1 //res.status(404).json("no SKU associated to id");
      }

      return result.map((Test) => ({
          Id: Test.ID,
          Name: Test.name,
          proceduredescription: Test.procedureDescription,
          idSKU: Test.skuID

        }))
      
    }
    
    catch {
      return 2   //res.status(500).json("generic error");
    }
  };

  newTestDescriptor = (name,procedureDescription,idSKU) => {
    //console.log(req.body);
    const sql =
      "INSERT INTO TEST_DESCRIPTOR(name,procedureDescription,skuID) VALUES (?,?,?)";
    //returns this.dao.run(sql)


    // const result = this.dao.get("Select * from SKUItems where rfid=?");
    // if (result.length != 0) {
    //   return res.status(422).json("Unprocessable Entity");
    // } else {
    //let data = Body;
    try {
      let result = this.dao.run(sql, [name,procedureDescription,idSKU])
      return result
      
    } catch(err) {
      //console.log(err)
      return 2
    } 
      // .then(res.status(201).json("Success"))
      // .catch(res.status(503).json("generic error"));
    //}
   
  };
  

  editTDbyid = async (Body,ID) => {
    
    if (Object.keys(Body).length === 0) {
      return { error: "(validation of request body failed" }//res.status(422).json({ error: "(validation of request body failed" });
    }
    
    if(await this.dao.get('Select * from TEST_DESCRIPTOR where ID=?', [ID])===undefined){
      
      return 2//res.status(404).json({error:"Test descriptor not existing"})
    }else{
      
      try {
        
        let data = Body;
        const sql = "update TEST_DESCRIPTOR set name=?, procedureDescription=?, skuID=? where ID=?";
        const r = await this.dao.get('Select * from SKU where ID=?', [[data.newIdSKU]])
        console.log(r);
        if(r!==undefined){
          
         let result = await this.dao.run(sql, [data.newName,data.newProcedureDescription,data.newIdSKU, ID]);
         

        return result// res.status(200).json(result);
        }
        else{
          return 2//res.status(404).json({error:"SKU not exists"})
        }
      } catch {
        return 3  //res.status(500).json("Internal Server Error");
      }
     
  };
}

  deleteTD = async (ID) => {
    if (Object.keys(ID).length === 0) {
      return 1//res.status(422).json({ error: "(validation of id failed" });
    }
    if(await this.dao.get('Select * from TEST_DESCRIPTOR where ID=?', [[ID]])!==undefined){
      try {
        const sql = "DELETE FROM TEST_DESCRIPTOR where ID=?";
        let result = await this.dao.run(sql, [ID]);
        return result//res.status(204).end();
      } catch {
        return 2//res.status(503).json("Internal Server Error");
      }
    }
    else{
      return { message: "Test descriptor not existing" }// res.status(404).json("Test descriptor not existing")
    }
  };

  
  deleteAll = async () => {
    
    const sql = "DELETE FROM TEST_DESCRIPTOR ";
    try{
        let result = await this.dao.run(sql, []);
        return true;
    }
    catch(err){
      return false;
    }
  };
}
module.exports = TDController
