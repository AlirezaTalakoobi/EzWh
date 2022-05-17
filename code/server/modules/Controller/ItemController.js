"use strict";

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
        res.status(500).json(err);
    }

};

getItemByID = async (req, res) => {
    const sql = 'select * from ITEM where ID=? ';
    
    const args = [req.params.id];
    try{
        const result = await this.dao.all(sql, args) ;
        res.json(
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
        res.status(500).json(err);
    }
};

createItem = async (req, res) => {
    const ApiInfo = req.body;
    const sql = `INSERT INTO ITEM (ID,description, price, SKUId, supplierId) VALUES(?,?,?,?,?) `;
    const args = [ApiInfo.id, ApiInfo.description, ApiInfo.price, ApiInfo.SKUId, ApiInfo.supplierId];
    try{
        let result = await this.dao.run(sql, args);
        res.sendStatus(201);

    }
    catch(err){
        res.status(500).json(err)
    }
};

modifyItem = async (req, res) => {
    const ApiInfo = req.body;
    const sql = "UPDATE ITEM SET description = ?, price = ? WHERE ID = ? ";
    const args = [ApiInfo.newDescription, ApiInfo.newPrice, req.params.id];
    try{
        let result = await this.dao.run(sql, args);
        res.sendStatus(200);

    }
    catch(err){
        res.status(500).json(err)
    }
};

deleteItem = async (req, res) => {
    const sql = "DELETE FROM ITEM WHERE ID = ? ";
    const args = [req.params.id];
    try{
        let result = await this.dao.run(sql, args);
        res.sendStatus(204);

    }
    catch(err){
        res.status(500).json(err)
    }
};

}

module.exports = ItemController;