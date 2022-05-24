const POSI = require("../modules/Controller/PositionController");
const dao = require("../modules/DB/mockdao");
const posi = new POSI(dao);

describe("get Position", () => {
    const Pos = {
      ID:"800234543412",
      aisleID: "8002",
      row: "3454",
      col: "3412",
      maxWeight: 1000,
      maxVolume: 1000,
      occupiedWeight: 300,
      occupiedVolume:15

    }
  beforeEach(() => {
    dao.all.mockReset();
    dao.all.mockReturnValueOnce([Pos]);
  });

  test("get Position", async () => {
    let res = await posi.getPosition();
    expect(res["result"]).toEqual([
      {
      positionID:"800234543412",
      aisleID: "8002",
      row: "3454",
      col: "3412",
      maxWeight: 1000,
      maxVolume: 1000,
      occupiedWeight: 300,
      occupiedVolume:15
      },
    ]);
  });
});


describe("create Position", () => {
  const Pos = {
    ID:"800234543412",
      aisleID: "8002",
      row: "3454",
      col: "3412",
      maxWeight: 1000,
      maxVolume: 1000,
      occupiedWeight: 300,
      occupiedVolume:15
  }
  beforeEach(() => {
    dao.run.mockReset();
    dao.get.mockReset();
    dao.all.mockReset();
    dao.run.mockReturnValueOnce([Pos]);
  });


test("create Position", async () => {
  let res = await posi.createPosition(
        Pos.ID,Pos.aisleID,Pos.row,Pos.col,Pos.maxWeight,Pos.maxVolume);
    console.log(res)
   // res = await itemt.getItems();
    expect(res).toEqual(201);
});
})



describe("modify Position", () => {
  const Pos = {
    ID:"800234543412",
      aisleID: "8002",
      row: "3454",
      col: "3412",
      maxWeight: 1000,
      maxVolume: 1000,
      occupiedWeight: 300,
      occupiedVolume:15
  }
  beforeEach(() => {
    dao.run.mockReset();
    dao.get.mockReset();
    dao.all.mockReset();
    dao.run.mockReturnValueOnce([Pos]);
    dao.all.mockReturnValueOnce(["1"]);
  });

  test("modify Position", async () => {
    let res = await posi.modifyPosition(
      Pos.ID,Pos.aisleID,Pos.row,Pos.col,Pos.maxWeight,Pos.maxVolume,Pos.occupiedWeight,Pos.occupiedVolume);
  console.log(res)
 // res = await itemt.getItems();
  expect(res).toEqual(200);
});
})


describe("change Position ID", () => {
  const Pos = {
    ID:"800234543412",
      aisleID: "8002",
      row: "3454",
      col: "3412",
      maxWeight: 1000,
      maxVolume: 1000,
      occupiedWeight: 300,
      occupiedVolume:15
  }
  beforeEach(() => {
    dao.run.mockReset();
    dao.get.mockReset();
    dao.all.mockReset();
    dao.run.mockReturnValueOnce([Pos]);
    dao.all.mockReturnValueOnce(["1"]);
  });

  test("change Position ID", async () => {
    let res = await posi.changePositionID(
      Pos.ID,"801234543412");
  console.log(res)
 // res = await itemt.getItems();
  expect(res).toEqual(200);
});
})


describe("delete Position", () => {
  const Pos = {
    ID:"800234543412",
      aisleID: "8002",
      row: "3454",
      col: "3412",
      maxWeight: 1000,
      maxVolume: 1000,
      occupiedWeight: 300,
      occupiedVolume:15
  }
  beforeEach(() => {
    dao.run.mockReset();
    dao.get.mockReset();
    dao.all.mockReset();
    dao.run.mockReturnValueOnce([Pos]);
  });

  test("delete Position", async () => {
    let res = await posi.deletePosition(
      Pos.ID);
  console.log(res)
 // res = await itemt.getItems();
  expect(res).toEqual(204);
});
})
