const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const app = require("../server");
var agent = chai.request.agent(app);

describe("test new restock order api", () => {
    beforeEach(async () => {
        await agent.delete("/api/restockOrders");
        await agent.delete("/api/deleteAllUsers");
        await agent.delete("/api/skus");
        await agent.delete("/api/items");
    });
    createRestockOrder();
    createRestockOrderInvalidFormat();
    createRestockOrderWrongPrice();
    //getRestockOrder(200, {});
});


describe("test get restock orders", () => {
    beforeEach(async () => {
        await agent.delete("/api/restockOrders");
        await agent.delete("/api/deleteAllUsers");
        await agent.delete("/api/skus");
        await agent.delete("/api/items");
    });
    getRestockOrders();
    //getRestockOrder(200, {});
});


describe("modify state of restock order", () => {
    beforeEach(async () => {
        await agent.delete("/api/restockOrders");
        await agent.delete("/api/deleteAllUsers");
        await agent.delete("/api/skus");
        await agent.delete("/api/items");
    });
    changeStateOfRestockOrder();
    changeStateOfRestockOrderInvalidState();
    //getRestockOrder(200, {});
});


describe("add sku items to a restock order", () => {
    beforeEach(async () => {
        await agent.delete("/api/restockOrders");
        await agent.delete("/api/deleteAllUsers");
        await agent.delete("/api/skus");
        await agent.delete("/api/items");
        await agent.delete("/api/skuitems");
    });
    addSkuItemsToRestockOrder();
    addSkuItemsToRestockOrderNotDelivered();
    addSkuItemsToRestockOrderNotFound();
});


describe("add transport note to restock order", () => {
    beforeEach(async () => {
        await agent.delete("/api/restockOrders");
        await agent.delete("/api/deleteAllUsers");
        await agent.delete("/api/skus");
        await agent.delete("/api/items");
        await agent.delete("/api/skuitems");
    });
    addTransportNoteToRestockOrder();
    addTransportNoteToRestockOrderIncorrectFormat();
    addTransportNoteToRestockOrderNotDelivered();
});


describe("delete a restock order with given id", () => {
    beforeEach(async () => {
        await agent.delete("/api/restockOrders");
        await agent.delete("/api/deleteAllUsers");
        await agent.delete("/api/skus");
        await agent.delete("/api/items");
        await agent.delete("/api/skuitems");
    });
    deleteRestockOrder();
});


