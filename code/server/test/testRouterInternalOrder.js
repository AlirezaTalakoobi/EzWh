const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const res = require("express/lib/response");
chai.use(chaiHttp);
chai.should();

const app = require("../server");
var agent = chai.request.agent(app);

async function setupCustomer(name, surname, username, password){
    const customer = await agent.post("/api/newUser").send({
        name: name,
        surname: surname,
        username: username,
        password: password,
        type: "customer"
    });
    return customer.body.id;
}

async function setupSku(description, weight, volume, notes, price, quantity){
    const sku = await agent.post("/api/sku").send({
        "description" : description,
        "weight" : weight,
        "volume" : volume,
        "notes" : notes,
        "price" : price,
        "availableQuantity" : quantity
    });
    return sku.body.id;
}


async function setupSkuItem(rfid, skuId){
    const skuItem = await agent.post("/api/skuitem").send({
        "RFID": rfid,
        "SKUId": skuId
    });
    console.log(skuItem.status)
    return skuItem;
}


describe("test new internal order", () => {
    beforeEach(async () => {
        await agent.delete("/api/internalOrders");
        await agent.delete("/api/deleteAllUsers");
        await agent.delete("/api/skus");
    });
    createInternalOrder();
    createInternalOrderIncorrectFormatRequest();
    createInternalOrderQuantityTooHigh();
    createInternalOrderWrongPrice();
});


describe("get internal orders", () => {
    beforeEach(async () => {
        await agent.delete("/api/internalOrders");
        await agent.delete("/api/deleteAllUsers");
        await agent.delete("/api/skus");
    });
    getInternalOrders();
    getInternalOrdersIssued();
    getInternalOrdersAccepted();
});


describe("change state of internal orders", () => {
    beforeEach(async () => {
        await agent.delete("/api/internalOrders");
        await agent.delete("/api/deleteAllUsers");
        await agent.delete("/api/skus");
        await agent.delete("/api/skuitems");
    });
    changeStateOfInternalOrder();
    changeStateOfInternalOrderToCompletedWithAddedItems();
    changeStateOfInternalOrderToNotCompletedWithAddedItems();
});


describe("delete internal order by id", () => {
    beforeEach(async () => {
        await agent.delete("/api/internalOrders");
        await agent.delete("/api/deleteAllUsers");
        await agent.delete("/api/skus");
    });
    deleteInternalOrder();
});


function createInternalOrder(){
    it("creating a new internal order", async function(){
        const customer = await setupCustomer("Giulio", "Sunder", "gs@ezwh.com", "thisisasecurepassword");
        const sku1 = await setupSku("Nukeproof Scout", 13000, 15000, "Good quality hardtail MTB", 2750, 10);
        const sku2 = await setupSku("Canyon Stoic", 15000, 18000, "Good quality enduro hardtail", 1700, 3);

        const order = await agent.post("/api/internalOrder").send({
            "issueDate": "2021/11/29 09:33",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2750,"qty":3}, {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty":1}],
            "customerId" : customer
        });

        order.should.have.status(201);
        const expectedOrder = {
            "id": order.body.id,
            "issueDate": "2021/11/29 09:33",
            "state": "ISSUED",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2750,"qty":3},
                        {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty":1}],
            "customerId" : customer
        };
        const result = await agent.get("/api/internalOrder/" + order.body.id);
        result.should.have.status(200);
        expect(result.body).to.deep.equal(expectedOrder);
    });
}


function createInternalOrderIncorrectFormatRequest(){
    it("creating a new internal order", async function(){
        const customer = await setupCustomer("Giulio", "Sunder", "gs@ezwh.com", "thisisasecurepassword");
        const sku1 = await setupSku("Nukeproof Scout", 13000, 15000, "Good quality hardtail MTB", 2750, 10);
        const sku2 = await setupSku("Canyon Stoic", 15000, 18000, "Good quality enduro hardtail", 1700, 3);

        const order = await agent.post("/api/internalOrder").send({
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2750,"qty":3}, {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty":1}],
            "customerId" : customer
        });

        order.should.have.status(422);

        expect(order.body.error).equal("Request Format Incorrect");
    });
}


