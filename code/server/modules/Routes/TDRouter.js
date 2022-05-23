"use strict";

const express = require("express");
const router = express.Router();
const TDController = require("../Controller/TDController");
const DAO = require("../DB/DAO");
const dao = new DAO();
const td = new TDController(dao);
const { check, param, validationResult, Result} = require("express-validator");

router.get("/testdescriptors",
async (req, res) => {
  const Test = await td.TestDescriptor();
  //console.log(skus);
  if (Test === undefined) {
    return res.status(401).json({ message: "SKU does not exist" });

  } else if (Test.message) {
  
    return res.status(500).json(Test.message);
  } else {
    res.status(200).json(Test);
  }
}, td.TestDescriptor);
router.get("/testdescriptors/:id",[param("id").isNumeric().not().optional()],
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
  
  if (Test.message) {
    return res.status(422).json(Test.message);
  
    
  } else if (Test == 1) {
    
    res.status(404).json("no Test associated to id");
  }else if(Test == 2){
    res.status(500).json("generic error");
  }else if (Test){
    
    return res.status(200).json(Test);
  }
},td.getTestDescriptionById);
router.post("/testdescriptor",[
    check("name").isString().isLength({ min: 1, max: 32 }),
    check("procedureDescription").isString(),
    check("idSKU").isNumeric()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },async(req, res) => {
   
    const Test = await td.newTestDescriptor(req.body);
    
    if ( Test.message) {
      return res.status(422).json(Test.message);
      
    } else if(Test == 2 ){
      return res.status(503).json("generic error")
    }if(Test){
      
      return res.status(200).json({message: "Created"});
    }
  }, td.newTestDescriptor);
router.put("/testdescriptor/:id", [
    check("newName").isString().isLength({ min: 1, max: 32 }).optional(),
    check("newProcedureDescription").isString().optional(),
    check("newIdSKU").isNumeric().optional()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
    async(req, res) => {
    
    const Test = await td.editTDbyid(req.body,req.params.id);
    
    if ( Test.message ) {
      res.status(422).json(Test.message);
      
    } else if(Test == 2){
      return res.status(404).json({error:"Test descriptor not existing"})
    }else if(Test == 3){
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
  if (Test.message) {
    
    res.status(422).json(Test.message)
  }else if(Test == 2){
    res.status(503).json("Internal Server Error");

  }else {
    return res.status(200).json({message:"Seccess"})
  } 
},td.deleteTD);

module.exports = router;
