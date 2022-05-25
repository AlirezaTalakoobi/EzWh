const returnC = require("../modules/Controller/ReturnOrderController");
const userC = require("../modules/Controller/UserController");
const skuC = require("../modules/Controller/SKUController");
const itemC = require("../modules/Controller/ItemController");
const skuItemC = require("../modules/Controller/SKUItemsController");
const restockC = require("../modules/Controller/RestockOrderController");

const DAO = require("../modules/DB/DAO");

const { expect } = require("chai");

const dao = new DAO();

const retc = new returnC(dao);
const rc = new restockC(dao);
const uc = new userC(dao);
const sc = new skuC(dao);
const ic = new itemC(dao);
const sic = new skuItemC(dao);


describe("Get return orders", () => {

  beforeEach(async () => {
      await retc.deleteAllReturnOrders();
      await rc.deleteAllRestockOrders();
      await sic.deleteAll();
      await uc.deleteAll();
      await sc.deleteAllSKU();
      await ic.deleteAll();
  })
  testGetReturnAllOrders();
});


async function testGetReturnAllOrders(){
  test("getReturnOrders", async () => {
    const user = await uc.newUser("Michael", "Jordan", "mj@ezwh.com", "supplier", "MJtheGOAT");
    
    const sku1 = await sc.newSKU({description: "Acer Aspire 3", weight: 100, volume: 20, price: 237, availableQuantity: 15});

    await ic.createItem(1, "official supply for acer aspire", 250, sku1.id, user.id);

    const order2 = await rc. createRestockOrder("2022/05/05 09:33", user.id, [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, qty: 10}]);

    await rc.changeStateOfRestockOrder(order2, "DELIVERED");

    const skuItems = [{SKUId: sku1.id, rfid: "01234567890123456789012345678901"}, {SKUId: sku1.id, rfid: "98765432109876543210987654321098"}];
    await rc.addSkuItemsToRestockOrder(order2, skuItems);

    const retOrder1 = await retc.createReturnOrder("2023/09/05", order2, [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, RFID: skuItems[0].rfid}]);
    const retOrder2 = await retc.createReturnOrder("2024/05/05", order2, [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, RFID: skuItems[1].rfid}]);

    const result = await retc.getReturnOrders();

    const expectedOrders = [{
      id: retOrder1,
      returnDate: "2023/09/05",
      restockOrderId: order2,
      products: [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, RFID: skuItems[0].rfid}]
    }, {
      id: retOrder2,
      returnDate: "2024/05/05",
      restockOrderId: order2,
      products: [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, RFID: skuItems[1].rfid}]
    }]
    
    expect(result.length).equal(2);
    expect(result).to.deep.equal(expectedOrders);
  })
}



describe("Get return order by id", () => {

    beforeEach(async () => {
        await retc.deleteAllReturnOrders();
        await rc.deleteAllRestockOrders();
        await sic.deleteAll();
        await uc.deleteAll();
        await sc.deleteAllSKU();
        await ic.deleteAll();
    })
    testGetReturnOrder();
});
  
  
  async function testGetReturnOrder(){
    test("getReturnOrder", async () => {
      const user = await uc.newUser("Michael", "Jordan", "mj@ezwh.com", "supplier", "MJtheGOAT");
      
      const sku1 = await sc.newSKU({description: "Acer Aspire 3", weight: 100, volume: 20, price: 237, availableQuantity: 15});
  
      await ic.createItem(1, "official supply for acer aspire", 250, sku1.id, user.id);
  
      const order2 = await rc. createRestockOrder("2022/05/05 09:33", user.id, [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, qty: 10}]);
  
      await rc.changeStateOfRestockOrder(order2, "DELIVERED");
  
      const skuItems = [{SKUId: sku1.id, rfid: "01234567890123456789012345678901"}, {SKUId: sku1.id, rfid: "98765432109876543210987654321098"}];
      await rc.addSkuItemsToRestockOrder(order2, skuItems);
  
      const retOrder1 = await retc.createReturnOrder("2023/09/05", order2, [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, RFID: skuItems[0].rfid}, {SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, RFID: skuItems[1].rfid}]);
  
      const result = await retc.getReturnOrder(retOrder1);
  
      const expectedOrder = {
        id: retOrder1,
        returnDate: "2023/09/05",
        restockOrderId: order2,
        products: [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, RFID: skuItems[0].rfid}, {SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, RFID: skuItems[1].rfid}]
      };

      expect(result).to.deep.equal(expectedOrder);
    })
}


