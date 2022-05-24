const ITEMT = require("../modules/Controller/ItemController");
const dao = require("../modules/DB/mockdao");
const itemt = new ITEMT(dao);

describe("get items", () => {
    const Item = {
        ID:1,
        description : "a new item",
        price : 10.99,
        skuID : 1,
        supplierID : 2
    }
  beforeEach(() => {
    dao.all.mockReset();
    dao.all.mockReturnValueOnce([Item]);
  });

  test("get items", async () => {
    let res = await itemt.getItems();
    expect(res["result"]).toEqual([
      {
        id:1,
        description : "a new item",
        price : 10.99,
        SKUId : 1,
        supplierId : 2
      },
    ]);
  });
});

describe("get Item By ID", () => {
    const Item = {
        ID:1,
        description : "a new item",
        price : 10.99,
        skuID : 1,
        supplierID : 2
    }
  beforeEach(() => {
    dao.all.mockReset();
    dao.all.mockReturnValueOnce([Item]);
  });

  test("get Item By ID", async () => {
    let res = await itemt.getItemByID(Item.ID);
    console.log(res)
    expect(res["result"]).toEqual([
      {
        id:1,
        description : "a new item",
        price : 10.99,
        SKUId : 1,
        supplierId : 2
      },
    ]);
  });
});

describe("create Item", () => {
    const Item = {
        ID:1,
        description : "a new item",
        price : 10.99,
        skuID : 1,
        supplierID : 2
    }
  beforeEach(() => {
    dao.run.mockReset();
    dao.get.mockReset();
    dao.all.mockReset();
    dao.run.mockReturnValueOnce([Item]);
    dao.all.mockReturnValueOnce(["1"]);
    dao.all.mockReturnValueOnce(["2"]);
  });


test("create Position", async () => {
    let res = await itemt.createItem(
        Item["ID"],Item["description"],Item["price"],Item["skuID"],Item["supplierID"]);
    console.log(res)
   // res = await itemt.getItems();
    expect(res).toEqual(201);
});
})



describe("modify Item", () => {
    const Item = {
        ID:1,
        description : "a new item",
        price : 10.99,
        skuID : 1,
        supplierID : 2
    }
  beforeEach(() => {
    dao.run.mockReset();
    dao.get.mockReset();
    dao.all.mockReset();
    dao.run.mockReturnValueOnce([Item]);
    dao.all.mockReturnValueOnce(["1"]);
  });

  test("modify Item", async () => {
    let res = await itemt.modifyItem(
      1,"new desc", 7.99
    );

    expect(res).toEqual(
      200);
  });
});


describe("delete item", () => {
    const Item = {
        ID:1,
        description : "a new item",
        price : 10.99,
        skuID : 1,
        supplierID : 2
    }
  beforeEach(() => {
    dao.run.mockReset();
    dao.get.mockReset();
    dao.all.mockReset();
    dao.run.mockReturnValueOnce([Item]);
  });

  test("delete item", async () => {
    let res = await itemt.deleteItem(Item.ID);
    expect(res).toEqual(204);
  });
});
