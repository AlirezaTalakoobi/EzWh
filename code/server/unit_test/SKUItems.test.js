const SKUIC = require("../modules/Controller/SKUItemsController");
const SKUC = require("../modules/Controller/SKUController");
const DAO = require("../modules/DB/DAO");
const dao = new DAO();
const sku = new SKUIC(dao);
const s = new SKUC(dao);

describe("getSKUItems", () => {
  beforeEach(async () => {
    await sku.deleteAll();
  });
  testgetSKUItems([
    {
      RFID: "12345678901234567890123456789014",
      Available: 0,
      DateOfStock: "2021/11/29",
    },
    {
      RFID: "12345678901234567890123456789015",
      Available: 0,
      DateOfStock: "2021/11/29",
    },
  ]);
});

async function testgetSKUItems(skus) {
  test("getSKUItems", async () => {
    let newitem = await s.newSKU({
      description: "a new sku",
      weight: 100,
      volume: 50,
      notes: "first SKU",
      availableQuantity: 50,
      price: 10.99,
    });
    await sku.newSKUItem(
      "12345678901234567890123456789014",
      newitem.id,
      "2021/11/29"
    );
    await sku.newSKUItem(
      "12345678901234567890123456789015",
      newitem.id,
      "2021/11/29"
    );
    let res = await sku.getSKUItems();
    expect(res).toEqual([
      {
        RFID: skus[0].RFID,
        SKUId: newitem.id,
        Available: skus[0].Available,
        DateOfStock: skus[0].DateOfStock,
      },
      {
        RFID: skus[1].RFID,
        SKUId: newitem.id,
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
    // await sku.newSKUItem("12345678901234567890123456789014", "4", "2021/11/29");
    // await sku.editRFID(
    //   "12345678901234567890123456789014",
    //   "12345678901234567890123456789014",
    //   "1",
    //   "2021/11/30"
    // );
  });
  testGetSKUItemBYID({
    DateOfStock: "2021/11/30",
  });
});

async function testGetSKUItemBYID(skuitem) {
  test("testGetSKUItemBYID", async () => {
    let newitem = await s.newSKU({
      description: "a new sku",
      weight: 100,
      volume: 50,
      notes: "first SKU",
      availableQuantity: 50,
      price: 10.99,
    });
    await sku.newSKUItem(
      "12345678901234567890123456789020",
      newitem.id,
      "2021/11/29"
    );
    await sku.editRFID(
      "12345678901234567890123456789020",
      "12345678901234567890123456789020",
      "1",
      "2021/11/30"
    );
    let res = await sku.getSKUItemsBySKUId(newitem.id);
    expect(res).toEqual([
      {
        RFID: "12345678901234567890123456789020",
        SKUId: newitem.id,
        DateOfStock: skuitem.DateOfStock,
      },
    ]);
  });
}
describe("getSKUItemNotEqual", () => {
  beforeEach(async () => {
    await sku.deleteAll();
  });
  testGetSKUItemBYIDGreaterQuantity();
  testGetSKUItemBYIDNotExisting();
});
async function testGetSKUItemBYIDGreaterQuantity() {
  test("testGetSKUItemBYID", async () => {
    let newitem = await s.newSKU({
      description: "a new sku",
      weight: 100,
      volume: 50,
      notes: "first SKU",
      availableQuantity: 50,
      price: 10.99,
    });
    await sku.newSKUItem(
      "12345678901234567890123456789020",
      newitem.id,
      "2021/11/29"
    );
    await sku.editRFID(
      "12345678901234567890123456789020",
      "12345678901234567890123456789020",
      "100",
      "2021/11/30"
    );
    let res = await sku.getSKUItemsBySKUId(newitem.id);
    expect(res).toEqual({ message: "no item associated to id" });
  });
}
async function testGetSKUItemBYIDNotExisting() {
  test("testGetSKUItemBYID", async () => {
    let newitem = await s.newSKU({
      description: "a new sku",
      weight: 100,
      volume: 50,
      notes: "first SKU",
      availableQuantity: 50,
      price: 10.99,
    });
    await sku.newSKUItem(
      "12345678901234567890123456789020",
      newitem.id,
      "2021/11/29"
    );
    await sku.editRFID(
      "12345678901234567890123456789020",
      "12345678901234567890123456789020",
      "1",
      "2021/11/30"
    );
    let res = await sku.getSKUItemsBySKUId(99999999999);
    expect(res).toEqual({ message: "no item associated to id" });
  });
}

describe("getSKUItemBYRFID", () => {
  beforeEach(async () => {
    await sku.deleteAll();
  });
  testgetItemByRFID({
    rfid: "12345678901234567890123456789022",
    DateOfStock: "2021/11/29",
  });
  afterEach(async () => {
    await sku.deleteAll();
  });
  testgetItemByRFIDNotExisting({
    rfid: "12345678901234567890123456789024",
    DateOfStock: "2021/11/29",
  });
});
async function testgetItemByRFID(item) {
  test("testGetSKUItemBYRFID", async () => {
    let newitem = await s.newSKU({
      description: "a new sku",
      weight: 100,
      volume: 50,
      notes: "first SKU",
      availableQuantity: 50,
      price: 10.99,
    });
    await sku.newSKUItem(item.rfid, newitem.id, item.DateOfStock);
    let res = await sku.getSKUItemsByRFID(item.rfid);
    expect(res).toEqual({
      RFID: item.rfid,
      SKUId: res.SKUId,
      Available: 0,
      DateOfStock: item.DateOfStock,
    });
  });
}
async function testgetItemByRFIDNotExisting(item) {
  test("testGetSKUItemBYRFID NOT EXISTING", async () => {
    let res = await sku.getSKUItemsByRFID(item.rfid);
    expect(res).toEqual({ message: "no SKU found with this rfid" });
  });
}

describe("insertSKUItems", () => {
  beforeEach(async () => {
    await sku.deleteAll();
  });
  testInsertItem({
    RFID: "12345678901234567890123456789015",
    DateOfStock: "2021/11/29",
  });
  testInsertItemSKUIDNotexisting({
    RFID: "12345678901234567890123456789015",
    DateOfStock: "2021/11/29",
  });
  testInsertRFIDExisting({
    RFID: "12345678901234567890123456789015",
    DateOfStock: "2021/11/31",
  });
});

async function testInsertItem(item) {
  test("insert newUser", async () => {
    let newitem = await s.newSKU({
      description: "a new sku",
      weight: 100,
      volume: 50,
      notes: "first SKU",
      availableQuantity: 50,
      price: 10.99,
    });
    await sku.newSKUItem(item.RFID, newitem.id, item.DateOfStock);
    res = await sku.getSKUItemsByRFID(item.RFID);

    expect(res).toEqual({
      RFID: item.RFID,
      SKUId: newitem.id,
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
    let newitem = await s.newSKU({
      description: "a new sku",
      weight: 100,
      volume: 50,
      notes: "first SKU",
      availableQuantity: 50,
      price: 10.99,
    });
    let res = await sku.newSKUItem(item.RFID, newitem.id, item.DateOfStock);
    res = await sku.newSKUItem(item.RFID, newitem.id, item.DateOfStock);
    expect(res).toEqual({
      message: "Item with RFID already existing",
    });
  });
}

describe("updateSKUItems", () => {
  beforeEach(async () => {
    await sku.deleteAll();
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
    rfid: "12345678901234567890123456789024",
  });
});
async function testUpdateItem(item) {
  test("update item", async () => {
    let newitem = await s.newSKU({
      description: "a new sku",
      weight: 100,
      volume: 50,
      notes: "first SKU",
      availableQuantity: 50,
      price: 10.99,
    });
    let res = await sku.newSKUItem(item.rfid, newitem.id, "2021/11/29");
    res = await sku.editRFID(
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
    let newitem = await s.newSKU({
      description: "a new sku",
      weight: 100,
      volume: 50,
      notes: "first SKU",
      availableQuantity: 50,
      price: 10.99,
    });

    await sku.newSKUItem(
      "12345678901234567890123456789024",
      newitem.id,
      "2021/11/29"
    );
    await sku.newSKUItem(
      "12345678901234567890123456789018",
      newitem.id,
      "2021/11/29"
    );
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
    let newitem = await s.newSKU({
      description: "a new sku",
      weight: 100,
      volume: 50,
      notes: "first SKU",
      availableQuantity: 50,
      price: 10.99,
    });
    await sku.newSKUItem(item.RFID, newitem.id, "2021/12/25");
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
