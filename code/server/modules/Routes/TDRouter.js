"use strict";

const express = require("express");
const router = express.Router();
const TDController = require("../Controller/TDController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const td = new TDController(dao);
const { check, param, validationResult, Result} = require("express-validator");

router.get("/testdescriptors",
async (req,res) => {
  const result = await td.TestDescriptor(); 
  if(result["ans"] == 200){
      return res.status(200).json(result["result"]);
  }
  else{
      return res.status(500).send("500 Internal Server Error");
  }
}, td.TestDescriptor);
router.get("/testdescriptors/:id",[param("id").isInt({min:1}).not().isEmpty()],
(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}, 
  async (req, res) => {
  const params =req.params.id
 
  const Test = await td.getTestDescriptionById(params);
  console.log(Test);
  // if (Object.keys(params).length === 0) {
  //   return res.status(422).json ("(validation of request body failed")  //res.status(422).json({ error: "(validation of request body failed" });
  // }
  
    
   if (Test === 1) {
    
    res.status(404).json("no Test associated to id");
  }else if(Test === 2){
    res.status(500).json("generic error");
  }else if (Test){
    
    return res.status(200).json(Test);
  }
},td.getTestDescriptionById);
router.post("/testdescriptor",[
    check("name").isString().isLength({ min: 1 }),
    check("procedureDescription").isString({ min: 1}),
    check("idSKU").isInt({min:0}).not().isEmpty()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },async(req, res) => {
    let  data = req.body;
    const Test = await td.newTestDescriptor(data.name,data.procedureDescription,data.idSKU);
    // if (Object.keys(data).length === 0) {
    //   return res.status(422).json ("(validation of request body failed")  //res.status(422).json({ error: "(validation of request body failed" });
    // }
    if ( Test.message) {
      return res.status(404).json(Test.message);
      
    } else if(Test == 2 ){
      return res.status(503).json("generic error")
    }if(Test){
      
      return res.status(201).json({message: "Created"});
    }
  }, td.newTestDescriptor);
router.put("/testdescriptor/:id", [
    
    check("newName").isString().isLength({ min: 1}).optional(),
    check("newProcedureDescription").isString().optional(),
    check("newIdSKU").isNumeric().optional()
  ],
  (req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty() || Object.keys(req.body).length === 0) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
    async(req, res) => {
    
    const Test = await td.editTDbyid(req.body,req.params.id);
    
    if ( Test.message ) {
      res.status(422).json(Test.message);
      
    } else if(Test === 2){
      return res.status(404).json({error:"Test descriptor or SKU not existing"})
    }else if(Test === 3){
      return res.status(500).json({message: "Internal Server Error"});
    }else {
      
      return res.status(200).json({message: "Success"});
    }
  },td.editTDbyid);
router.delete("/testdescriptor/:id",  [param("id").isNumeric().not().optional()],
(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
},async (req, res) => {
  const params =req.params.id
 
  const Test = await td.deleteTD(params);
  if(Test !== undefined) {
    return res.status(204).json({message:"Seccess"})
  } 
  // else if (Object.keys(params).length === 0) {
    
  //   return res.status(422).json({ error: "(validation of id failed" });  
  // }
  else if(Test == 2){
    res.status(503).json("Internal Server Error");

  }
},td.deleteTD);

router.delete("/deleteAllTD", async (req, res) => {
  const result = await td.deleteAll();
  var httpStatusCode = 204;
  if (!result) {
    httpStatusCode = 500;
  }
  res.status(httpStatusCode).end();
});

module.exports = router;