function createRestockOrder() {
    it("creating new order",async function () {
        const supplier = await agent.post("/api/newUser").send({name: "Giulio", surname: "Sunder", username: "gs@ezwh.com", password: "abcdefghi", type: "supplier"});

        const sku1 = await agent.post("/api/sku").send({
                "description" : "Nukeproof Scout",
                "weight" : 13000,
                "volume" : 15000,
                "notes" : "Good quality hardtail MTB",
                "price" : 2750,
                "availableQuantity" : 10
        });
        const sku2 = await agent.post("/api/sku").send({
            "description" : "Canyon Stoic",
            "weight" : 15000,
            "volume" : 18000,
            "notes" : "Good quality enduro hardtail MTB",
            "price" : 1700,
            "availableQuantity" : 5
        });

        const item1 = await agent.post("/api/item").send({
                "id" : 51,
                "description" : "Supply for nukeproof",
                "price" : 2500,
                "SKUId" : sku1.body.id,
                "supplierId" : supplier.body.id
        });

        const item2 = await agent.post("/api/item").send({
            "id" : 61,
            "description" : "Supply for canyon",
            "price" : 1500,
            "SKUId" : sku2.body.id,
            "supplierId" : supplier.body.id
        });

        const order = await agent.post("/api/restockOrder").send({
                "issueDate": "2021/11/29 09:33",
                "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3}, {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
                "supplierId" : supplier.body.id
        });
        order.should.have.status(201);

        const expectedOrder = {
            "id": order.body.id,
            "issueDate": "2021/11/29 09:33",
            "state": "ISSUED",
            "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3},
                        {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
            "skuItems": [],
            "supplierId" : supplier.body.id
        };

        const result = await agent.get("/api/restockOrder/" + order.body.id);
        console.log(result.body)
        console.log(expectedOrder)
        expect(result.body).to.deep.equal(expectedOrder);
    });
}


function createRestockOrderInvalidFormat() {
    it("creating new order invalid format",async function () {
        const supplier = await agent.post("/api/newUser").send({name: "Giulio", surname: "Sunder", username: "gs@ezwh.com", password: "abcdefghi", type: "supplier"});

        const sku1 = await agent.post("/api/sku").send({
                "description" : "Nukeproof Scout",
                "weight" : 13000,
                "volume" : 15000,
                "notes" : "Good quality hardtail MTB",
                "price" : 2750,
                "availableQuantity" : 10
        });
        const sku2 = await agent.post("/api/sku").send({
            "description" : "Canyon Stoic",
            "weight" : 15000,
            "volume" : 18000,
            "notes" : "Good quality enduro hardtail MTB",
            "price" : 1700,
            "availableQuantity" : 5
        });

        const item1 = await agent.post("/api/item").send({
                "id" : 51,
                "description" : "Supply for nukeproof",
                "price" : 2500,
                "SKUId" : sku1.body.id,
                "supplierId" : supplier.body.id
        });

        const item2 = await agent.post("/api/item").send({
            "id" : 61,
            "description" : "Supply for canyon",
            "price" : 1500,
            "SKUId" : sku2.body.id,
            "supplierId" : supplier.body.id
        });

        const order = await agent.post("/api/restockOrder").send({
                "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3}, {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
                "supplierId" : supplier.body.id
        });
        order.should.have.status(422);

        expect(order.body.error).to.equal("Request Format Incorrect");
    });
}

function createRestockOrderWrongPrice() {
    it("creating new order wrong price different",async function () {
        const supplier = await agent.post("/api/newUser").send({name: "Giulio", surname: "Sunder", username: "gs@ezwh.com", password: "abcdefghi", type: "supplier"});

        const sku1 = await agent.post("/api/sku").send({
                "description" : "Nukeproof Scout",
                "weight" : 13000,
                "volume" : 15000,
                "notes" : "Good quality hardtail MTB",
                "price" : 2750,
                "availableQuantity" : 10
        });
        const sku2 = await agent.post("/api/sku").send({
            "description" : "Canyon Stoic",
            "weight" : 15000,
            "volume" : 18000,
            "notes" : "Good quality enduro hardtail MTB",
            "price" : 1700,
            "availableQuantity" : 5
        });

        const item1 = await agent.post("/api/item").send({
                "id" : 51,
                "description" : "Supply for nukeproof",
                "price" : 2500,
                "SKUId" : sku1.body.id,
                "supplierId" : supplier.body.id
        });

        const item2 = await agent.post("/api/item").send({
            "id" : 61,
            "description" : "Supply for canyon",
            "price" : 1500,
            "SKUId" : sku2.body.id,
            "supplierId" : supplier.body.id
        });

        const order = await agent.post("/api/restockOrder").send({
                "issueDate": "2022/09/05 06:53",
                "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2600,"qty":3}, {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
                "supplierId" : supplier.body.id
        });
        order.should.have.status(422);

        expect(order.body.error).to.equal("Wrong data");
    });
}


function getRestockOrders() {
    it("getting all restock orders",async function () {
        const supplier = await agent.post("/api/newUser").send({name: "Giulio", surname: "Sunder", username: "gs@ezwh.com", password: "abcdefghi", type: "supplier"});

        const sku1 = await agent.post("/api/sku").send({
                "description" : "Nukeproof Scout",
                "weight" : 13000,
                "volume" : 15000,
                "notes" : "Good quality hardtail MTB",
                "price" : 2750,
                "availableQuantity" : 10
        });
        const sku2 = await agent.post("/api/sku").send({
            "description" : "Canyon Stoic",
            "weight" : 15000,
            "volume" : 18000,
            "notes" : "Good quality enduro hardtail MTB",
            "price" : 1700,
            "availableQuantity" : 5
        });

        const item1 = await agent.post("/api/item").send({
                "id" : 51,
                "description" : "Supply for nukeproof",
                "price" : 2500,
                "SKUId" : sku1.body.id,
                "supplierId" : supplier.body.id
        });

        const item2 = await agent.post("/api/item").send({
            "id" : 61,
            "description" : "Supply for canyon",
            "price" : 1500,
            "SKUId" : sku2.body.id,
            "supplierId" : supplier.body.id
        });

        const order1 = await agent.post("/api/restockOrder").send({
                "issueDate": "2022/09/05 06:53",
                "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3}, {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
                "supplierId" : supplier.body.id
        });

        const order2 = await agent.post("/api/restockOrder").send({
            "issueDate": "2020/05/05 19:27",
            "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":10}],
            "supplierId" : supplier.body.id
        });

        order1.should.have.status(201);
        order2.should.have.status(201);

        const expectedOrders = [{
            "id": order1.body.id,
            "issueDate": "2022/09/05 06:53",
            "state": "ISSUED",
            "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3},
                        {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
            "skuItems": [],
            "supplierId" : supplier.body.id
        }, {
            "id": order2.body.id,
            "issueDate": "2020/05/05 19:27",
            "state": "ISSUED",
            "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":10}],
            "skuItems": [],
            "supplierId" : supplier.body.id
        }];

        const result = await agent.get("/api/restockOrders");
        expect(result.body).to.deep.equal(expectedOrders);
    });
}



