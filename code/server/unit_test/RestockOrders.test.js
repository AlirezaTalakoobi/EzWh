const restockC = require("../modules/Controller/RestockOrderController");
const userC = require("../modules/Controller/UserController");
const skuC = require("../modules/Controller/SKUController");
const itemC = require("../modules/Controller/ItemController");
const skuItemC = require("../modules/Controller/SKUItemsController");

const DAO = require("../modules/DB/DAO");

const { expect } = require("chai");

const dao = new DAO();

const rc = new restockC(dao);
const uc = new userC(dao);
const sc = new skuC(dao);
const ic = new itemC(dao);
const sic = new skuItemC(dao);


describe("Get restock orders", () => {

  beforeEach(async () => {
      await rc.deleteAllRestockOrders();
      await uc.deleteAll();
      await sc.deleteAllSKU();
      await ic.deleteAll();
  })
  testGetRestockAllOrders();
});


async function testGetRestockAllOrders(){
  test("getRestockOrders", async () => {
    const user = await uc.newUser("Michael", "Jordan", "mj@ezwh.com", "supplier", "MJtheGOAT");
    
    const sku1 = await sc.newSKU({description: "Acer Aspire 3", weight: 100, volume: 20, price: 237, availableQuantity: 15});
    const sku2 = await sc.newSKU({description: "Canyon Stoic 4", weight: 14000, volume: 400, price: 1789, availableQuantity: 10});

    await ic.createItem(1, "official supply for acer aspire", 250, sku1.id, user.id);
    await ic.createItem(2, "official supply for canyon stoic", 1500, sku2.id, user.id);

    const order1 = await rc. createRestockOrder("2021/11/29 09:33", user.id, [{SKUId: sku2.id, description: "New super cool mountain bike: CANYON STOIC 4", price: 1500, qty: 5}]);
    const order2 = await rc. createRestockOrder("2022/05/05 09:33", user.id, [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, qty: 10}]);

    const result = await rc.getRestockOrders();
    
    const expectedOrders = [{
      id: order1,
      issueDate: "2021/11/29 09:33",
      state: "ISSUED",
      skuItems: [],
      supplierId: user.id,
      products: [{SKUId: sku2.id, description: "New super cool mountain bike: CANYON STOIC 4", price: 1500, qty: 5}]
    }, {
      id: order2,
      issueDate: "2022/05/05 09:33",
      state: "ISSUED",
      skuItems: [],
      supplierId: user.id,
      products: [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, qty: 10}]
    }]
    
    expect(result.length).equal(2);
    expect(result).to.deep.equal(expectedOrders);
  })
}



describe("Get restock orders issued", () => {

  beforeEach(async () => {
    await rc.deleteAllRestockOrders();
    await uc.deleteAll();
    await sc.deleteAllSKU();
    await ic.deleteAll();
  })

  testGetRestockOrdersIssued();
});


async function testGetRestockOrdersIssued(orders){
  test("getRestockOrder", async () => {
    const user = await uc.newUser("Michael", "Jordan", "mj@ezwh.com", "supplier", "MJtheGOAT");
    
    const sku1 = await sc.newSKU({description: "Acer Aspire 3", weight: 100, volume: 20, price: 237, availableQuantity: 15});
    const sku2 = await sc.newSKU({description: "Canyon Stoic 4", weight: 14000, volume: 400, price: 1789, availableQuantity: 10});

    await ic.createItem(1, "official supply for acer aspire", 250, sku1.id, user.id);
    await ic.createItem(2, "official supply for canyon stoic", 1500, sku2.id, user.id);

    const order1 = await rc. createRestockOrder("2021/11/29 09:33", user.id, [{SKUId: sku2.id, description: "New super cool mountain bike: CANYON STOIC 4", price: 1500, qty: 5}]);
    const order2 = await rc. createRestockOrder("2022/05/05 09:33", user.id, [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, qty: 10}]);

    await rc.changeStateOfRestockOrder(order2, "DELIVERY");
    const result = await rc.getRestockOrdersIssued();
    
    const expectedOrders = [{
      id: order1,
      issueDate: "2021/11/29 09:33",
      state: "ISSUED",
      skuItems: [],
      supplierId: user.id,
      products: [{SKUId: sku2.id, description: "New super cool mountain bike: CANYON STOIC 4", price: 1500, qty: 5}]
    }]
    
    expect(result.length).equal(1);
    expect(result).to.deep.equal(expectedOrders);
  })
}




