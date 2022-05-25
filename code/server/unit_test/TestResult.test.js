const TestResultController = require("../modules/Controller/TestResultController");
const TDController = require("../modules/Controller/TDController");
const SKUItemsController = require("../modules/Controller/SKUItemsController");
const SKUController = require("../modules/Controller/SKUController"); 
const DAO = require("../modules/DB/DAO");
const dao = new DAO();
const uc = new TestResultController(dao);
const uc_td = new TDController(dao);
const uc_skui = new SKUItemsController(dao);
const uc_sku = new SKUController(dao);





describe("getTestResultsByRFID", () => {
  beforeEach(async () => {
    await uc.deleteAll();
    await uc_td.deleteAll();
    await uc_skui.deleteAll();
    await uc_sku.deleteAll();
    
  });
  afterEach(async () => {
    await uc.deleteAll();
    await uc_td.deleteAll();
    await uc_skui.deleteAll();
    await uc_sku.deleteAll();
  });
  Test = {
            id:1,
            idTestDescriptor:12,
            Date:"2021/11/28",
            Result: true
  }
  testGetTestResultsByRFID(Test)
});

async function testGetTestResultsByRFID(Test) {
    test("getTestResultsByRFID", async () => {
      let passing_TD = null;
      let passing_sku = null;
      let passing_skui = null;

        await uc_sku.newSKU({
          description : "a new sku",
           weight : 100,
           volume : 50,
           notes : "first SKU",
           price : 10.99,
           availableQuantity : 50
        }); 
        sku = await uc_sku.getsku();
        passing_sku = sku[0]["SKUId"]
        await uc_skui.newSKUItem(
          "01234567890123456789012345678901",
          passing_sku,
          Test["Date"]
        );
        passing_skui = "01234567890123456789012345678901"
        await uc_td.newTestDescriptor(
          "ali",
          "desc",
          passing_sku
        ); 
        td = await uc_td.TestDescriptor();
        passing_TD = td['result'][0]["Id"]
        await uc.createTestResult(
          passing_skui,
          passing_TD,
          "2021/11/28",
          true
        );
        Test = {
          id:1,
          idTestDescriptor:passing_TD,
            Date:"2021/11/28",
            Result: true
      }

        let res = await uc.getTestResultsByRFID(passing_skui);
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
      await uc_td.deleteAll();
      await uc_skui.deleteAll();
      await uc_sku.deleteAll();
      
    });
    afterEach(async () => {
      await uc.deleteAll();
      await uc_td.deleteAll();
      await uc_skui.deleteAll();
      await uc_sku.deleteAll();
    });
    Test = {
              id:1,
              idTestDescriptor:12,
              Date:"2021/11/28",
              Result: true
    }
    testGetTestResultsForRFIDByID(Test)
  });

async function testGetTestResultsForRFIDByID(Test) {
    test("getTestResultsForRFIDByID", async () => {
      let passing_TD = null;
      let passing_sku = null;
      let passing_skui = null;

        await uc_sku.newSKU({
          description : "a new sku",
           weight : 100,
           volume : 50,
           notes : "first SKU",
           price : 10.99,
           availableQuantity : 50
        }); 
        sku = await uc_sku.getsku();
        passing_sku = sku[0]["SKUId"]
        await uc_skui.newSKUItem(
          "01234567890123456789012345678901",
          passing_sku,
          Test["Date"]
        );
        passing_skui = "01234567890123456789012345678901"
        await uc_td.newTestDescriptor(
          "ali",
          "desc",
          passing_sku
        ); 
        td = await uc_td.TestDescriptor();
        passing_TD = td['result'][0]["Id"]
        await uc.createTestResult(
          passing_skui,
          passing_TD,
          "2021/11/28",
          true
        );
        Test = {
          id:1,
          idTestDescriptor:passing_TD,
            Date:"2021/11/28",
            Result: true
      }

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
    await uc_td.deleteAll();
    await uc_skui.deleteAll();
    await uc_sku.deleteAll();
    
  });
  afterEach(async () => {
    await uc.deleteAll();
    await uc_td.deleteAll();
    await uc_skui.deleteAll();
    await uc_sku.deleteAll();
  });
  Test = {
            id:1,
            idTestDescriptor:12,
            Date:"2021/11/28",
            Result: true
  }
  testCreateTestResult(Test)
});

