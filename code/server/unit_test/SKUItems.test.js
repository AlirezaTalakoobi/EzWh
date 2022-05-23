const SKUIC = require("../modules/Controller/SKUItemsController");
const SKU = require("../modules/Controller/SKUController");
const DAO = require("../modules/DB/DAO");
const dao = new DAO();
const sku = new SKUIC(dao);
const item = new SKU(dao);

describe("getSKUItems", () => {
  beforeEach(async () => {
    await sku.deleteAll();
    await sku.newSKUItem("12345678901234567890123456789014", "4", "2021/11/29");
    await sku.newSKUItem("12345678901234567890123456789015", "6", "2021/11/29");
  });
  testgetSKUItems([
    {
      RFID: "12345678901234567890123456789014",
      SKUId: 4,
      Available: 0,
      DateOfStock: "2021/11/29",
    },
    {
      RFID: "12345678901234567890123456789015",
      SKUId: 6,
      Available: 0,
      DateOfStock: "2021/11/29",
    },
  ]);
});

async function testgetSKUItems(skus) {
  test("getSKUItems", async () => {
    let res = await sku.getSKUItems();
    expect(res).toEqual([
      {
        RFID: skus[0].RFID,
        SKUId: skus[0].SKUId,
        Available: skus[0].Available,
        DateOfStock: skus[0].DateOfStock,
      },
      {
        RFID: skus[1].RFID,
        SKUId: skus[1].SKUId,
        Available: skus[1].Available,
        DateOfStock: skus[1].DateOfStock,
      },
    ]);
  });
}

describe("getSKUItemsEmpty", () => {
  beforeEach(async () => await sku.deleteAll());
  testgetSKUItemsNOTFOUND();
});
async function testgetSKUItemsNOTFOUND() {
  test("getSKUItemsNOTFOUND", async () => {
    let res = await sku.getSKUItems();
    expect(res).toEqual([]);
  });
}

describe("getSKUItem", () => {
  beforeEach(async () => {
    await sku.deleteAll();
    await sku.newSKUItem("12345678901234567890123456789014", "4", "2021/11/29");
    await sku.editRFID(
      "12345678901234567890123456789014",
      "12345678901234567890123456789014",
      "1",
      "2021/11/30"
    );
  });
  testGetSKUItemBYID({
    RFID: "12345678901234567890123456789014",
    SKUId: 4,
    DateOfStock: "2021/11/30",
  });
});

async function testGetSKUItemBYID(skuitem) {
  test("testGetSKUItemBYID", async () => {
    let res = await sku.getSKUItemsBySKUId("4");
    console.log(res);
    expect(res).toEqual([
      {
        RFID: skuitem.RFID,
        SKUId: skuitem.SKUId,
        DateOfStock: skuitem.DateOfStock,
      },
    ]);
  });
}
describe("getSKUItemNotEqual1", () => {
  beforeEach(async () => {
    await sku.deleteAll();
    await sku.newSKUItem("12345678901234567890123456789014", "4", "2021/11/29");
    await sku.editRFID(
      "12345678901234567890123456789014",
      "12345678901234567890123456789014",
      "50",
      "2021/11/30"
    );
  });
  testGetSKUItemBYIDGreaterQuantity();
});
async function testGetSKUItemBYIDGreaterQuantity() {
  test("testGetSKUItemBYID", async () => {
    let res = await sku.getSKUItemsBySKUId("4");
    expect(res).toEqual({ message: "no item associated to id" });
  });
}