describe("Create return order and retrieve it", () => {

    beforeEach(async () => {
        await retc.deleteAllReturnOrders();
        await rc.deleteAllRestockOrders();
        await sic.deleteAll();
        await uc.deleteAll();
        await sc.deleteAllSKU();
        await ic.deleteAll();
    })
    testCreateReturnOrder();
    testCreateReturnOrderRestockOrderNotFound();
    testCreateReturnOrderInvalidItemsWrongPrice();
    testCreateReturnOrderInvalidItemsWrongSKUIdForItem();
    testCreateReturnOrderInvalidItemsWrongDescription();
});

async function testCreateReturnOrder(){
    test("createReturnOrder", async () => {
      const user = await uc.newUser("Michael", "Jordan", "mj@ezwh.com", "supplier", "MJtheGOAT");
      
      const sku1 = await sc.newSKU({description: "Acer Aspire 3", weight: 100, volume: 20, price: 237, availableQuantity: 15});
  
      await ic.createItem(1, "official supply for acer aspire", 250, sku1.id, user.id);
  
      const order2 = await rc. createRestockOrder("2022/05/05 09:33", user.id, [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, qty: 10}]);
  
      await rc.changeStateOfRestockOrder(order2, "DELIVERED");
  
      const skuItems = [{SKUId: sku1.id, rfid: "01234567890123456789012345678901"}, {SKUId: sku1.id, rfid: "98765432109876543210987654321098"}];
      await rc.addSkuItemsToRestockOrder(order2, skuItems);
  
      const retOrder1 = await retc.createReturnOrder("2023/09/05", order2, [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, RFID: skuItems[0].rfid}, {SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, RFID: skuItems[1].rfid}]);
  
      const result = await retc.getReturnOrder(retOrder1);
  
      const expectedOrder = {
        id: retOrder1,
        returnDate: "2023/09/05",
        restockOrderId: order2,
        products: [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, RFID: skuItems[0].rfid}, {SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, RFID: skuItems[1].rfid}]
      };

      expect(retOrder1).greaterThanOrEqual(1);
      expect(result).to.deep.equal(expectedOrder);
    })
}


async function testCreateReturnOrderRestockOrderNotFound(){
  test("createReturnOrderRestockOrderNotFound", async () => {
    const user = await uc.newUser("Michael", "Jordan", "mj@ezwh.com", "supplier", "MJtheGOAT");
    
    const sku1 = await sc.newSKU({description: "Acer Aspire 3", weight: 100, volume: 20, price: 237, availableQuantity: 15});

    await ic.createItem(1, "official supply for acer aspire", 250, sku1.id, user.id);

    const order2 = await rc. createRestockOrder("2022/05/05 09:33", user.id, [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, qty: 10}]);

    await rc.changeStateOfRestockOrder(order2, "DELIVERED");

    const skuItems = [{SKUId: sku1.id, rfid: "01234567890123456789012345678901"}, {SKUId: sku1.id, rfid: "98765432109876543210987654321098"}];
    await rc.addSkuItemsToRestockOrder(order2, skuItems);

    const retOrder1 = await retc.createReturnOrder("2023/09/05", order2 + 1, [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, RFID: skuItems[0].rfid}, {SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, RFID: skuItems[1].rfid}]);

    expect(retOrder1).to.deep.equal(-1);
  })
}


async function testCreateReturnOrderInvalidItemsWrongPrice(){
  test("createReturnOrderWrongPrice", async () => {
    const user = await uc.newUser("Michael", "Jordan", "mj@ezwh.com", "supplier", "MJtheGOAT");
    
    const sku1 = await sc.newSKU({description: "Acer Aspire 3", weight: 100, volume: 20, price: 237, availableQuantity: 15});

    await ic.createItem(1, "official supply for acer aspire", 250, sku1.id, user.id);

    const order2 = await rc. createRestockOrder("2022/05/05 09:33", user.id, [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, qty: 10}]);

    await rc.changeStateOfRestockOrder(order2, "DELIVERED");

    const skuItems = [{SKUId: sku1.id, rfid: "01234567890123456789012345678901"}, {SKUId: sku1.id, rfid: "98765432109876543210987654321098"}];
    await rc.addSkuItemsToRestockOrder(order2, skuItems);

    const retOrder1 = await retc.createReturnOrder("2023/09/05", order2, [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 2500, RFID: skuItems[0].rfid}, {SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, RFID: skuItems[1].rfid}]);

    expect(retOrder1).to.deep.equal(-1);
  })
}


