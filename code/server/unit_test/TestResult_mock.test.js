const TESTR = require("../modules/Controller/TestResultController");
const dao = require("../modules/DB/mockdao");
const testr = new TESTR(dao);

describe("get Test Results By RFID", () => {
    const Test = {
      RFID:"12345678901234567890123456789016",
      ID:1,
      testDescriptorID:14,
      date:"2021/11/29",
      result: false
    }
  beforeEach(() => {
    dao.all.mockReset();
    dao.all.mockReturnValueOnce([Test]);
  });

  test("get Test Results By RFID", async () => {
    let res = await testr.getTestResultsByRFID("12345678901234567890123456789016");
    expect(res["result"]).toEqual([
      {
        id:1,
        idTestDescriptor:14,
        Date:"2021/11/29",
        Result: false
      },
    ]);
  });
});

describe("get Test Results For RFID By ID", () => {
  const Test = {
    RFID:"12345678901234567890123456789016",
    ID:1,
    testDescriptorID:14,
    date:"2021/11/29",
    result: false
  }
beforeEach(() => {
  dao.all.mockReset();
  dao.all.mockReturnValueOnce([Test]);
});

  test("get Test Results For RFID By ID", async () => {
    let res = await testr.getTestResultsForRFIDByID("12345678901234567890123456789016",Test.ID);
    console.log(res)
    expect(res["result"]).toEqual([
      {
        id:1,
        idTestDescriptor:14,
        Date:"2021/11/29",
        Result: false
      },
    ]);
  });
});

describe("create Test Result", () => {
  const Test = {
    RFID:"12345678901234567890123456789016",
    ID:1,
    testDescriptorID:14,
    date:"2021/11/29",
    result: false
  }
  beforeEach(() => {
    dao.run.mockReset();
    dao.get.mockReset();
    dao.all.mockReset();
    dao.run.mockReturnValueOnce([Test]);
    dao.all.mockReturnValueOnce(["1"]);
    dao.all.mockReturnValueOnce(["2"]);
    dao.all.mockReturnValueOnce(["3"]);
  });


test("create Test Result", async () => {
  let res = await testr.createTestResult(
        Test.RFID,Test.testDescriptorID,Test.date,Test.result);
    console.log(res)
   // res = await itemt.getItems();
    expect(res).toEqual(201);
});
})



describe("modify Test Result", () => {
  const Test = {
    RFID:"12345678901234567890123456789016",
    ID:1,
    testDescriptorID:14,
    date:"2021/11/29",
    result: false
  }
  beforeEach(() => {
    dao.run.mockReset();
    dao.get.mockReset();
    dao.all.mockReset();
    dao.run.mockReturnValueOnce([Test]);
    dao.all.mockReturnValueOnce(["1"]);
    dao.all.mockReturnValueOnce(["2"]);
    dao.all.mockReturnValueOnce(["3"]);
  });

  test("modify Test Result", async () => {
    let res = await testr.modifyTestResult(
      Test.testDescriptorID,Test.date,Test.result,Test.RFID, Test.ID);
  console.log(res)
 // res = await itemt.getItems();
  expect(res).toEqual(200);
});
})


describe("delete Test", () => {
  const Test = {
    RFID:"12345678901234567890123456789016",
    ID:1,
    testDescriptorID:14,
    date:"2021/11/29",
    result: false
  }
  beforeEach(() => {
    dao.run.mockReset();
    dao.get.mockReset();
    dao.all.mockReset();
    dao.run.mockReturnValueOnce([Test]);
  });

  test("delete Test", async () => {
    let res = await testr.deleteTestResult(Test.RFID,Test.ID);
    expect(res).toEqual(204);
  });
});
