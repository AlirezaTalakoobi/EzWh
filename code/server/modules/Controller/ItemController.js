"use strict";
const { body, param, validationResult } = require('express-validator');


class ItemController {
  constructor(dao) {
    this.dao = dao;
  }

getItems = async (req, res) => {
    const sql = 'select * from ITEM';
    
    
    try{
        const result = await this.dao.all(sql, []) ;
        res.status(200).json(
            result.map((rows)=>({
                id:rows.ID,
                description:rows.description,
                price:rows.price,
                SKUId:rows.SKUId,
                supplierId:rows.supplierId
            }))
        )
    }
    catch(err){
        res.status(500).send("500 Internal Server Error");
    }

};

getItemByID = async (req, res) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
    return res.status(422).send("422 Unprocessable Entity");
    }
    const sql = 'select * from ITEM where ID=? ';
    const args = [req.params.id];
    try{
        const result = await this.dao.all(sql, args) ;
        if (result.length===0){
            return res.status(404).send("404 NOT FOUND");
        }
        return res.status(200).json(
            result.map((rows)=>({
                id:rows.ID,
                description:rows.description,
                price:rows.price,
                SKUId:rows.SKUId,
                supplierId:rows.supplierId
            }))
        );
    }
    catch(err){
        return res.status(500).send("500 Internal Server Error");
    }
};

createItem = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send("422 Unprocessable Entity");
    }
    if (Object.keys(req.body).length === 0) {
        return res.status(422).send("422 Unprocessable Entity");
      }
    const ApiInfo = req.body;
    if (
        ApiInfo === undefined ||
        ApiInfo.id===undefined||
        ApiInfo.description === undefined ||
        ApiInfo.price === undefined ||
        ApiInfo.SKUId === undefined ||
        ApiInfo.supplierId === undefined||
        Number(ApiInfo.price)<=0
      ) {
        return res.status(422).send("422 Unprocessable Entity");
      }

    try{
        const sql_c_1 = 'SELECT * FROM USER WHERE ID = ? ';
        const args_c_1 = [req.body.supplierId];
        let check1 = await this.dao.all(sql_c_1,args_c_1);
        if (check1.length === 0) {
            console.log(1)
            return res.status(404).send("404 NOT FOUND");
        }
        const sql_c_2 = 'SELECT * FROM SKU WHERE ID= ? ';
        const args_c_2 = [req.body.SKUId];
        let check2 = await this.dao.all(sql_c_2,args_c_2);
        if (check2.length === 0) {
            console.log(2)
            return res.status(404).send("404 NOT FOUND");
        }

        const sql = `INSERT INTO ITEM (ID,description, price, skuId, supplierId) VALUES(?,?,?,?,?) `;
        const args = [ApiInfo.id, ApiInfo.description, ApiInfo.price, ApiInfo.SKUId, ApiInfo.supplierId];
        let result = await this.dao.run(sql, args);
        return res.status(201).send("201 Created");

    }
    catch(err){
        return res.status(503).send("503 Service Unavailable")
    }
};

modifyItem = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     return res.status(422).send("422 Unprocessable Entity");
    }
    if (Object.keys(req.body).length === 0) {
      return res.status(422).send("422 Unprocessable Entity");
    }
    const ApiInfo = req.body;
    if (
        ApiInfo === undefined ||
        ApiInfo.newDescription === undefined ||
        ApiInfo.newPrice === undefined ||
        Number(ApiInfo.newPrice)<=0
      ) {
        return res.status(422).send("422 Unprocessable Entity");
      }

    try{
        const sql_c_1 = 'SELECT * FROM ITEM WHERE ID= ?';
        const args_c_1 = [req.params.id];
        let check1 = await this.dao.all(sql_c_1,args_c_1);
        if (check1.length === 0) {
            return res.status(404).send("404 NOT FOUND");
        }

        const sql = "UPDATE ITEM SET description = ?, price = ? WHERE ID = ? ";
        const args = [ApiInfo.newDescription, ApiInfo.newPrice, req.params.id];
        let result = await this.dao.run(sql, args);
        return res.status(201).send("200 OK");

    }
    catch(err){
        return res.status(503).send("503 Service Unavailable")
    }
};

deleteItem = async (req, res) => {
    const errors=validationResult(req);
      if(!errors.isEmpty()){
        return res.status(422).send("422 Unprocessable Entity");
      }
    const sql = "DELETE FROM ITEM WHERE ID = ? ";
    const args = [req.params.id];
    try{
        let result = await this.dao.run(sql, args);
        return res.sendStatus(204).send("204 No Content");

    }
    catch(err){
        return res.status(503).send("503 Service Unavailables")
    }
};

}

module.exports = ItemController;