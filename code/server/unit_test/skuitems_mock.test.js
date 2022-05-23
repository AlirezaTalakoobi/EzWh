const SKUIC = require("../modules/Controller/SKUItemsController");
const dao = require("../modules/DB/mockdao");
const skui = new SKUIC(dao);

describe("get skus", () => {
  beforeEach(() => {
    dao.all.mockReset();
    dao.all.mockReturnValueOnce([
      {
        RFID: "12345678901234567890123456789014",
        skuID: 1,
        available: 50,
        dateOfStock: "2020/10/22",
      },
    ]);
  });

  test("get items", async () => {
    let res = await skui.getSKUItems();
    expect(res).toEqual([
      {
        RFID: "12345678901234567890123456789014",
        SKUId: 1,
        Available: 50,
        DateOfStock: "2020/10/22",
      },
    ]);
  });
});

describe("get skus by id", () => {
  const item = {
    RFID: "12345678901234567890123456789014",
    skuID: 1,
    available: 1,
    dateOfStock: "2020/10/22",
  };
  beforeEach(() => {
    dao.all.mockReset();
    dao.all.mockReturnValueOnce([item]);
  });

  test("get items", async () => {
    let res = await skui.getSKUItemsBySKUId();

    expect(res).toEqual([
      {
        RFID: "12345678901234567890123456789014",
        SKUId: 1,
        DateOfStock: "2020/10/22",
      },
    ]);
  });
});

describe("get skus by rfid", () => {
  const item = {
    RFID: "12345678901234567890123456789014",
    skuID: 1,
    available: 30,
    dateOfStock: "2020/10/22",
  };
  beforeEach(() => {
    dao.get.mockReset();
    dao.get.mockReturnValueOnce(item);
  });

  test("get items", async () => {
    let res = await skui.getSKUItemsByRFID(item.rfid);
    expect(res).toEqual({
      RFID: "12345678901234567890123456789014",
      SKUId: 1,
      Available: 30,
      DateOfStock: "2020/10/22",
    });
  });
});

describe("set sku items", () => {
  const newitem = {
    RFID: "12345678901234567890123456789014",
    available: 30,
    skuId: 1,
    dateOfStock: "2020/10/22",
  };
  beforeEach(() => {
    dao.run.mockReset();
    dao.get.mockReset();
    dao.all.mockReset();
    dao.run.mockReturnValueOnce(newitem);
    dao.all.mockReturnValueOnce("1");
  });
  test("set item", async () => {
    let res = await skui.newSKUItem(
      newitem.RFID,
      newitem.skuID,
      newitem.dateOfStock
    );
    expect(res).toEqual({
      RFID: "12345678901234567890123456789014",
      available: 30,
      dateOfStock: "2020/10/22",
      skuId: 1,
    });
  });
});

describe("edit sku item", () => {
  const edititem = {
    RFID: "12345678901234567890123456789022",
    available: 35,
    skuId: 1,
    dateOfStock: "2020/10/22",
  };
  beforeEach(() => {
    dao.get.mockReset();
    dao.all.mockReturnValueOnce([edititem.RFID]);
    dao.run.mockReset();
    dao.run.mockReturnValueOnce(edititem);
  });

  test("edit item", async () => {
    let res = await skui.editRFID(
      "12345678901234567890123456789014",
      "12345678901234567890123456789022",
      35,
      "2020/10/22"
    );

    expect(res).toEqual({
      RFID: "12345678901234567890123456789022",
      available: 35,
      skuId: 1,
      dateOfStock: "2020/10/22",
    });
  });
});
describe("delete item", () => {
  const deleteitem = {
    RFID: "12345678901234567890123456789022",
    available: 35,
    skuId: 1,
    dateOfStock: "2020/10/22",
  };
  beforeEach(() => {
    dao.get.mockReset();
    dao.get.mockReturnValueOnce(deleteitem);
    dao.run.mockReset();
    dao.run.mockReturnValueOnce(deleteitem);
  });

  test("delete item", async () => {
    let res = await skui.deleteItem(deleteitem.RFID);
    expect(res).toEqual(undefined);
  });
});
