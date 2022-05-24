const internalC = require("../modules/Controller/InternalOrderController");
const userC = require("../modules/Controller/UserController");
const skuC = require("../modules/Controller/SKUController");
const DAO = require("../modules/DB/DAO");
const { expect } = require("chai");
const dao = new DAO();
const ic = new internalC(dao);
const uc = new userC(dao);
const sc = new skuC(dao);



describe("Get restock orders", () => {

  beforeEach(async () => {
      await ic.deleteAllInternalOrders();
      uc.deleteAll();
      //await uc.deleteAll();
      //await sc.deleteAllSkus();
      //newSKU
      //userId = await uc.newUser("Giulio", "Sunder", "gs@ezwh.com", "supplier", "hello");
  })
  testGetInternalAllOrders();
});


async function testGetInternalAllOrders(){
    test("getInternalOrders", async () => {
        const user1 = uc.newUser("Michael", "Jordan", "mj@ezwh.com", "customer", "MJtheGOAT");
        const order1 = await ic. createInternalOrder("2021/11/29 09:33", 2, [{SKUId: 2, description: "New super cool mountain bike: CANYON STOIC 4", price: 1789, qty: 2}]);
        console.log(order1)
        const order2 = await ic. createInternalOrder("2022/05/05 09:33", 2, [{SKUId: 1, description: "Sweet restock of requested Acer Aspire 3", price: 237, qty: 1}]);
        
        const expectedOrders = [{
            issueDate: "2021/11/29 09:33",
            state: "ISSUED",
            customerId: 2,
            products: [{SKUId: 2, description: "New super cool mountain bike: CANYON STOIC 4", price: 1789, qty: 2}]
          }, {
            issueDate: "2022/05/05 09:33",
            state: "ISSUED",
            customerId: 2,
            products: [{SKUId: 1, description: "Sweet restock of requested Acer Aspire 3", price: 237, qty: 1}]
          }];


        const result = await ic.getInternalOrders();
        
        expect(result.length).equal(2);
        expect(result[0]).to.deep.equal({
            id: order1,
            state: orders[0].state,
            issueDate: orders[0].issueDate,
            customerId: orders[0].customerId,
            products: orders[0].products
        });
        expect(result[1]).to.deep.equal({
            id: order2,
            state: orders[1].state,
            issueDate: orders[1].issueDate,
            customerId: orders[1].customerId,
            products: orders[1].products
        })
    })
}



describe("Get internal orders issued", () => {

  beforeEach(async () => {
      await ic.deleteAllInternalOrders();
      //await uc.deleteAll();
      //await sc.deleteAllSkus();
      //newSKU
      //userId = await uc.newUser("Giulio", "Sunder", "gs@ezwh.com", "supplier", "hello");
  })
  testGetInternalOrdersIssued([{
    issueDate: "2021/11/29 09:33",
    state: "ISSUED",
    skuItems: [],
    customerId: 2,
    products: [{SKUId: 2, description: "New super cool mountain bike: CANYON STOIC 4", price: 1789, qty: 2}]
  }]);
});


async function testGetInternalOrdersIssued(orders){
  test("getRestockOrder", async () => {
    const order1 = await ic.createInternalOrder("2021/11/29 09:33", 2, [{SKUId: 2, description: "New super cool mountain bike: CANYON STOIC 4", price: 1789, qty: 2}]);
    const order2 = await ic. createInternalOrder("2022/05/05 09:33", 2, [{SKUId: 1, description: "Sweet restock of requested Acer Aspire 3", price: 237, qty: 1}]);
    await ic.changeStateOfInternalOrder(order2, "ACCEPTED");
    const result = await ic.getInternalOrdersIssued();
    expect(result.length).equal(1);
    expect(result[0]).to.deep.equal({
        id: order1,
        state: orders[0].state,
        issueDate: orders[0].issueDate,
        customerId: orders[0].customerId,
        products: orders[0].products
    });
  })
}




describe("Get restock order by id", () => {

  beforeEach(async () => {
      await ic.deleteAllInternalOrders();
      //await uc.deleteAll();
      //await sc.deleteAllSkus();
      //newSKU
      //userId = await uc.newUser("Giulio", "Sunder", "gs@ezwh.com", "supplier", "hello");
  })
  testGetInternalOrder("2021/11/29 09:33", 2, [{SKUId: 2, description: "New super cool mountain bike: CANYON STOIC 4", price: 1789, qty: 2}]);
});