describe("Get restock order by id", () => {

  beforeEach(async () => {
    await rc.deleteAllRestockOrders();
    await uc.deleteAll();
    await sc.deleteAllSKU();
    await ic.deleteAll();
  })

  testGetRestockOrder();
});


async function testGetRestockOrder(){
  test("getRestockOrder", async () => {
    const user = await uc.newUser("Michael", "Jordan", "mj@ezwh.com", "supplier", "MJtheGOAT");
    
    const sku1 = await sc.newSKU({description: "Acer Aspire 3", weight: 100, volume: 20, price: 237, availableQuantity: 15});
    const sku2 = await sc.newSKU({description: "Canyon Stoic 4", weight: 14000, volume: 400, price: 1789, availableQuantity: 10});

    await ic.createItem(1, "official supply for acer aspire", 250, sku1.id, user.id);
    await ic.createItem(2, "official supply for canyon stoic", 1500, sku2.id, user.id);

    const order1 = await rc. createRestockOrder("2021/11/29 09:33", user.id, [{SKUId: sku2.id, description: "New super cool mountain bike: CANYON STOIC 4", price: 1500, qty: 5}]);
    const order2 = await rc. createRestockOrder("2022/05/05 09:33", user.id, [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, qty: 10}]);

    const result = await rc.getRestockOrder(order1);
    
    const expectedOrder = {
      id: order1,
      issueDate: "2021/11/29 09:33",
      state: "ISSUED",
      skuItems: [],
      supplierId: user.id,
      products: [{SKUId: sku2.id, description: "New super cool mountain bike: CANYON STOIC 4", price: 1500, qty: 5}]
    }

    expect(result).to.deep.equal(expectedOrder)
  })
}





describe("Create new restock order and retrieve it by id", () => {

    beforeEach(async () => {
      await rc.deleteAllRestockOrders();
      await uc.deleteAll();
      await sc.deleteAllSKU();
      await ic.deleteAll();
    });

    testCreateRestockOrder();
    testCreateRestockOrderInvalidData();
});


async function testCreateRestockOrder(){
  test("createRestockOrder", async () => {
    const user = await uc.newUser("Michael", "Jordan", "mj@ezwh.com", "supplier", "MJtheGOAT");
    
    const sku1 = await sc.newSKU({description: "Acer Aspire 3", weight: 100, volume: 20, price: 237, availableQuantity: 15});
    const sku2 = await sc.newSKU({description: "Canyon Stoic 4", weight: 14000, volume: 400, price: 1789, availableQuantity: 10});

    await ic.createItem(1, "official supply for acer aspire", 250, sku1.id, user.id);
    await ic.createItem(2, "official supply for canyon stoic", 1500, sku2.id, user.id);

    const order1 = await rc. createRestockOrder("2021/11/29 09:33", user.id, [{SKUId: sku2.id, description: "New super cool mountain bike: CANYON STOIC 4", price: 1500, qty: 5}]);
    
    const result = await rc.getRestockOrder(order1);
    
    const expectedOrder = {
      id: order1,
      issueDate: "2021/11/29 09:33",
      state: "ISSUED",
      skuItems: [],
      supplierId: user.id,
      products: [{SKUId: sku2.id, description: "New super cool mountain bike: CANYON STOIC 4", price: 1500, qty: 5}]
    }

    expect(order1).greaterThanOrEqual(1);
    expect(result).to.deep.equal(expectedOrder);
  })
}



