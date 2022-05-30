const PositionController = require("../modules/Controller/PositionController");
const DAO = require("../modules/DB/DAO");
const dao = new DAO();
const uc = new PositionController(dao);

describe("getPosition", () => {
    beforeEach(async () => {
      await uc.deleteAll();
      await uc.createPosition(
            "800234543412",
            "8002",
            "3454",
            "3412",
            1000,
            1000
      );
    });
    afterEach(async () => {
        await uc.deleteAll();
    });
    testGetPosition(
        {
            ID:"800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        });
    });

async function testGetPosition(positions) {
    test("getPosition", async () => {
        let res = await uc.getPosition();
        expect(positions).toEqual({
            ID: res["result"][0].positionID,
            aisleID: res["result"][0].aisleID,
            row: res["result"][0].row,
            col: res["result"][0].col,
            maxWeight: res["result"][0].maxWeight,
            maxVolume: res["result"][0].maxVolume
    });
    });
}

describe("createPosition", () => {
    beforeEach(async () => {
      await uc.deleteAll();
    });
    afterEach(async () => {
        await uc.deleteAll();
    });
    testCreatePosition(
        {
            ID:"800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        });
    });

async function testCreatePosition(positions) {
    test("createPosition", async () => {
        let res = await uc.createPosition(
            positions["ID"],positions["aisleID"],positions["row"],positions["col"],positions["maxWeight"],positions["maxVolume"]);
        res = await uc.getPosition();
        expect(positions).toEqual({

            ID: res["result"][0].positionID,
            aisleID: res["result"][0].aisleID,
            row: res["result"][0].row,
            col: res["result"][0].col,
            maxWeight: res["result"][0].maxWeight,
            maxVolume: res["result"][0].maxVolume
    });
    });
}

describe("modifyPosition", () => {
    beforeEach(async () => {
      await uc.deleteAll();
      await uc.createPosition(
        "800234543412",
        "8002",
        "3454",
        "3412",
        1000,
        1000
  ); 
    });
    afterEach(async () => {
        await uc.deleteAll();
    });
    testModifyPosition(
        {
            ID:"800234543412",
            aisleID: "4002",
            row: "3500",
            col: "3500",
            maxWeight: 300,
            maxVolume: 400,
            occupiedWeight: 10,
            occupiedVolume: 8
        });
    });

async function testModifyPosition(positions) {
    test("modifyPosition", async () => {
        let res = await uc.modifyPosition(
            positions["ID"],positions["aisleID"],positions["row"],positions["col"],positions["maxWeight"],positions["maxVolume"],positions["occupiedWeight"],positions["occupiedVolume"]);
        res = await uc.getPosition();
        console.log(res["result"][0].occupiedVolume);
        expect(positions).toEqual({

            ID: res["result"][0].positionID,
            aisleID: res["result"][0].aisleID,
            row: res["result"][0].row,
            col: res["result"][0].col,
            maxWeight: res["result"][0].maxWeight,
            maxVolume: res["result"][0].maxVolume,
            occupiedWeight: res["result"][0].occupiedWeight,
            occupiedVolume: res["result"][0].occupiedVolume
    });
    });
}

describe("changePositionID", () => {
    beforeEach(async () => {
      await uc.deleteAll();
      await uc.createPosition(
        "800234543412",
        "8002",
        "3454",
        "3412",
        1000,
        1000
  ); 
    });
    afterEach(async () => {
        await uc.deleteAll();
    });
    testChangePositionID(
        {
            ID:"800234543832",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 0,
            occupiedVolume: 0
        });
    });

async function testChangePositionID(positions) {
    test("changePositionID", async () => {
        let res = await uc.changePositionID(
            "800234543412",positions["ID"]);
        res = await uc.getPosition();
        expect(positions).toEqual({

            ID: res["result"][0].positionID,
            aisleID: res["result"][0].aisleID,
            row: res["result"][0].row,
            col: res["result"][0].col,
            maxWeight: res["result"][0].maxWeight,
            maxVolume: res["result"][0].maxVolume,
            occupiedWeight: res["result"][0].occupiedWeight,
            occupiedVolume: res["result"][0].occupiedVolume
    });
    });
}

describe("deletePosition", () => {
    beforeEach(async () => {
      await uc.deleteAll();
      await uc.createPosition({
        ID:"800234543832",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 0,
            occupiedVolume: 0
      });
    });
    testDeletePosition({id:"800234543832"});
    afterEach(async () => {
      await uc.deleteAll();
    });
  });
  
  async function testDeletePosition(positions) {
    test("deletePosition", async () => {
      let res = await uc.deletePosition(positions['id']);
      expect(res).toEqual(204);
    });
  }