async function testCreateTestResult(Test) {


    test("createTestResult", async () => {
      let passing_TD = null;
      let passing_sku = null;
      let passing_skui = null;

        await uc_sku.newSKU({
          description : "a new sku",
           weight : 100,
           volume : 50,
           notes : "first SKU",
           price : 10.99,
           availableQuantity : 50
        }); 
        sku = await uc_sku.getsku();
        passing_sku = sku[0]["SKUId"]
        await uc_skui.newSKUItem(
          "01234567890123456789012345678901",
          passing_sku,
          Test["Date"]
        );
        passing_skui = "01234567890123456789012345678901"
        await uc_td.newTestDescriptor(
          "ali",
          "desc",
          passing_sku
        ); 
        td = await uc_td.TestDescriptor();
        passing_TD = td['result'][0]["Id"]
        await uc.createTestResult(
          passing_skui,
          passing_TD,
          "2021/11/28",
          true
        );
        Test = {
          id:1,
          idTestDescriptor:passing_TD,
            Date:"2021/11/28",
            Result: true
      }

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
    await uc_td.deleteAll();
    await uc_skui.deleteAll();
    await uc_sku.deleteAll();
    
  });
  afterEach(async () => {
    await uc.deleteAll();
    await uc_td.deleteAll();
    await uc_skui.deleteAll();
    await uc_sku.deleteAll();
  });
  Test = {
            id:1,
            idTestDescriptor:12,
            Date:"2021/11/28",
            Result: true
  }
  testModifyTestResult(Test)
});

async function testModifyTestResult(Test) {
    test("modifyTestResult", async () => {

      let passing_TD = null;
      let passing_sku = null;
      let passing_skui = null;

        await uc_sku.newSKU({
          description : "a new sku",
           weight : 100,
           volume : 50,
           notes : "first SKU",
           price : 10.99,
           availableQuantity : 50
        }); 
        sku = await uc_sku.getsku();
        passing_sku = sku[0]["SKUId"]
        await uc_skui.newSKUItem(
          "01234567890123456789012345678901",
          passing_sku,
          Test["Date"]
        );
        passing_skui = "01234567890123456789012345678901"
        await uc_td.newTestDescriptor(
          "ali",
          "desc",
          passing_sku
        ); 
        td = await uc_td.TestDescriptor();
        passing_TD = td['result'][0]["Id"]
        await uc.createTestResult(
          passing_skui,
          passing_TD,
          "2021/11/28",
          true
        );
        Test = {
          id:1,
          idTestDescriptor:passing_TD,
            Date:"2021/11/28",
            Result: true
      }

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
    await uc_td.deleteAll();
    await uc_skui.deleteAll();
    await uc_sku.deleteAll();
    
  });
  afterEach(async () => {
    await uc.deleteAll();
    await uc_td.deleteAll();
    await uc_skui.deleteAll();
    await uc_sku.deleteAll();
  });
  Test = {
            id:1,
            idTestDescriptor:12,
            Date:"2021/11/28",
            Result: true
  }
  testDeleteTestResult(Test)
});
  
  async function testDeleteTestResult(Test) {
    test("deleteItem", async () => {

      let passing_TD = null;
      let passing_sku = null;
      let passing_skui = null;

        await uc_sku.newSKU({
          description : "a new sku",
           weight : 100,
           volume : 50,
           notes : "first SKU",
           price : 10.99,
           availableQuantity : 50
        }); 
        sku = await uc_sku.getsku();
        passing_sku = sku[0]["SKUId"]
        await uc_skui.newSKUItem(
          "01234567890123456789012345678901",
          passing_sku,
          Test["Date"]
        );
        passing_skui = "01234567890123456789012345678901"
        await uc_td.newTestDescriptor(
          "ali",
          "desc",
          passing_sku
        ); 
        td = await uc_td.TestDescriptor();
        passing_TD = td['result'][0]["Id"]
        await uc.createTestResult(
          passing_skui,
          passing_TD,
          "2021/11/28",
          true
        );
        Test = {
          id:1,
          idTestDescriptor:passing_TD,
            Date:"2021/11/28",
            Result: true
      }
      
      let res = await uc.deleteTestResult(passing_skui,Test['id']);
      expect(res).toEqual(204);
    });
  }