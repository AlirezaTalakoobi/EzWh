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
      let result = await this.dao.all(sql,[])
      result =result.map((Test) => ({
        id: Test.ID,
        name: Test.name,
        procedureDescription: Test.procedureDescription,
        idSKU: Test.skuID
  
      }
      ))
      //console.log(result);
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
    // console.log(param)
    // if (Object.keys(param).length === 0) {
      
    //   return { message: "validation of id failed" }//res.status(422).json({ error: "validation of id failed" });
    // }

   
    try {
      const sql =
        "SELECT ID,name,procedureDescription,skuID FROM TEST_DESCRIPTOR WHERE ID=?";
      //console.log(req.params.id);
      const result = await this.dao.get(sql, [param]);
       
      if (result === undefined) {

        return 1 //res.status(404).json("no SKU associated to id");
      }

      const ret= {

        id:result.ID,
        name:result.name,
        procedureDescription:result.procedureDescription,
        idSKU:result.skuID
      }
      console.log(result);
      return ret
      
      // result.map((Test) => ({
      //     Id: Test.ID,
      //     Name: Test.name,
      //     proceduredescription: Test.procedureDescription,
      //     idSKU: Test.skuID

      //   }))
        
      
    }
    
    catch {
      return 2   //res.status(500).json("generic error");
    }
  };

  newTestDescriptor = async(name,procedureDescription,idSKU) => {
    console.log(idSKU);
    const sql =
      "INSERT INTO TEST_DESCRIPTOR(name,procedureDescription,skuID) VALUES (?,?,?)";
    
const sql2= "select ID from SKU where ID=?"
const id=await this.dao.all(sql2,idSKU)
console.log(id);
if(id.length==0 ){
  return {message:"no sku associated idSKU"}
}else{

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
  }
  };
  

  editTDbyid = async (Body,ID) => {
    console.log(Body);

    const test=await this.dao.get('Select * from TEST_DESCRIPTOR where ID=?', [ID])
    // if (Object.keys(Body).length === 0) {
    //   return { error: "(validation of request body failed" }//res.status(422).json({ error: "(validation of request body failed" });
    // }
    
    if(test === undefined){
      
      return 2//res.status(404).json({error:"Test descriptor not existing"})
    }else{
      
      try {
        
        let data = Body;
        const sql = "update TEST_DESCRIPTOR set name=?, procedureDescription=?, skuID=? where ID=?";
        const r = await this.dao.get('Select * from SKU where ID=?', [data.newIdSKU])
        
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
    
    
    if(await this.dao.get('Select * from TEST_DESCRIPTOR where ID=?', [[ID]])!==undefined){
      try {
        const sql = "DELETE FROM TEST_DESCRIPTOR where ID=?";
        const sql2 = "UPDATE SQLITE_SEQUENCE SET seq = ? WHERE name = ?";
        let result = await this.dao.run(sql, [ID]);
        await this.dao.run(sql2, [0, "TEST_DESCRIPTOR"]);
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