function createInternalOrderQuantityTooHigh(){
    it("creating a new internal order: quantity too high", async function(){
        const customer = await setupCustomer("Giulio", "Sunder", "gs@ezwh.com", "thisisasecurepassword");
        const sku1 = await setupSku("Nukeproof Scout", 13000, 15000, "Good quality hardtail MTB", 2750, 10);
        const sku2 = await setupSku("Canyon Stoic", 15000, 18000, "Good quality enduro hardtail", 1700, 3);

        const order = await agent.post("/api/internalOrder").send({
            "issueDate": "2021/11/29 09:33",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2750,"qty":30}, {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty":1}],
            "customerId" : customer
        });

        order.should.have.status(422);

        expect(order.body.error).equal("Invalid products");
    });
}


function createInternalOrderWrongPrice(){
    it("creating a new internal order: wrong unit price", async function(){
        const customer = await setupCustomer("Giulio", "Sunder", "gs@ezwh.com", "thisisasecurepassword");
        const sku1 = await setupSku("Nukeproof Scout", 13000, 15000, "Good quality hardtail MTB", 2750, 10);
        const sku2 = await setupSku("Canyon Stoic", 15000, 18000, "Good quality enduro hardtail", 1700, 3);

        const order = await agent.post("/api/internalOrder").send({
            "issueDate": "2021/11/29 09:33",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2750,"qty":3}, {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1750,"qty":1}],
            "customerId" : customer
        });

        order.should.have.status(422);

        expect(order.body.error).equal("Invalid products");
    });
}


function getInternalOrders(){
    it("retrieving all internal orders", async function(){
        const customer = await setupCustomer("Giulio", "Sunder", "gs@ezwh.com", "thisisasecurepassword");
        const sku1 = await setupSku("Nukeproof Scout", 13000, 15000, "Good quality hardtail MTB", 2750, 10);
        const sku2 = await setupSku("Canyon Stoic", 15000, 18000, "Good quality enduro hardtail", 1700, 3);

        const order1 = await agent.post("/api/internalOrder").send({
            "issueDate": "2021/11/29 09:33",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2750,"qty":3}, {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty":1}],
            "customerId" : customer
        });

        const order2 = await agent.post("/api/internalOrder").send({
            "issueDate": "2023/03/04 19:33",
            "products": [{"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty":2}],
            "customerId" : customer
        });

        order1.should.have.status(201);
        order2.should.have.status(201);
        
        const expectedOrders = [{
            "id": order1.body.id,
            "issueDate": "2021/11/29 09:33",
            "state": "ISSUED",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2750,"qty":3},
                        {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty":1}],
            "customerId" : customer
        }, {
            "id": order2.body.id,
            "issueDate": "2023/03/04 19:33",
            "state": "ISSUED",
            "products": [{"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty":2}],
            "customerId" : customer
        }];
        const result = await agent.get("/api/internalOrders");
        result.should.have.status(200);

        expect(result.body).to.deep.equal(expectedOrders);
    });
}


function getInternalOrdersIssued(){
    it("retrieving all internal orders issued", async function(){
        const customer = await setupCustomer("Giulio", "Sunder", "gs@ezwh.com", "thisisasecurepassword");
        const sku1 = await setupSku("Nukeproof Scout", 13000, 15000, "Good quality hardtail MTB", 2750, 10);
        const sku2 = await setupSku("Canyon Stoic", 15000, 18000, "Good quality enduro hardtail", 1700, 3);

        const order1 = await agent.post("/api/internalOrder").send({
            "issueDate": "2021/11/29 09:33",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2750,"qty":3}, {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty":1}],
            "customerId" : customer
        });

        const order2 = await agent.post("/api/internalOrder").send({
            "issueDate": "2023/03/04 19:33",
            "products": [{"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty":2}],
            "customerId" : customer
        });

        order1.should.have.status(201);
        order2.should.have.status(201);

        const result1 = await agent.put("/api/internalOrder/" + order1.body.id).send({
            "newState": "ACCEPTED"
        });
        result1.should.have.status(200);
        
        const expectedOrders = [{
            "id": order2.body.id,
            "issueDate": "2023/03/04 19:33",
            "state": "ISSUED",
            "products": [{"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty":2}],
            "customerId" : customer
        }];
        const result = await agent.get("/api/internalOrdersIssued");
        result.should.have.status(200);

        expect(result.body).to.deep.equal(expectedOrders);
    });
}


