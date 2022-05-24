const restockC = require("../modules/Controller/RestockOrderController");
const userC = require("../modules/Controller/UserController");
const skuC = require("../modules/Controller/SKUController");
const DAO = require("../modules/DB/DAO");
const { expect } = require("chai");
const dao = new DAO();
const rc = new restockC(dao);
const uc = new userC(dao);
const sc = new skuC(dao);



describe("Get restock orders", () => {
  let userId = 1;
  let skus = {first: 1, second: 2};
  let orderId;

  beforeEach(async () => {
      await rc.deleteAllRestockOrders();
      await rc.createRestockOrder("2021/11/29 09:33", userId, [{SKUId: skus.second, description: "New super cool mountain bike: CANYON STOIC 4", price: 1700, qty: 5}]);
      await rc.createRestockOrder("2022/05/05 09:33", userId, [{SKUId: skus.first, description: "Sweet restock of requested Acer Aspire 3", price: 170, qty: 10}]);
      //await uc.deleteAll();
      //await sc.deleteAllSkus();
      //newSKU
      //userId = await uc.newUser("Giulio", "Sunder", "gs@ezwh.com", "supplier", "hello");
  })
  testGetRestockAllOrders([{
    issueDate: "2021/11/29 09:33",
    state: "ISSUED",
    skuItems: [],
    supplierId: userId,
    products: [{SKUId: skus.second, description: "New super cool mountain bike: CANYON STOIC 4", price: 1700, qty: 5}]
  }, {
    issueDate: "2022/05/05 09:33",
    state: "ISSUED",
    skuItems: [],
    supplierId: userId,
    products: [{SKUId: skus.first, description: "Sweet restock of requested Acer Aspire 3", price: 170, qty: 10}]
  }]);
});


async function testGetRestockAllOrders(orders){
  test("getRestockOrder", async () => {
    const result = await rc.getRestockOrders();
    expect(result.length).equal(2);
    expect(result[0]).to.deep.equal({
      id: restockC.lastRestockOrderId - 1,
      state: orders[0].state,
      skuItems: orders[0].skuItems,
      issueDate: orders[0].issueDate,
      supplierId: orders[0].supplierId,
      products: orders[0].products
    });
    expect(result[1]).to.deep.equal({
      id: restockC.lastRestockOrderId,
      state: orders[1].state,
      skuItems: orders[1].skuItems,
      issueDate: orders[1].issueDate,
      supplierId: orders[1].supplierId,
      products: orders[1].products
    })
  })
}



describe("Get restock orders issued", () => {
  let userId = 1;
  let skus = {first: 1, second: 2};
  
  beforeEach(async () => {
      await rc.deleteAllRestockOrders();
      await rc. createRestockOrder("2021/11/29 09:33", userId, [{SKUId: skus.second, description: "New super cool mountain bike: CANYON STOIC 4", price: 1700, qty: 5}]);
      let orderId = await rc. createRestockOrder("2022/05/05 09:33", userId, [{SKUId: skus.first, description: "Sweet restock of requested Acer Aspire 3", price: 170, qty: 10}]);
      await rc.changeStateOfRestockOrder(orderId, "DELIVERED");
      //await uc.deleteAll();
      //await sc.deleteAllSkus();
      //newSKU
      //userId = await uc.newUser("Giulio", "Sunder", "gs@ezwh.com", "supplier", "hello");
  })
  testGetRestockOrdersIssued([{
    issueDate: "2021/11/29 09:33",
    state: "ISSUED",
    skuItems: [],
    supplierId: userId,
    products: [{SKUId: skus.second, description: "New super cool mountain bike: CANYON STOIC 4", price: 1700, qty: 5}]
  }]);
});


async function testGetRestockOrdersIssued(orders){
  test("getRestockOrder", async () => {
    const result = await rc.getRestockOrdersIssued();
    expect(result.length).equal(1);
    expect(result[0]).to.deep.equal({
      id: restockC.lastRestockOrderId - 1,
      state: orders[0].state,
      skuItems: orders[0].skuItems,
      issueDate: orders[0].issueDate,
      supplierId: orders[0].supplierId,
      products: orders[0].products
    });
  })
}




describe("Get restock order by id", () => {
  let userId = 1;
  let skus = {first: 1, second: 2};

  beforeEach(async () => {
      await rc.deleteAllRestockOrders();
      await rc. createRestockOrder("2021/11/29 09:33", userId, [{SKUId: skus.second, description: "New super cool mountain bike: CANYON STOIC 4", price: 1700, qty: 5}]);
      //await uc.deleteAll();
      //await sc.deleteAllSkus();
      //newSKU
      //userId = await uc.newUser("Giulio", "Sunder", "gs@ezwh.com", "supplier", "hello");
  })
  testGetRestockOrder("2021/11/29 09:33", userId, [{SKUId: skus.second, description: "New super cool mountain bike: CANYON STOIC 4", price: 1700, qty: 5}]);
});


