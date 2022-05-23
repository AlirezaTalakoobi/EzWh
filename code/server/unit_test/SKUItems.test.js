const SKUIC = require("../modules/Controller/SKUItemsController");
const DAO = require("../modules/DB/DAO");
const dao = new DAO();
const sku = new SKUIC(dao);

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
    expect(res).toEqual([
      {
        RFID: skuitem.RFID,
        SKUId: skuitem.SKUId,
        DateOfStock: skuitem.DateOfStock,
      },
    ]);
  });
}
describe("getSKUItemNotEqual", () => {
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
  testGetSKUItemBYIDNotExisting();
});
async function testGetSKUItemBYIDGreaterQuantity() {
  test("testGetSKUItemBYID", async () => {
    let res = await sku.getSKUItemsBySKUId("4");
    expect(res).toEqual({ message: "no item associated to id" });
  });
}
async function testGetSKUItemBYIDNotExisting() {
  test("testGetSKUItemBYID", async () => {
    let res = await sku.getSKUItemsBySKUId("2");
    expect(res).toEqual({ message: "no item associated to id" });
  });
}

describe("getSKUItemBYRFID", () => {
  beforeEach(async () => {
    await sku.deleteAll();
    await sku.newSKUItem("12345678901234567890123456789014", "4", "2021/11/29");
  });
  testgetItemByRFID("12345678901234567890123456789014");
  afterEach(async () => {
    await sku.deleteAll();
  });
  testgetItemByRFIDNotExisting("12345678901234567890123456789022");
});
async function testgetItemByRFID(rfid) {
  test("testGetSKUItemBYID", async () => {
    let res = await sku.getSKUItemsByRFID(rfid);
    expect(res).toEqual({
      RFID: res.RFID,
      SKUId: res.SKUId,
      Available: res.Available,
      DateOfStock: res.DateOfStock,
    });
  });
}
async function testgetItemByRFIDNotExisting(rfid) {
  test("testGetSKUItemBYID", async () => {
    let res = await sku.getSKUItemsByRFID(rfid);
    expect(res).toEqual({ message: "no SKU found with this rfid" });
  });
}

describe("insertSKUItems", () => {
  beforeEach(async () => {
    await sku.deleteAll();
  });
  testInsertItem({
    RFID: "12345678901234567890123456789015",
    SKUId: 4,
    DateOfStock: "2021/11/29",
  });
  testInsertItemSKUIDNotexisting({
    RFID: "12345678901234567890123456789015",
    SKUId: 20,
    DateOfStock: "2021/11/29",
  });
  testInsertRFIDExisting({
    RFID: "12345678901234567890123456789015",
    SKUId: 4,
    DateOfStock: "2021/11/31",
  });
});

async function testInsertItem(item) {
  test("insert newUser", async () => {
    let res = await sku.newSKUItem(item.RFID, item.SKUId, item.DateOfStock);

    res = await sku.getSKUItemsByRFID(item.RFID);
    expect(res).toEqual({
      RFID: item.RFID,
      SKUId: item.SKUId,
      Available: 0,
      DateOfStock: item.DateOfStock,
    });
  });
}

async function testInsertItemSKUIDNotexisting(item) {
  test("insert ItemSKUIDNotexisting", async () => {
    let res = await sku.newSKUItem(item.RFID, item.SKUId, item.DateOfStock);
    expect(res).toEqual({
      skuid: "No SKU associated to SKUId",
    });
  });
}
async function testInsertRFIDExisting(item) {
  test("insert item with rfid existing", async () => {
    let res = await sku.newSKUItem(item.RFID, item.SKUId, item.DateOfStock);
    res = await sku.newSKUItem(item.RFID, item.SKUId, item.DateOfStock);
    expect(res).toEqual({
      message: "Item with RFID already existing",
    });
  });
}

describe("updateSKUItems", () => {
  beforeEach(async () => {
    await sku.deleteAll();
    await sku.newSKUItem("12345678901234567890123456789015", 4, "2021/11/29");
  });
  testUpdateItem({
    newRFID: "12345678901234567890123456789020",
    newAvailable: 50,
    newDateOfStock: "2021/12/25",
    rfid: "12345678901234567890123456789015",
  });
  testUpdateItemNotFound({
    RFID: "12345678901234567890123456789022",
    SKUId: 20,
    DateOfStock: "2021/11/29",
  });
  testUpdateRFIDAlreadyExisting({
    newRFID: "12345678901234567890123456789018",
    newAvailable: 50,
    newDateOfStock: "2021/12/25",
    rfid: "12345678901234567890123456789015",
  });
});
async function testUpdateItem(item) {
  test("update item", async () => {
    let res = await sku.editRFID(
      item.rfid,
      item.newRFID,
      item.newAvailable,
      item.newDateOfStock
    );
    res = await sku.getSKUItemsByRFID(item.newRFID);
    expect(res).toEqual({
      RFID: item.newRFID,
      SKUId: res.SKUId,
      Available: item.newAvailable,
      DateOfStock: item.newDateOfStock,
    });
  });
}

async function testUpdateItemNotFound(item) {
  test("update item not found", async () => {
    let res = await sku.editRFID(
      item.rfid,
      item.newRFID,
      item.newAvailable,
      item.newDateOfStock
    );

    expect(res).toEqual({
      item: "Item not found",
    });
  });
}

async function testUpdateRFIDAlreadyExisting(item) {
  test("update item already existing", async () => {
    await sku.newSKUItem("12345678901234567890123456789018", 4, "2021/11/29");
    let res = await sku.editRFID(
      item.rfid,
      item.newRFID,
      item.newAvailable,
      item.newDateOfStock
    );

    expect(res).toEqual({
      message: "Item with new RFID already existing",
    });
  });
}
describe("deleteSKUItems", () => {
  beforeEach(async () => {
    await sku.deleteAll();
    await sku.newSKUItem("12345678901234567890123456789015", 4, "2021/11/29");
  });
  testDeleteItem({
    RFID: "12345678901234567890123456789015",
  });
  testDeleteItemNotFound("12345678901234567890123456789022");
  afterEach(async () => {
    await sku.deleteAll();
  });
});

async function testDeleteItem(item) {
  test("delete item not existing", async () => {
    let res = await sku.deleteItem(item.RFID);
    res = await sku.getSKUItemsByRFID(item.RFID);
    expect(res).toEqual({
      message: "no SKU found with this rfid",
    });
  });
}

async function testDeleteItemNotFound(rfid) {
  test("delete item not existing", async () => {
    let res = await sku.deleteItem(rfid);
    console.log(res);
    expect(res).toEqual({
      message: "Item not found",
    });
  });
}