async function testCreateRestockOrderInvalidData(){
  test("createRestockOrderInvalidData", async () => {
    const user = await uc.newUser("Michael", "Jordan", "mj@ezwh.com", "supplier", "MJtheGOAT");
    
    const sku2 = await sc.newSKU({description: "Canyon Stoic 4", weight: 14000, volume: 400, price: 1789, availableQuantity: 10});

    await ic.createItem(2, "official supply for canyon stoic", 1500, sku2.id, user.id);

    const order1 = await rc. createRestockOrder("2021/11/29 09:33", user.id, [{SKUId: sku2.id, description: "New super cool mountain bike: CANYON STOIC 4", price: 1550, qty: 5}]);
    
    const result = await rc.getRestockOrder(order1);

    expect(order1).equal(-1);
    expect(result).to.deep.equal(-1);
  })
}



describe("Modify state of restock order and retrieve it by id", () => {

  beforeEach(async () => {
    await rc.deleteAllRestockOrders();
    await uc.deleteAll();
    await sc.deleteAllSKU();
    await ic.deleteAll();
  });

  testModifyStateOfRestockOrder();
});


async function testModifyStateOfRestockOrder() {
  test("changeStateOfRestockOrder", async () => {
    const user = await uc.newUser("Michael", "Jordan", "mj@ezwh.com", "supplier", "MJtheGOAT");
    
    const sku1 = await sc.newSKU({description: "Acer Aspire 3", weight: 100, volume: 20, price: 237, availableQuantity: 15});
    const sku2 = await sc.newSKU({description: "Canyon Stoic 4", weight: 14000, volume: 400, price: 1789, availableQuantity: 10});

    await ic.createItem(1, "official supply for acer aspire", 250, sku1.id, user.id);
    await ic.createItem(2, "official supply for canyon stoic", 1500, sku2.id, user.id);

    const order1 = await rc. createRestockOrder("2021/11/29 09:33", user.id, [{SKUId: sku2.id, description: "New super cool mountain bike: CANYON STOIC 4", price: 1500, qty: 5}]);
    
    await rc.changeStateOfRestockOrder(order1, "DELIVERED");
    const result = await rc.getRestockOrder(order1);
    //console.log(res);
    const expectedOrder = {
      id: order1,
      issueDate: "2021/11/29 09:33",
      state: "DELIVERED",
      skuItems: [],
      supplierId: user.id,
      products: [{SKUId: sku2.id, description: "New super cool mountain bike: CANYON STOIC 4", price: 1500, qty: 5}]
    }

    expect(result).to.deep.equal(expectedOrder);
  });
}


describe("Add sku items to restock order", () => {

  beforeEach(async () => {
    await rc.deleteAllRestockOrders();
    await uc.deleteAll();
    await sc.deleteAllSKU();
    await ic.deleteAll();
    await sic.deleteAll();
  });

  testAddSkuItemsToRestockOrder();
  testAddSkuItemsToRestockOrderInvalidItems();
});


async function testAddSkuItemsToRestockOrder() {
  test("addSkuItemsToRestockOrder", async () => {
    const user = await uc.newUser("Michael", "Jordan", "mj@ezwh.com", "supplier", "MJtheGOAT");
    
    const sku1 = await sc.newSKU({description: "Acer Aspire 3", weight: 100, volume: 20, price: 237, availableQuantity: 15});

    await ic.createItem(1, "official supply for acer aspire", 250, sku1.id, user.id);

    const order2 = await rc. createRestockOrder("2022/05/05 09:33", user.id, [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, qty: 10}]);
    await rc.changeStateOfRestockOrder(order2, "DELIVERED");

    const skuItems = [{SKUId: sku1.id, rfid: "01234567890123456789012345678901"}, {SKUId: sku1.id, rfid: "98765432109876543210987654321098"}];
  
    await rc.addSkuItemsToRestockOrder(order2, skuItems);
    const result = await rc.getRestockOrder(order2);

    const expectedOrder = {
      id: order2,
      issueDate:"2022/05/05 09:33",
      state: "DELIVERED",
      products: [{SKUId: sku1.id, description:"Sweet restock of requested Acer Aspire 3", price: 250, qty: 10}],
      supplierId : user.id,
      skuItems: [{SKUId: skuItems[0].SKUId, rfid: skuItems[0].rfid}, {SKUId: skuItems[1].SKUId, rfid: skuItems[1].rfid}]
    }

    expect(result).to.deep.equal(expectedOrder);
  });
}