function changeStateOfRestockOrder() {
    it("changing state of restock order",async function () {
        const supplier = await agent.post("/api/newUser").send({name: "Giulio", surname: "Sunder", username: "gs@ezwh.com", password: "abcdefghi", type: "supplier"});

        const sku1 = await agent.post("/api/sku").send({
                "description" : "Nukeproof Scout",
                "weight" : 13000,
                "volume" : 15000,
                "notes" : "Good quality hardtail MTB",
                "price" : 2750,
                "availableQuantity" : 10
        });
        const sku2 = await agent.post("/api/sku").send({
            "description" : "Canyon Stoic",
            "weight" : 15000,
            "volume" : 18000,
            "notes" : "Good quality enduro hardtail MTB",
            "price" : 1700,
            "availableQuantity" : 5
        });

        const item1 = await agent.post("/api/item").send({
                "id" : 51,
                "description" : "Supply for nukeproof",
                "price" : 2500,
                "SKUId" : sku1.body.id,
                "supplierId" : supplier.body.id
        });

        const item2 = await agent.post("/api/item").send({
            "id" : 61,
            "description" : "Supply for canyon",
            "price" : 1500,
            "SKUId" : sku2.body.id,
            "supplierId" : supplier.body.id
        });

        const order1 = await agent.post("/api/restockOrder").send({
                "issueDate": "2022/09/05 06:53",
                "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3}, {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
                "supplierId" : supplier.body.id
        });

        order1.should.have.status(201);

        await agent.put("/api/restockOrder/" + order1.body.id).send({
            "newState": "DELIVERED"
        });

        const expectedOrder = {
            "id": order1.body.id,
            "issueDate": "2022/09/05 06:53",
            "state": "DELIVERED",
            "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3},
                        {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
            "skuItems": [],
            "supplierId" : supplier.body.id
        };

        const result = await agent.get("/api/restockOrder/" + order1.body.id);
        expect(result.body).to.deep.equal(expectedOrder);
    });
}


function changeStateOfRestockOrderInvalidState() {
    it("changing state of restock order to an invalid state",async function () {
        const supplier = await agent.post("/api/newUser").send({name: "Giulio", surname: "Sunder", username: "gs@ezwh.com", password: "abcdefghi", type: "supplier"});

        const sku1 = await agent.post("/api/sku").send({
                "description" : "Nukeproof Scout",
                "weight" : 13000,
                "volume" : 15000,
                "notes" : "Good quality hardtail MTB",
                "price" : 2750,
                "availableQuantity" : 10
        });
        const sku2 = await agent.post("/api/sku").send({
            "description" : "Canyon Stoic",
            "weight" : 15000,
            "volume" : 18000,
            "notes" : "Good quality enduro hardtail MTB",
            "price" : 1700,
            "availableQuantity" : 5
        });

        const item1 = await agent.post("/api/item").send({
                "id" : 51,
                "description" : "Supply for nukeproof",
                "price" : 2500,
                "SKUId" : sku1.body.id,
                "supplierId" : supplier.body.id
        });

        const item2 = await agent.post("/api/item").send({
            "id" : 61,
            "description" : "Supply for canyon",
            "price" : 1500,
            "SKUId" : sku2.body.id,
            "supplierId" : supplier.body.id
        });

        const order1 = await agent.post("/api/restockOrder").send({
                "issueDate": "2022/09/05 06:53",
                "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3}, {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
                "supplierId" : supplier.body.id
        });

        order1.should.have.status(201);

        const result = await agent.put("/api/restockOrder/" + order1.body.id).send({
            "newState": "THIS IS AN INVALID STATE"
        });
        result.should.have.status(422);

        expect(result.body.error).equal("Request Format Incorrect");
    });
}


function addSkuItemsToRestockOrder() {
    it("adding sku items to a restock order in DELIVERED state",async function () {
        const supplier = await agent.post("/api/newUser").send({name: "Giulio", surname: "Sunder", username: "gs@ezwh.com", password: "abcdefghi", type: "supplier"});

        const sku1 = await agent.post("/api/sku").send({
                "description" : "Nukeproof Scout",
                "weight" : 13000,
                "volume" : 15000,
                "notes" : "Good quality hardtail MTB",
                "price" : 2750,
                "availableQuantity" : 10
        });
        const sku2 = await agent.post("/api/sku").send({
            "description" : "Canyon Stoic",
            "weight" : 15000,
            "volume" : 18000,
            "notes" : "Good quality enduro hardtail MTB",
            "price" : 1700,
            "availableQuantity" : 5
        });

        const item1 = await agent.post("/api/item").send({
                "id" : 51,
                "description" : "Supply for nukeproof",
                "price" : 2500,
                "SKUId" : sku1.body.id,
                "supplierId" : supplier.body.id
        });

        const item2 = await agent.post("/api/item").send({
            "id" : 61,
            "description" : "Supply for canyon",
            "price" : 1500,
            "SKUId" : sku2.body.id,
            "supplierId" : supplier.body.id
        });

        const order1 = await agent.post("/api/restockOrder").send({
                "issueDate": "2022/09/05 06:53",
                "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3}, {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
                "supplierId" : supplier.body.id
        });

        order1.should.have.status(201);

        await agent.put("/api/restockOrder/" + order1.body.id).send({
            "newState": "DELIVERED"
        });

        const skuItems = [{"SKUId":sku1.body.id, "rfid":"12345678901234567890123456789016"},{"SKUId":sku2.body.id,"rfid":"12345678901234567890123456789017"}];
        
        await agent.put("/api/restockOrder/" + order1.body.id + "/skuItems").send({
            "skuItems": skuItems
        });

        const result = await agent.get("/api/restockOrder/" + order1.body.id);

        const expectedOrder = {
            "id": order1.body.id,
            "issueDate": "2022/09/05 06:53",
            "state": "DELIVERED",
            "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3},
                        {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
            "skuItems": skuItems,
            "supplierId" : supplier.body.id
        }

        expect(result.body).to.deep.equal(expectedOrder);
    });
}


function addSkuItemsToRestockOrderNotDelivered() {
    it("adding sku items to a restock order NOT in DELIVERED state",async function () {
        const supplier = await agent.post("/api/newUser").send({name: "Giulio", surname: "Sunder", username: "gs@ezwh.com", password: "abcdefghi", type: "supplier"});

        const sku1 = await agent.post("/api/sku").send({
                "description" : "Nukeproof Scout",
                "weight" : 13000,
                "volume" : 15000,
                "notes" : "Good quality hardtail MTB",
                "price" : 2750,
                "availableQuantity" : 10
        });
        const sku2 = await agent.post("/api/sku").send({
            "description" : "Canyon Stoic",
            "weight" : 15000,
            "volume" : 18000,
            "notes" : "Good quality enduro hardtail MTB",
            "price" : 1700,
            "availableQuantity" : 5
        });

        const item1 = await agent.post("/api/item").send({
                "id" : 51,
                "description" : "Supply for nukeproof",
                "price" : 2500,
                "SKUId" : sku1.body.id,
                "supplierId" : supplier.body.id
        });

        const item2 = await agent.post("/api/item").send({
            "id" : 61,
            "description" : "Supply for canyon",
            "price" : 1500,
            "SKUId" : sku2.body.id,
            "supplierId" : supplier.body.id
        });

        const order1 = await agent.post("/api/restockOrder").send({
                "issueDate": "2022/09/05 06:53",
                "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3}, {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
                "supplierId" : supplier.body.id
        });

        order1.should.have.status(201);

        const skuItems = [{"SKUId":sku1.body.id, "rfid":"12345678901234567890123456789016"},{"SKUId":sku2.body.id,"rfid":"12345678901234567890123456789017"}];
        
        const result1 =  await agent.put("/api/restockOrder/" + order1.body.id + "/skuItems").send({
            "skuItems": skuItems
        });

        result1.should.have.status(422);

        const result = await agent.get("/api/restockOrder/" + order1.body.id);

        const expectedOrder = {
            "id": order1.body.id,
            "issueDate": "2022/09/05 06:53",
            "state": "ISSUED",
            "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3},
                        {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
            "skuItems": [],
            "supplierId" : supplier.body.id
        }

        expect(result1.body.error).equal("Order Not In Delivered State");
        expect(result.body).to.deep.equal(expectedOrder);
    });
}


function addSkuItemsToRestockOrderNotFound() {
    it("adding sku items to a restock order NOT in DELIVERED state",async function () {
        const supplier = await agent.post("/api/newUser").send({name: "Giulio", surname: "Sunder", username: "gs@ezwh.com", password: "abcdefghi", type: "supplier"});

        const sku1 = await agent.post("/api/sku").send({
                "description" : "Nukeproof Scout",
                "weight" : 13000,
                "volume" : 15000,
                "notes" : "Good quality hardtail MTB",
                "price" : 2750,
                "availableQuantity" : 10
        });
        const sku2 = await agent.post("/api/sku").send({
            "description" : "Canyon Stoic",
            "weight" : 15000,
            "volume" : 18000,
            "notes" : "Good quality enduro hardtail MTB",
            "price" : 1700,
            "availableQuantity" : 5
        });

        const item1 = await agent.post("/api/item").send({
                "id" : 51,
                "description" : "Supply for nukeproof",
                "price" : 2500,
                "SKUId" : sku1.body.id,
                "supplierId" : supplier.body.id
        });

        const item2 = await agent.post("/api/item").send({
            "id" : 61,
            "description" : "Supply for canyon",
            "price" : 1500,
            "SKUId" : sku2.body.id,
            "supplierId" : supplier.body.id
        });

        const order1 = await agent.post("/api/restockOrder").send({
                "issueDate": "2022/09/05 06:53",
                "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3}, {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
                "supplierId" : supplier.body.id
        });

        order1.should.have.status(201);

        const skuItems = [{"SKUId":sku1.body.id, "rfid":"12345678901234567890123456789016"},{"SKUId":sku2.body.id,"rfid":"12345678901234567890123456789017"}];
        
        const result1 =  await agent.put("/api/restockOrder/" + (order1.body.id + 5) + "/skuItems").send({
            "skuItems": skuItems
        });

        result1.should.have.status(404);

        expect(result1.body.error).equal("Order Not Found");
    });
}


function addTransportNoteToRestockOrder() {
    it("adding transport note to restock order",async function () {
        const supplier = await agent.post("/api/newUser").send({name: "Giulio", surname: "Sunder", username: "gs@ezwh.com", password: "abcdefghi", type: "supplier"});

        const sku1 = await agent.post("/api/sku").send({
                "description" : "Nukeproof Scout",
                "weight" : 13000,
                "volume" : 15000,
                "notes" : "Good quality hardtail MTB",
                "price" : 2750,
                "availableQuantity" : 10
        });
        const sku2 = await agent.post("/api/sku").send({
            "description" : "Canyon Stoic",
            "weight" : 15000,
            "volume" : 18000,
            "notes" : "Good quality enduro hardtail MTB",
            "price" : 1700,
            "availableQuantity" : 5
        });

        const item1 = await agent.post("/api/item").send({
                "id" : 51,
                "description" : "Supply for nukeproof",
                "price" : 2500,
                "SKUId" : sku1.body.id,
                "supplierId" : supplier.body.id
        });

        const item2 = await agent.post("/api/item").send({
            "id" : 61,
            "description" : "Supply for canyon",
            "price" : 1500,
            "SKUId" : sku2.body.id,
            "supplierId" : supplier.body.id
        });

        const order1 = await agent.post("/api/restockOrder").send({
                "issueDate": "2022/09/05 06:53",
                "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3}, {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
                "supplierId" : supplier.body.id
        });

        order1.should.have.status(201);

        await agent.put("/api/restockOrder/" + order1.body.id).send({
            "newState": "DELIVERED"
        });

        const transportNote = {deliveryDate: "2022/05/25"};

        const result1 = await agent.put("/api/restockOrder/" + order1.body.id + "/transportNote").send({
            "transportNote": transportNote
        });

        result1.should.have.status(200);

        const result = await agent.get("/api/restockOrder/" + order1.body.id);

        const expectedOrder = {
            "id": order1.body.id,
            "issueDate": "2022/09/05 06:53",
            "state": "DELIVERED",
            "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3},
                        {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
            "skuItems": [],
            "transportNote": transportNote,
            "supplierId" : supplier.body.id
        }

        expect(result.body).to.deep.equal(expectedOrder);
    });
}



function addTransportNoteToRestockOrderIncorrectFormat() {
    it("adding transport note to restock order",async function () {
        const supplier = await agent.post("/api/newUser").send({name: "Giulio", surname: "Sunder", username: "gs@ezwh.com", password: "abcdefghi", type: "supplier"});

        const sku1 = await agent.post("/api/sku").send({
                "description" : "Nukeproof Scout",
                "weight" : 13000,
                "volume" : 15000,
                "notes" : "Good quality hardtail MTB",
                "price" : 2750,
                "availableQuantity" : 10
        });
        const sku2 = await agent.post("/api/sku").send({
            "description" : "Canyon Stoic",
            "weight" : 15000,
            "volume" : 18000,
            "notes" : "Good quality enduro hardtail MTB",
            "price" : 1700,
            "availableQuantity" : 5
        });

        const item1 = await agent.post("/api/item").send({
                "id" : 51,
                "description" : "Supply for nukeproof",
                "price" : 2500,
                "SKUId" : sku1.body.id,
                "supplierId" : supplier.body.id
        });

        const item2 = await agent.post("/api/item").send({
            "id" : 61,
            "description" : "Supply for canyon",
            "price" : 1500,
            "SKUId" : sku2.body.id,
            "supplierId" : supplier.body.id
        });

        const order1 = await agent.post("/api/restockOrder").send({
                "issueDate": "2022/09/05 06:53",
                "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3}, {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
                "supplierId" : supplier.body.id
        });

        order1.should.have.status(201);

        await agent.put("/api/restockOrder/" + order1.body.id).send({
            "newState": "DELIVERED"
        });

        const transportNote = {DateOfDelivery: "2022/05/25"};

        const result1 = await agent.put("/api/restockOrder/" + order1.body.id + "/transportNote").send({
            "transportNote": transportNote
        });

        result1.should.have.status(422);

        const result = await agent.get("/api/restockOrder/" + order1.body.id);

        const expectedOrder = {
            "id": order1.body.id,
            "issueDate": "2022/09/05 06:53",
            "state": "DELIVERED",
            "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3},
                        {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
            "skuItems": [],
            "supplierId" : supplier.body.id
        }

        expect(result1.body.error).equal("Request Format Incorrect");
        expect(result.body).to.deep.equal(expectedOrder);
    });
}


function addTransportNoteToRestockOrderNotDelivered() {
    it("adding transport note to restock order not delivered",async function () {
        const supplier = await agent.post("/api/newUser").send({name: "Giulio", surname: "Sunder", username: "gs@ezwh.com", password: "abcdefghi", type: "supplier"});

        const sku1 = await agent.post("/api/sku").send({
                "description" : "Nukeproof Scout",
                "weight" : 13000,
                "volume" : 15000,
                "notes" : "Good quality hardtail MTB",
                "price" : 2750,
                "availableQuantity" : 10
        });
        const sku2 = await agent.post("/api/sku").send({
            "description" : "Canyon Stoic",
            "weight" : 15000,
            "volume" : 18000,
            "notes" : "Good quality enduro hardtail MTB",
            "price" : 1700,
            "availableQuantity" : 5
        });

        const item1 = await agent.post("/api/item").send({
                "id" : 51,
                "description" : "Supply for nukeproof",
                "price" : 2500,
                "SKUId" : sku1.body.id,
                "supplierId" : supplier.body.id
        });

        const item2 = await agent.post("/api/item").send({
            "id" : 61,
            "description" : "Supply for canyon",
            "price" : 1500,
            "SKUId" : sku2.body.id,
            "supplierId" : supplier.body.id
        });

        const order1 = await agent.post("/api/restockOrder").send({
                "issueDate": "2022/09/05 06:53",
                "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3}, {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
                "supplierId" : supplier.body.id
        });

        order1.should.have.status(201);

        const transportNote = {deliveryDate: "2022/05/25"};

        const result1 = await agent.put("/api/restockOrder/" + order1.body.id + "/transportNote").send({
            "transportNote": transportNote
        });

        result1.should.have.status(422);

        const result = await agent.get("/api/restockOrder/" + order1.body.id);

        const expectedOrder = {
            "id": order1.body.id,
            "issueDate": "2022/09/05 06:53",
            "state": "ISSUED",
            "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3},
                        {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
            "skuItems": [],
            "supplierId" : supplier.body.id
        }

        expect(result1.body.error).equal("Order not in state DELIVERED");
        expect(result.body).to.deep.equal(expectedOrder);
    });
}


function deleteRestockOrder() {
    it("deleting a restock order",async function () {
        const supplier = await agent.post("/api/newUser").send({name: "Giulio", surname: "Sunder", username: "gs@ezwh.com", password: "abcdefghi", type: "supplier"});

        const sku1 = await agent.post("/api/sku").send({
                "description" : "Nukeproof Scout",
                "weight" : 13000,
                "volume" : 15000,
                "notes" : "Good quality hardtail MTB",
                "price" : 2750,
                "availableQuantity" : 10
        });
        const sku2 = await agent.post("/api/sku").send({
            "description" : "Canyon Stoic",
            "weight" : 15000,
            "volume" : 18000,
            "notes" : "Good quality enduro hardtail MTB",
            "price" : 1700,
            "availableQuantity" : 5
        });

        const item1 = await agent.post("/api/item").send({
                "id" : 51,
                "description" : "Supply for nukeproof",
                "price" : 2500,
                "SKUId" : sku1.body.id,
                "supplierId" : supplier.body.id
        });

        const item2 = await agent.post("/api/item").send({
            "id" : 61,
            "description" : "Supply for canyon",
            "price" : 1500,
            "SKUId" : sku2.body.id,
            "supplierId" : supplier.body.id
        });

        const order1 = await agent.post("/api/restockOrder").send({
                "issueDate": "2022/09/05 06:53",
                "products": [{"SKUId":sku1.body.id, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3}, {"SKUId":sku2.body.id, "description":"ordering a batch of canyon stoic","price":1500,"qty":4}],
                "supplierId" : supplier.body.id
        });

        order1.should.have.status(201);

        const result1 = await agent.delete("/api/restockOrder/" + order1.body.id);
        result1.should.have.status(204);

        const result = await agent.get("/api/restockOrder/" + order1.body.id);
        result.should.have.status(404);

        expect(result.body.error).equal("Order Not Found");
    });
}