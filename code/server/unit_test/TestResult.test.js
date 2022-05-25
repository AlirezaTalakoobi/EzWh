const TestResultController = require("../modules/Controller/TestResultController");
const TDController = require("../modules/Controller/TDController");
const SKUItemsController = require("../modules/Controller/SKUItemsController");
const DAO = require("../modules/DB/DAO");
const dao = new DAO();
const uc = new TestResultController(dao);
const uc_td = new TDController(dao);
const uc_sku_item = new SKUItemsController(dao);


describe("getTestResultsByRFID", () => {
    beforeEach(async () => {
      await uc.deleteAll();
    //   await uc_td.deleteAll();
    //   await uc_sku_item.deleteAll();
    //   await uc_td.create();
    //   await uc_sku_item.create(); 
      await uc.createTestResult(
        "01234567890123456789012345678901",
        12,
        "2021/11/28",
        true
      );
    });
    afterEach(async () => {
        await uc.deleteAll();
        //   await uc_td.deleteAll();
        //   await uc_sku_item.deleteAll();
    });
    testGetTestResultsByRFID(
        {
            id:1,
            idTestDescriptor:12,
            Date:"2021/11/28",
            Result: true


        });
    });

async function testGetTestResultsByRFID(Test) {
    test("getTestResultsByRFID", async () => {
        let res = await uc.getTestResultsByRFID("01234567890123456789012345678901");
        expect(Test).toEqual({
            id: res["result"][0].id,
            idTestDescriptor : res["result"][0].idTestDescriptor,
            Date : res["result"][0].Date,
            Result : res["result"][0].Result,
    });
    });
}

describe("getTestResultsForRFIDByID", () => {
    beforeEach(async () => {
      await uc.deleteAll();
    //   await uc_td.deleteAll();
    //   await uc_sku_item.deleteAll();
    //   await uc_td.create();
    //   await uc_sku_item.create(); 
      await uc.createTestResult(
        "01234567890123456789012345678901",
        12,
        "2021/11/28",
        true
      );
    });
    afterEach(async () => {
        await uc.deleteAll();
        //   await uc_td.deleteAll();
        //   await uc_sku_item.deleteAll();
    });
    testGetTestResultsForRFIDByID(
        {
            id:1,
            idTestDescriptor:12,
            Date:"2021/11/28",
            Result: true


        });
    });

async function testGetTestResultsForRFIDByID(Test) {
    test("getTestResultsForRFIDByID", async () => {
        let res = await uc.getTestResultsForRFIDByID("01234567890123456789012345678901",1);
        expect(Test).toEqual({
            id: res["result"][0].id,
            idTestDescriptor : res["result"][0].idTestDescriptor,
            Date : res["result"][0].Date,
            Result : res["result"][0].Result,
    });
    });
}


describe("createTestResult", () => {
    beforeEach(async () => {
        await uc.deleteAll();
      //   await uc_td.deleteAll();
      //   await uc_sku_item.deleteAll();
      //   await uc_td.create();
      //   await uc_sku_item.create(); 
      });
      afterEach(async () => {
          await uc.deleteAll();
          //   await uc_td.deleteAll();
          //   await uc_sku_item.deleteAll();
      });
      testCreateTestResult(
          {
              id:1,
              idTestDescriptor:12,
              Date:"2021/11/28",
              Result: true
  
  
          });
      });

async function testCreateTestResult(Test) {
    test("createTestResult", async () => {
        let res = await uc.createTestResult(
            "01234567890123456789012345678901",Test["idTestDescriptor"],Test["Date"],Test["Result"]);
        res = await uc.getTestResultsByRFID("01234567890123456789012345678901");
        expect(Test).toEqual({

            id: res["result"][0].id,
            idTestDescriptor : res["result"][0].idTestDescriptor,
            Date : res["result"][0].Date,
            Result : res["result"][0].Result,
    });
    });
}

describe("modifyTestResult", () => {
    beforeEach(async () => {
        await uc.deleteAll();
      //   await uc_td.deleteAll();
      //   await uc_sku_item.deleteAll();
      //   await uc_td.create();
      //   await uc_sku_item.create(); 
        await uc.createTestResult(
          "01234567890123456789012345678901",
          12,
          "2021/11/28",
          true
        );
      });
      afterEach(async () => {
          await uc.deleteAll();
          //   await uc_td.deleteAll();
          //   await uc_sku_item.deleteAll();
      });
      testModifyTestResult(
          {
              id:1,
              idTestDescriptor:5,
              Date:"2019/11/28",
              Result: false
  
  
          });
      });

async function testModifyTestResult(Test) {
    test("modifyTestResult", async () => {
        let res = await uc.modifyTestResult(
            Test["idTestDescriptor"],Test["Date"],Test["Result"],"01234567890123456789012345678901",1);
            res = await uc.getTestResultsByRFID("01234567890123456789012345678901");
            expect(Test).toEqual({

                id: res["result"][0].id,
                idTestDescriptor : res["result"][0].idTestDescriptor,
                Date : res["result"][0].Date,
                Result : res["result"][0].Result,
    });
    });
}

describe("deleteTestResult", () => {
    beforeEach(async () => {
      await uc.deleteAll();
      await uc.createTestResult(
        "01234567890123456789012345678901",
          12,
          "2021/11/28",
          true
  );
    });
    testDeleteTestResult({id:12,rfid:"01234567890123456789012345678901"});
    afterEach(async () => {
      await uc.deleteAll();
    });
  });
  
  async function testDeleteTestResult(Test) {
    test("deleteItem", async () => {
      let res = await uc.deleteTestResult(Test['rfid'],Test['id']);
      expect(res).toEqual(204);
    });
  }