async function testCreateReturnOrderInvalidItemsWrongSKUIdForItem(){
  test("createReturnOrderWrongSKUIdForItem", async () => {
    const user = await uc.newUser("Michael", "Jordan", "mj@ezwh.com", "supplier", "MJtheGOAT");
    
    const sku1 = await sc.newSKU({description: "Acer Aspire 3", weight: 100, volume: 20, price: 237, availableQuantity: 15});

    await ic.createItem(1, "official supply for acer aspire", 250, sku1.id, user.id);

    const order2 = await rc. createRestockOrder("2022/05/05 09:33", user.id, [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, qty: 10}]);

    await rc.changeStateOfRestockOrder(order2, "DELIVERED");

    const skuItems = [{SKUId: sku1.id, rfid: "01234567890123456789012345678901"}, {SKUId: sku1.id, rfid: "98765432109876543210987654321098"}];
    await rc.addSkuItemsToRestockOrder(order2, skuItems);

    const retOrder1 = await retc.createReturnOrder("2023/09/05", order2, [{SKUId: sku1.id + 1, description: "Sweet restock of requested Acer Aspire 3", price: 250, RFID: skuItems[0].rfid}, {SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, RFID: skuItems[1].rfid}]);

    expect(retOrder1).to.deep.equal(-1);
  })
}


async function testCreateReturnOrderInvalidItemsWrongDescription(){
  test("createReturnOrderWrongDescription", async () => {
    const user = await uc.newUser("Michael", "Jordan", "mj@ezwh.com", "supplier", "MJtheGOAT");
    
    const sku1 = await sc.newSKU({description: "Acer Aspire 3", weight: 100, volume: 20, price: 237, availableQuantity: 15});

    await ic.createItem(1, "official supply for acer aspire", 250, sku1.id, user.id);

    const order2 = await rc. createRestockOrder("2022/05/05 09:33", user.id, [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, qty: 10}]);

    await rc.changeStateOfRestockOrder(order2, "DELIVERED");

    const skuItems = [{SKUId: sku1.id, rfid: "01234567890123456789012345678901"}, {SKUId: sku1.id, rfid: "98765432109876543210987654321098"}];
    await rc.addSkuItemsToRestockOrder(order2, skuItems);

    const retOrder1 = await retc.createReturnOrder("2023/09/05", order2, [{SKUId: sku1.id + 1, description: "Wrong description", price: 250, RFID: skuItems[0].rfid}, {SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, RFID: skuItems[1].rfid}]);

    expect(retOrder1).to.deep.equal(-1);
  })
}



describe("Delete return order", () => {

  beforeEach(async () => {
      await retc.deleteAllReturnOrders();
      await rc.deleteAllRestockOrders();
      await sic.deleteAll();
      await uc.deleteAll();
      await sc.deleteAllSKU();
      await ic.deleteAll();
  })
  testDeleteReturnOrder();
});


async function testDeleteReturnOrder(){
  test("deleteReturnOrder", async () => {
    const user = await uc.newUser("Michael", "Jordan", "mj@ezwh.com", "supplier", "MJtheGOAT");
    
    const sku1 = await sc.newSKU({description: "Acer Aspire 3", weight: 100, volume: 20, price: 237, availableQuantity: 15});

    await ic.createItem(1, "official supply for acer aspire", 250, sku1.id, user.id);

    const order2 = await rc. createRestockOrder("2022/05/05 09:33", user.id, [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, qty: 10}]);

    await rc.changeStateOfRestockOrder(order2, "DELIVERED");

    const skuItems = [{SKUId: sku1.id, rfid: "01234567890123456789012345678901"}, {SKUId: sku1.id, rfid: "98765432109876543210987654321098"}];
    await rc.addSkuItemsToRestockOrder(order2, skuItems);

    const retOrder1 = await retc.createReturnOrder("2023/09/05", order2, [{SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 2500, RFID: skuItems[0].rfid}, {SKUId: sku1.id, description: "Sweet restock of requested Acer Aspire 3", price: 250, RFID: skuItems[1].rfid}]);

    await retc.deleteReturnOrder(retOrder1);

    const result = await retc.getReturnOrder(retOrder1);

    expect(result).to.deep.equal(-1);
  })
}







// describe("Delete a restock order", () => {

//   beforeEach(async () => {
//     await rc.deleteAllRestockOrders();
//     await uc.deleteAll();
//     await sc.deleteAllSKU();
//     await ic.deleteAll();
//   })
//   testDeleteRestockOrder();
// });


// async function testDeleteRestockOrder() {
//   test("deleteRestockOrder", async () => {
//     const user = await uc.newUser("Michael", "Jordan", "mj@ezwh.com", "supplier", "MJtheGOAT");
    
//     const sku2 = await sc.newSKU({description: "Canyon Stoic 4", weight: 14000, volume: 400, price: 1789, availableQuantity: 10});

//     await ic.createItem(2, "official supply for canyon stoic", 1500, sku2.id, user.id);

//     const order1 = await rc. createRestockOrder("2021/11/29 09:33", user.id, [{SKUId: sku2.id, description: "New super cool mountain bike: CANYON STOIC 4", price: 1500, qty: 5}]);

//     await rc.deleteRestockOrder(order1);
//     const result = await rc.getRestockOrder(order1);

//     expect(result).to.deep.equal(-1);
//   });
// }