function getInternalOrdersAccepted(){
    it("retrieving all internal orders accepted", async function(){
        const customer = await setupCustomer("Giulio", "Sunder", "gs@ezwh.com", "thisisasecurepassword");
        const sku1 = await setupSku("Nukeproof Scout", 13000, 15000, "Good quality hardtail MTB", 2750, 10);
        const sku2 = await setupSku("Canyon Stoic", 15000, 18000, "Good quality enduro hardtail", 1700, 3);

        const order1 = await agent.post("/api/internalOrder").send({
            "issueDate": "2021/11/29 09:33",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2750,"qty":3}, {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty":1}],
            "customerId" : customer
        });

        const order2 = await agent.post("/api/internalOrder").send({
            "issueDate": "2023/03/04 19:33",
            "products": [{"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty":2}],
            "customerId" : customer
        });

        order1.should.have.status(201);
        order2.should.have.status(201);

        const result1 = await agent.put("/api/internalOrder/" + order2.body.id).send({
            "newState": "ACCEPTED"
        });
        result1.should.have.status(200);
        
        const expectedOrders = [{
            "id": order2.body.id,
            "issueDate": "2023/03/04 19:33",
            "state": "ACCEPTED",
            "products": [{"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty":2}],
            "customerId" : customer
        }];
        const result = await agent.get("/api/internalOrdersAccepted");
        result.should.have.status(200);

        expect(result.body).to.deep.equal(expectedOrders);
    });
}


function changeStateOfInternalOrder(){
    it("change state of internal orders", async function(){
        const customer = await setupCustomer("Giulio", "Sunder", "gs@ezwh.com", "thisisasecurepassword");
        const sku1 = await setupSku("Nukeproof Scout", 13000, 15000, "Good quality hardtail MTB", 2750, 10);
        const sku2 = await setupSku("Canyon Stoic", 15000, 18000, "Good quality enduro hardtail", 1700, 3);

        const order1 = await agent.post("/api/internalOrder").send({
            "issueDate": "2021/11/29 09:33",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2750,"qty":3}, {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty":1}],
            "customerId" : customer
        });

        order1.should.have.status(201);

        const result1 = await agent.put("/api/internalOrder/" + order1.body.id).send({
            "newState": "ACCEPTED"
        });
        result1.should.have.status(200);

        const expectedOrder = {
            "id": order1.body.id,
            "issueDate": "2021/11/29 09:33",
            "state": "ACCEPTED",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2750,"qty":3},
                        {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty":1}],
            "customerId" : customer
        };

        const result = await agent.get("/api/internalOrder/" + order1.body.id);
        result.should.have.status(200);

        expect(result.body).to.deep.equal(expectedOrder);
    });
}


