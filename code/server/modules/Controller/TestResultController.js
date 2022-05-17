"use strict";


class TestResultController {
  constructor(dao) {
    this.dao = dao;
  }

  getTestResultsByRFID = async (req, res) => {
    const sql = 'select * from TEST_RESULT where RFID=?';
    
    const args = [req.params.rfid];
    try{
        const result = await this.dao.all(sql, args) ;
        res.json(
            result.map((rows)=>({
                id:rows.ID,
                idTestDescriptor:rows.idTestDescriptor,
                Date:rows.Date,
                Result:rows.result
            }))
        )
    }
    catch(err){
        res.status(500).json(err);
    }
  
   

};

getTestResultsForRFIDByID = async (req, res) => {
    const sql = 'select * from TEST_RESULT where RFID=? and idTestDescriptor=?';
    
    const args = [req.params.rfid, req.params.id];
    try{
        const result = await this.dao.all(sql, args) ;
        res.json(
            result.map((rows)=>({
                id:rows.ID,
                idTestDescriptor:rows.idTestDescriptor,
                Date:rows.Date,
                Result:rows.result
            }))
        )
    }
    catch(err){
        res.status(500).json(err);
    }
};

createTestResult = async (req, res) => {
    
    const ApiInfo = req.body;
    const sql = `INSERT INTO TEST_RESULT (RFID,idTestDescriptor, date, result) VALUES(?,?,?,?) `;
    const args = [ApiInfo.rfid, ApiInfo.idTestDescriptor, ApiInfo.Date, (ApiInfo.Result === true) ? 1 : 0];
    try{
        let result = await this.dao.run(sql, args);
        res.sendStatus(201);

    }
    catch(err){
        res.status(500).json(err)
    }
};

modifyTestResult = async (req, res) => {
    const ApiInfo = req.body;
    const sql = "UPDATE TEST_RESULT SET idTestDescriptor = ?, date = ?, result = ?  WHERE RFID = ? and idTestDescriptor = ?";
    const args = [ApiInfo.newIdTestDescriptor, ApiInfo.newDate, (ApiInfo.newResult === true) ? 1 : 0, req.params.rfid, req.params.id];
    try{
        let result = await this.dao.run(sql, args);
        res.sendStatus(200);

    }
    catch(err){
        res.status(500).json(err)
    }

};

deleteTestResult = async (req, res) => {
    const sql = "DELETE FROM TEST_RESULT WHERE RFID = ? and idTestDescriptor = ?";
    const args = [req.params.rfid, req.params.id];
    try{
        let result = await this.dao.run(sql, args);
        res.sendStatus(204);

    }
    catch(err){
        res.status(500).json(err)
    }
};


}

module.exports = TestResultController;