async function testGetInternalOrder(issueDate, customerId, products){
  test("getRestockOrder", async () => {
    const order = await ic.createInternalOrder("2021/11/29 09:33", 2, [{SKUId: 2, description: "New super cool mountain bike: CANYON STOIC 4", price: 1789, qty: 2}]);
    const result = await ic.getInternalOrder(order);
    expect(result).to.deep.equal({
      id: order,
      state: "ISSUED",
      issueDate: issueDate,
      customerId: customerId,
      products: products
    })
  })
}





describe("Create new internal order and retrieve it by id", () => {

    beforeEach(async () => {
        await ic.deleteAllInternalOrders();
        //await uc.deleteAll();
        //await sc.deleteAllSkus();
        //newSKU
        //userId = await uc.newUser("Giulio", "Sunder", "gs@ezwh.com", "supplier", "hello");
    })
    testCreateInternalOrder("2021/11/29 09:33", 2, [{SKUId: 2, description: "New super cool mountain bike: CANYON STOIC 4", price: 1789, qty: 2}]);
    testCreateInternalOrderInvalidProducts("2021/11/29 09:33", 2, [{SKUId: 5, description: "New super cool mountain bike: CANYON STOIC 4", price: 1489, qty: 2}]);
    testCreateInternalOrderInvalidCustomer("2021/11/29 09:33", 1, [{SKUId: 2, description: "New super cool mountain bike: CANYON STOIC 4", price: 1789, qty: 2}]);
});


async function testCreateInternalOrder(issueDate, customerId, products){
  test("createRestockOrder", async () => {
    const orderId = await ic.createInternalOrder(issueDate, customerId, products);
    const order = await ic.getInternalOrder(orderId);
    expect(orderId).greaterThanOrEqual(1);
    expect(order).to.deep.equal({
      id: orderId,
      state: "ISSUED",
      issueDate: issueDate,
      customerId: customerId,
      products: products
    })
  })
}


async function testCreateInternalOrderInvalidProducts(issueDate, customerId, products){
    test("createRestockOrderInvalidProducts", async () => {
      const orderId = await ic.createInternalOrder(issueDate, customerId, products);
      const order = await ic.getInternalOrder(orderId);
      expect(orderId).equal(-1);
    })
}


async function testCreateInternalOrderInvalidCustomer(issueDate, customerId, products){
    test("createRestockOrderInvalidCustomer", async () => {
      const orderId = await ic.createInternalOrder(issueDate, customerId, products);
      const order = await ic.getInternalOrder(orderId);
      expect(orderId).equal(-2);
    })
}



describe("Modify state of internal order and retrieve it by id", () => {

  beforeEach(async () => {
      await ic.deleteAllInternalOrders();
      
      //await uc.deleteAll();
      //await sc.deleteAllSkus();
      //newSKU
      //userId = await uc.newUser("Giulio", "Sunder", "gs@ezwh.com", "supplier", "hello");
  })
  testModifyStateOfInternalOrderNotCompleted("2021/11/29 09:33", 2, [{SKUId: 2, description: "New super cool mountain bike: CANYON STOIC 4", price: 1789, qty: 2}], "ACCEPTED");
  testModifyStateOfInternalOrderCompleted("2021/11/29 09:33", 2, [{SKUId: 2, description: "New super cool mountain bike: CANYON STOIC 4", price: 1789, qty: 2}], [{SkuId: 2, RFID: "01234567890720456789012345782501"}])
});


async function testModifyStateOfInternalOrderNotCompleted(issueDate, customerId, products, newState) {
  test("changeStateOfRestockOrder", async () => {
    const order = await ic.createInternalOrder(issueDate, customerId, products);
    await ic.changeStateOfInternalOrder(order, newState);
    const result = await ic.getInternalOrder(order);
    //console.log(res);
    expect(result).to.deep.equal({
        id: order,
        state: newState,
        issueDate: issueDate,
        customerId: customerId,
        products: products
    });
  });
}


async function testModifyStateOfInternalOrderCompleted(issueDate, customerId, products, skuItems) {
    test("changeStateOfRestockOrderToCompleted", async () => {
        const order = await ic.createInternalOrder(issueDate, customerId, products);
        await ic.changeStateOfInternalOrder(order, "COMPLETED", skuItems);
        const resProducts = await ic.getSkuItemsForInternalOrder(order);
        const result = await ic.getInternalOrder(order);
      //console.log(res);
        expect(result).to.deep.equal({
          id: order,
          state: "COMPLETED",
          issueDate: issueDate,
          customerId: customerId,
          products: resProducts
        });
    });
}