async function testAddSkuItemsToRestockOrderInvalidItems() {
  test("addSkuItemsToRestockOrderInvalidItems", async () => {
    const user = await uc.newUser("Michael", "Jordan", "mj@ezwh.com", "supplier", "MJtheGOAT");
    
    const sku1 = await sc.newSKU({description: "Acer Aspire 3", weight: 100, volume: 20, price: 237, availableQuantity: 15});

    await ic.createItem(1, "official supply for acer aspire", 250, sku1.id, user.id);

    const order2 = await rc. createRestockOrder("2022/05/05 09:33", user.id, [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, qty: 10}]);
    await rc.changeStateOfRestockOrder(order2, "DELIVERED");

    const skuItems = [{SKUId: sku1.id + 4, rfid: "01234567890123456789012345678901"}, {SKUId: sku1.id, rfid: "98765432109876543210987654321098"}];
  
    const res = await rc.addSkuItemsToRestockOrder(order2, skuItems);
    const result = await rc.getRestockOrder(order2);

    const expectedOrder = {
      id: order2,
      issueDate:"2022/05/05 09:33",
      state: "DELIVERED",
      products: [{SKUId: sku1.id, description:"Sweet restock of requested Acer Aspire 3", price: 250, qty: 10}],
      supplierId : user.id,
      skuItems: []
    }

    expect(res).equal(-2);
    expect(result).to.deep.equal(expectedOrder);
  });
}



describe("Add transport note to a restock order", () => {

  beforeEach(async () => {
    await rc.deleteAllRestockOrders();
    await uc.deleteAll();
    await sc.deleteAllSKU();
    await ic.deleteAll();
  })
  testAddTransportNoteToRestockOrder();
});


async function testAddTransportNoteToRestockOrder(transportNote) {
  test("addTransportNoteToRestockOrder", async () => {
    const user = await uc.newUser("Michael", "Jordan", "mj@ezwh.com", "supplier", "MJtheGOAT");
    
    const sku2 = await sc.newSKU({description: "Canyon Stoic 4", weight: 14000, volume: 400, price: 1789, availableQuantity: 10});

    await ic.createItem(2, "official supply for canyon stoic", 1500, sku2.id, user.id);

    const order1 = await rc. createRestockOrder("2021/11/29 09:33", user.id, [{SKUId: sku2.id, description: "New super cool mountain bike: CANYON STOIC 4", price: 1500, qty: 5}]);
    
    await rc.changeStateOfRestockOrder(order1, "DELIVERED");

    await rc.addTransportNoteToRestockOrder(order1, {deliveryDate: "2021/12/09"});
    const result = await rc.getRestockOrder(order1);
    
    const expectedOrder = {
      id: order1,
      issueDate: "2021/11/29 09:33",
      state: "DELIVERED",
      skuItems: [],
      supplierId: user.id,
      products: [{SKUId: sku2.id, description: "New super cool mountain bike: CANYON STOIC 4", price: 1500, qty: 5}],
      transportNote: {deliveryDate: "2021/12/09"}
    }

    expect(result).to.deep.equal(expectedOrder);
  });
}


describe("Delete a restock order", () => {

  beforeEach(async () => {
    await rc.deleteAllRestockOrders();
    await uc.deleteAll();
    await sc.deleteAllSKU();
    await ic.deleteAll();
  })
  testDeleteRestockOrder();
});


async function testDeleteRestockOrder() {
  test("deleteRestockOrder", async () => {
    const user = await uc.newUser("Michael", "Jordan", "mj@ezwh.com", "supplier", "MJtheGOAT");
    
    const sku2 = await sc.newSKU({description: "Canyon Stoic 4", weight: 14000, volume: 400, price: 1789, availableQuantity: 10});

    await ic.createItem(2, "official supply for canyon stoic", 1500, sku2.id, user.id);

    const order1 = await rc. createRestockOrder("2021/11/29 09:33", user.id, [{SKUId: sku2.id, description: "New super cool mountain bike: CANYON STOIC 4", price: 1500, qty: 5}]);

    await rc.deleteRestockOrder(order1);
    const result = await rc.getRestockOrder(order1);

    expect(result).to.deep.equal(-1);
  });
}