"use strict";
const { body, param, validationResult } = require('express-validator');


class TestResultController {
  constructor(dao) {
    this.dao = dao;
  }

  getTestResultsByRFID = async (rfid) => {
    
    
    try{
        const sql_c_1 = 'SELECT RFID FROM SKU_ITEM WHERE RFID=? ';
        const args_c_1 = [rfid];
        let check1 = await this.dao.all(sql_c_1,args_c_1);
        if (check1.length === 0) {
            let ret = {
                ans : 404,
                result : {}
              }        
              return ret
            }
        const sql = 'select * from TEST_RESULT where RFID=?';
        const args = [rfid];
        let result = await this.dao.all(sql, args);
        result = result.map((rows)=>({
            id:rows.ID,
            idTestDescriptor:rows.testDescriptorID,
            Date:rows.date,
            Result:(rows.result === 1) ? true : false
        }));
        let ret = {
            ans : 200,
            result : result
            }
        return ret

    }
    catch(err){
        let ret = {
            ans : 500,
            result : {}
          };
          return ret;
    }
  
   

};

getTestResultsForRFIDByID = async (rfid,id) => {
    
    try{
        const sql = 'select * from TEST_RESULT where RFID=? and ID=?';
        const args = [rfid,id];
        let result = await this.dao.all(sql, args) ;
        if (result.length === 0) {
            let ret = {
                ans : 404,
                result : {}
              }
            return ret;
        }
            result = result.map((rows)=>({
                id:rows.ID,
                idTestDescriptor:rows.testDescriptorID,
                Date:rows.date,
                Result:(rows.result === 1) ? true : false
            }));
            let ret = {
                ans : 200,
                result : result
              }
            return ret


    }
    catch(err){
        let ret = {
            ans : 500,
            result : {}
          };
          return ret;
    }
};

createTestResult = async (rfid, idTestDescriptor, date, Result) => {
    
    try{
        const sql_c_1 = 'SELECT ID FROM TEST_DESCRIPTOR WHERE ID=? ';
        const args_c_1 = [idTestDescriptor];
        let check1 = await this.dao.all(sql_c_1,args_c_1);
        if (check1.length === 0) {
            return 404;
        }
        const sql_c_2 = 'SELECT RFID FROM SKU_ITEM WHERE RFID=? ';
        const args_c_2 = [rfid];
        let check2 = await this.dao.all(sql_c_2,args_c_2);
        if (check2.length === 0) {
            return 404;
        }
        const sql = `INSERT INTO TEST_RESULT (RFID,testDescriptorID, date, result, ID) VALUES(?,?,?,?,?) `;
        let ids = await this.dao.all("select ID FROM TEST_RESULT", []);
        let id = 1;
        if(ids.length != 0){
            let ids_arr = [];
            for(let i=0;i<ids.length;i++){
                ids_arr.push(ids[i]["ID"]);
            }
            id = ids_arr.reduce((previousValue, currentValue) => (previousValue >= currentValue) ? previousValue : currentValue)+1;
        }
        const args = [rfid, idTestDescriptor, date, Result, id];
        let result = await this.dao.run(sql, args);
        if (result.length === 0) {
            return 404;
          }
        return 201

    }
    catch(err){
        return 503;
    }
};

modifyTestResult = async (newIdTestDescriptor, newDate, newResult,rfid, id) => {
    try{
        const sql_c_1 = 'SELECT ID FROM TEST_DESCRIPTOR WHERE ID=? ';
        const args_c_1 = [newIdTestDescriptor];
        let check1 = await this.dao.all(sql_c_1,args_c_1);
        if (check1.length === 0) {
            return 404;
        }
        const sql_c_2 = 'SELECT RFID FROM SKU_ITEM WHERE RFID=? ';
        const args_c_2 = [rfid];
        let check2 = await this.dao.all(sql_c_2,args_c_2);
        if (check2.length === 0) {

            return 404;
        }
        const sql_c_3 = 'SELECT ID FROM TEST_RESULT WHERE ID=? ';
        const args_c_3 = [id];
        let check3 = await this.dao.all(sql_c_3,args_c_3);
        if (check3.length === 0) {
            return 404;
        }
        const sql = "UPDATE TEST_RESULT SET testDescriptorID = ?, date = ?, result = ?  WHERE RFID = ? and ID = ?";
        const args = [newIdTestDescriptor, newDate, newResult,rfid, id];
        let result = await this.dao.run(sql, args);
        return 200;

    }
    catch(err){
        return 503;
    }

};

deleteTestResult = async (rfid,id) => {
    try{
        const sql = "DELETE FROM TEST_RESULT WHERE RFID = ? and ID = ?";
        const args = [rfid, id];
        let result = await this.dao.run(sql, args);
        return 204;
    }
    catch(err){
        return 503;
    }
};

deleteAll = async () => {
    
    const sql = "DELETE FROM TEST_RESULT";
    try{
        let result = await this.dao.run(sql, []);
        return true;
    }
    catch(err){
      return false;
    }
  };
}


module.exports = TestResultController;