async function testGetRestockOrder(issueDate, supplierId, products){
  test("getRestockOrder", async () => {
    const order = await rc.getRestockOrder(restockC.lastRestockOrderId);
    expect(order).to.deep.equal({
      id: restockC.lastRestockOrderId,
      state: "ISSUED",
      skuItems: [],
      issueDate: issueDate,
      supplierId: supplierId,
      products: products
    })
  })
}





describe("Create new restock order and retrieve it by id", () => {
    let userId = 1;
    let skus = {first: 1, second: 2};

    beforeEach(async () => {
        await rc.deleteAllRestockOrders();
        //await uc.deleteAll();
        //await sc.deleteAllSkus();
        //newSKU
        //userId = await uc.newUser("Giulio", "Sunder", "gs@ezwh.com", "supplier", "hello");
    })
    testCreateRestockOrder("2021/11/29 09:33", userId, [{SKUId: skus.second, description: "New super cool mountain bike: CANYON STOIC 4", price: 1700, qty: 5}]);
});


async function testCreateRestockOrder(issueDate, supplierId, products){
  test("createRestockOrder", async () => {
    const orderId = await rc.createRestockOrder(issueDate, supplierId, products);
    const order = await rc.getRestockOrder(orderId);
    expect(orderId).greaterThanOrEqual(1);
    expect(order).to.deep.equal({
      id: orderId,
      state: "ISSUED",
      skuItems: [],
      issueDate: issueDate,
      supplierId: supplierId,
      products: products
    })
  })
}



describe("Modify state of restock order and retrieve it by id", () => {
  let userId = 1;
  let skus = {first: 1, second: 2};

  beforeEach(async () => {
      await rc.deleteAllRestockOrders();
      await rc. createRestockOrder("2021/11/29 09:33", userId, [{SKUId: skus.second, description: "New super cool mountain bike: CANYON STOIC 4", price: 1700, qty: 5}]);

      //await uc.deleteAll();
      //await sc.deleteAllSkus();
      //newSKU
      //userId = await uc.newUser("Giulio", "Sunder", "gs@ezwh.com", "supplier", "hello");
  })
  testModifyStateOfRestockOrder("DELIVERED");
});


async function testModifyStateOfRestockOrder(newState) {
  test("changeStateOfRestockOrder", async () => {
    await rc.changeStateOfRestockOrder(restockC.lastRestockOrderId, newState);
    const order = await rc.getRestockOrder(restockC.lastRestockOrderId);
    //console.log(res);
    expect(order).to.deep.equal({
        id: restockC.lastRestockOrderId,
        state: newState,
        skuItems: order.skuItems,
        issueDate: order.issueDate,
        supplierId: order.supplierId,
        products: order.products
    });
  });
}


describe("Add sku items to restock order", () => {
  let userId = 1;
  let skus = {first: 1, second: 2};

  beforeEach(async () => {
      await rc.deleteAllRestockOrders();
      let orderId = await rc. createRestockOrder("2021/11/29 09:33", userId, [{SKUId: skus.second, description: "New super cool mountain bike: CANYON STOIC 4", price: 1700, qty: 5}]);
      await rc.changeStateOfRestockOrder(orderId, "DELIVERED");
      //await uc.deleteAll();
      //await sc.deleteAllSkus();
      //newSKU
      //userId = await uc.newUser("Giulio", "Sunder", "gs@ezwh.com", "supplier", "hello");
  })
  testAddSkuItemsToRestockOrder([{"SKUId":2,"rfid":"01934560000000000080002345678901"}]);
});


async function testAddSkuItemsToRestockOrder(skuItems) {
  test("addSkuItemsToRestockOrder", async () => {
    const result = await rc.addSkuItemsToRestockOrder(restockC.lastRestockOrderId, skuItems);
    const allItems = await rc.getSkuItemsForRestockOrder(restockC.lastRestockOrderId);
    expect(result).equal(restockC.lastRestockOrderId);
    expect(skuItems.every(newItem => allItems.find(item => item.rfid === newItem.rfid))).equal(true);
  });
}



describe("Add transport note to a restock order", () => {
  let userId = 1;
  let skus = {first: 1, second: 2};

  beforeEach(async () => {
      await rc.deleteAllRestockOrders();
      let orderId = await rc. createRestockOrder("2021/11/29 09:33", userId, [{SKUId: skus.second, description: "New super cool mountain bike: CANYON STOIC 4", price: 1700, qty: 5}]);
      await rc.changeStateOfRestockOrder(orderId, "DELIVERED");
      //await uc.deleteAll();
      //await sc.deleteAllSkus();
      //newSKU
      //userId = await uc.newUser("Giulio", "Sunder", "gs@ezwh.com", "supplier", "hello");
  })
  testAddTransportNoteToRestockOrder({deliveryDate: "2021/12/09"});
});


async function testAddTransportNoteToRestockOrder(transportNote) {
  test("addTransportNoteToRestockOrder", async () => {
    const result = await rc.addTransportNoteToRestockOrder(restockC.lastRestockOrderId, transportNote);
    const order = await rc.getRestockOrder(restockC.lastRestockOrderId);
    expect(result).equal(restockC.lastRestockOrderId);
    expect(order.transportNote).to.deep.equal(transportNote);
  });
}