function changeStateOfInternalOrderToCompletedWithAddedItems(){
    it("change state of internal order to completed and add sku items", async function(){
        const customer = await setupCustomer("Giulio", "Sunder", "gs@ezwh.com", "thisisasecurepassword");
        const sku1 = await setupSku("Nukeproof Scout", 13000, 15000, "Good quality hardtail MTB", 2750, 10);
        const sku2 = await setupSku("Canyon Stoic", 15000, 18000, "Good quality enduro hardtail", 1700, 3);
        const skuItem1 = "01234567890123456789012345678901";
        const skuItem2 = "98765432109876543210987654321098";
        
        await setupSkuItem(skuItem1, sku1);
        await setupSkuItem(skuItem2, sku2);
        
        const order1 = await agent.post("/api/internalOrder").send({
            "issueDate": "2021/11/29 09:33",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2750,"qty":3}, {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty":2}],
            "customerId" : customer
        });

        order1.should.have.status(201);

        const result1 = await agent.put("/api/internalOrder/" + order1.body.id).send({
            "newState": "COMPLETED",
            "products": [{"SkuId": sku1, "RFID": skuItem1}, {"SkuId": sku2, "RFID": skuItem2}]
        });

        result1.should.have.status(200);

        const expectedOrder = {
            "id": order1.body.id,
            "issueDate": "2021/11/29 09:33",
            "state": "COMPLETED",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2750,"RFID": skuItem1},
                        {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"RFID": skuItem2}],
            "customerId" : customer
        };

        const result = await agent.get("/api/internalOrder/" + order1.body.id);
        result.should.have.status(200);

        expect(result.body).to.deep.equal(expectedOrder);
    });
}


function changeStateOfInternalOrderToNotCompletedWithAddedItems(){
    it("change state of internal order to completed and add sku items", async function(){
        const customer = await setupCustomer("Giulio", "Sunder", "gs@ezwh.com", "thisisasecurepassword");
        const sku1 = await setupSku("Nukeproof Scout", 13000, 15000, "Good quality hardtail MTB", 2750, 10);
        const sku2 = await setupSku("Canyon Stoic", 15000, 18000, "Good quality enduro hardtail", 1700, 3);
        const skuItem1 = "01234567890123456789012345678901";
        const skuItem2 = "98765432109876543210987654321098";
        
        await setupSkuItem(skuItem1, sku1);
        await setupSkuItem(skuItem2, sku2);
        
        const order1 = await agent.post("/api/internalOrder").send({
            "issueDate": "2021/11/29 09:33",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2750,"qty":3}, {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty":2}],
            "customerId" : customer
        });

        order1.should.have.status(201);

        const result1 = await agent.put("/api/internalOrder/" + order1.body.id).send({
            "newState": "ACCEPTED",
            "products": [{"SkuId": sku1, "RFID": skuItem1}, {"SkuId": sku2, "RFID": skuItem2}]
        });

        result1.should.have.status(200);

        const expectedOrder = {
            "id": order1.body.id,
            "issueDate": "2021/11/29 09:33",
            "state": "ACCEPTED",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2750,"qty": 3},
                        {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty": 2}],
            "customerId" : customer
        };

        const result = await agent.get("/api/internalOrder/" + order1.body.id);
        result.should.have.status(200);

        expect(result.body).to.deep.equal(expectedOrder);
    });
}


function deleteInternalOrder(){
    it("delete internal order by id", async function(){
        const customer = await setupCustomer("Giulio", "Sunder", "gs@ezwh.com", "thisisasecurepassword");
        const sku1 = await setupSku("Nukeproof Scout", 13000, 15000, "Good quality hardtail MTB", 2750, 10);
        const sku2 = await setupSku("Canyon Stoic", 15000, 18000, "Good quality enduro hardtail", 1700, 3);

        const order1 = await agent.post("/api/internalOrder").send({
            "issueDate": "2021/11/29 09:33",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2750,"qty":3}, {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty":1}],
            "customerId" : customer
        });

        const order2 = await agent.post("/api/internalOrder").send({
            "issueDate": "2023/03/04 19:33",
            "products": [{"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1700,"qty":2}],
            "customerId" : customer
        });

        order1.should.have.status(201);
        order2.should.have.status(201);
        
        const result = await agent.delete("/api/internalOrder/" + order1.body.id);
        result.should.have.status(204);

        const result1 = await agent.get("/api/internalOrder/" + order1.body.id);
        result1.should.have.status(404);

        expect(result1.body.error).equal("Order Not Found");
    });
}