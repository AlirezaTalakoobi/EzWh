const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const res = require("express/lib/response");
chai.use(chaiHttp);
chai.should();

const app = require("../server");
var agent = chai.request.agent(app);

async function setupSupplier(name, surname, username, password){
    const customer = await agent.post("/api/newUser").send({
        name: name,
        surname: surname,
        username: username,
        password: password,
        type: "supplier"
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


async function setupItem(id, description, price, skuId, supplier){
    const item = await agent.post("/api/item").send({
        "id" : id,
        "description" : description,
        "price" : price,
        "SKUId" : skuId,
        "supplierId" : supplier
    });
    return item;
}


async function setupSkuItem(rfid, skuId){
    const skuItem = await agent.post("/api/skuitem").send({
        "RFID": rfid,
        "SKUId": skuId
    });
    console.log(skuItem.status)
    return skuItem;
}



describe("test new return order", () => {
    beforeEach(async () => {
        await agent.delete("/api/returnOrders");
        await agent.delete("/api/restockOrders");
        await agent.delete("/api/deleteAllUsers");
        await agent.delete("/api/skus");
        await agent.delete("/api/skuitems");
        await agent.delete("/api/items");
    });
    createReturnOrder();
    createReturnOrderIncorrectRequestFormat();
    createReturnOrderIncorrectWrongData();
});


describe("get return orders", () => {
    beforeEach(async () => {
        await agent.delete("/api/returnOrders");
        await agent.delete("/api/restockOrders");
        await agent.delete("/api/deleteAllUsers");
        await agent.delete("/api/skus");
        await agent.delete("/api/skuitems");
        await agent.delete("/api/items");
    });
    getReturnOrders();
});


describe("delete a return order by id", () => {
    beforeEach(async () => {
        await agent.delete("/api/returnOrders");
        await agent.delete("/api/restockOrders");
        await agent.delete("/api/deleteAllUsers");
        await agent.delete("/api/skus");
        await agent.delete("/api/skuitems");
        await agent.delete("/api/items");
    });
    deleteReturnOrder();
    deleteReturnOrderNotFound();
});



function createReturnOrder(){
    it("creating a new return order", async function(){
        const supplier = await setupSupplier("Giulio", "Sunder", "gs@ezwh.com", "thisisasecurepassword");
        const sku1 = await setupSku("Nukeproof Scout", 13000, 15000, "Good quality hardtail MTB", 2750, 10);
        const sku2 = await setupSku("Canyon Stoic", 15000, 18000, "Good quality enduro hardtail", 1700, 3);
        const item1 = 1;
        const item2 = 2;
        await setupItem(item1, "supply for nukeproof", 2500, sku1, supplier);
        await setupItem(item2, "supply for canyon", 1500, sku2, supplier);

        const order = await agent.post("/api/restockOrder").send({
            "issueDate": "2021/11/29 09:33",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3}, {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1500,"qty":2}],
            "supplierId" : supplier
        });

        order.should.have.status(201);

        await agent.put("/api/restockOrder/" + order.body.id).send({
            "newState": "DELIVERED"
        });

        const skuItems = [{"SKUId":sku1, "rfid":"12345678901234567890123456789016"},{"SKUId":sku2,"rfid":"12345678901234567890123456789017"}];
        
        await agent.put("/api/restockOrder/" + order.body.id + "/skuItems").send({
            "skuItems": skuItems
        });

        const restock = await agent.get("/api/restockOrder/" + order.body.id);

        const retOrder = await agent.post("/api/returnOrder").send({
            "returnDate":"2021/11/29",
            "products": [{"SKUId":sku1,"description":"ordering a batch of nukeproof scout","price":2500, "RFID":skuItems[0].rfid}, {"SKUId":sku2,"description":"ordering a batch of canyon stoic","price":1500,"RFID":skuItems[1].rfid}],
            "restockOrderId" : order.body.id
        });


        const expectedOrder = {
            "id": retOrder.body.id,
            "returnDate": "2021/11/29",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2500,"RFID":skuItems[0].rfid},
                        {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1500,"RFID":skuItems[1].rfid}],
            "restockOrderId" : order.body.id
        };

        const result = await agent.get("/api/returnOrder/" + retOrder.body.id);
        result.should.have.status(200);
        expect(result.body).to.deep.equal(expectedOrder);
    });
}



function createReturnOrderIncorrectRequestFormat(){
    it("creating a new return order", async function(){
        const supplier = await setupSupplier("Giulio", "Sunder", "gs@ezwh.com", "thisisasecurepassword");
        const sku1 = await setupSku("Nukeproof Scout", 13000, 15000, "Good quality hardtail MTB", 2750, 10);
        const sku2 = await setupSku("Canyon Stoic", 15000, 18000, "Good quality enduro hardtail", 1700, 3);
        const item1 = 1;
        const item2 = 2;
        await setupItem(item1, "supply for nukeproof", 2500, sku1, supplier);
        await setupItem(item2, "supply for canyon", 1500, sku2, supplier);

        const order = await agent.post("/api/restockOrder").send({
            "issueDate": "2021/11/29 09:33",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3}, {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1500,"qty":2}],
            "supplierId" : supplier
        });

        order.should.have.status(201);

        await agent.put("/api/restockOrder/" + order.body.id).send({
            "newState": "DELIVERED"
        });

        const skuItems = [{"SKUId":sku1, "rfid":"12345678901234567890123456789016"},{"SKUId":sku2,"rfid":"12345678901234567890123456789017"}];
        
        await agent.put("/api/restockOrder/" + order.body.id + "/skuItems").send({
            "skuItems": skuItems
        });

        const restock = await agent.get("/api/restockOrder/" + order.body.id);

        const retOrder = await agent.post("/api/returnOrder").send({
            "products": [{"SKUId":sku1,"description":"ordering a batch of nukeproof scout","price":2500, "RFID":skuItems[0].rfid}, {"SKUId":sku2,"description":"ordering a batch of canyon stoic","price":1500,"RFID":skuItems[1].rfid}],
            "restockOrderId" : order.body.id
        });
        retOrder.should.have.status(422);

        expect(retOrder.body.error).equal("Request Format Error");
    });
}


function createReturnOrderIncorrectWrongData(){
    it("Trying to create a new return order with wrong data", async function(){
        const supplier = await setupSupplier("Giulio", "Sunder", "gs@ezwh.com", "thisisasecurepassword");
        const sku1 = await setupSku("Nukeproof Scout", 13000, 15000, "Good quality hardtail MTB", 2750, 10);
        const sku2 = await setupSku("Canyon Stoic", 15000, 18000, "Good quality enduro hardtail", 1700, 3);
        const item1 = 1;
        const item2 = 2;
        await setupItem(item1, "supply for nukeproof", 2500, sku1, supplier);
        await setupItem(item2, "supply for canyon", 1500, sku2, supplier);

        const order = await agent.post("/api/restockOrder").send({
            "issueDate": "2021/11/29 09:33",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3}, {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1500,"qty":2}],
            "supplierId" : supplier
        });

        order.should.have.status(201);

        await agent.put("/api/restockOrder/" + order.body.id).send({
            "newState": "DELIVERED"
        });

        const skuItems = [{"SKUId":sku1, "rfid":"12345678901234567890123456789016"},{"SKUId":sku2,"rfid":"12345678901234567890123456789017"}];
        
        await agent.put("/api/restockOrder/" + order.body.id + "/skuItems").send({
            "skuItems": skuItems
        });

        const restock = await agent.get("/api/restockOrder/" + order.body.id);

        const retOrder = await agent.post("/api/returnOrder").send({
            "returnDate": "2022/03/07",
            "products": [{"SKUId":sku1,"description":"ordering a batch of nukeproof scout","price":2800, "RFID":skuItems[0].rfid}, {"SKUId":sku2,"description":"ordering a batch of canyon stoic","price":1500,"RFID":skuItems[1].rfid}],
            "restockOrderId" : order.body.id
        });
        retOrder.should.have.status(422);

        expect(retOrder.body.error).equal("Wrong data");
    });
}


function getReturnOrders(){
    it("getting all return order", async function(){
        const supplier = await setupSupplier("Giulio", "Sunder", "gs@ezwh.com", "thisisasecurepassword");
        const sku1 = await setupSku("Nukeproof Scout", 13000, 15000, "Good quality hardtail MTB", 2750, 10);
        const sku2 = await setupSku("Canyon Stoic", 15000, 18000, "Good quality enduro hardtail", 1700, 3);
        const item1 = 1;
        const item2 = 2;
        await setupItem(item1, "supply for nukeproof", 2500, sku1, supplier);
        await setupItem(item2, "supply for canyon", 1500, sku2, supplier);

        const order = await agent.post("/api/restockOrder").send({
            "issueDate": "2021/11/29 09:33",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3}, {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1500,"qty":2}],
            "supplierId" : supplier
        });

        order.should.have.status(201);

        await agent.put("/api/restockOrder/" + order.body.id).send({
            "newState": "DELIVERED"
        });

        const skuItems = [{"SKUId":sku1, "rfid":"12345678901234567890123456789016"},{"SKUId":sku2,"rfid":"12345678901234567890123456789017"}];
        
        await agent.put("/api/restockOrder/" + order.body.id + "/skuItems").send({
            "skuItems": skuItems
        });

        const restock = await agent.get("/api/restockOrder/" + order.body.id);

        const retOrder1 = await agent.post("/api/returnOrder").send({
            "returnDate":"2021/11/29",
            "products": [{"SKUId":sku1,"description":"ordering a batch of nukeproof scout","price":2500, "RFID":skuItems[0].rfid}],
            "restockOrderId" : order.body.id
        });

        const retOrder2 = await agent.post("/api/returnOrder").send({
            "returnDate":"1999/01/09",
            "products": [{"SKUId":sku2,"description":"ordering a batch of canyon stoic","price":1500,"RFID":skuItems[1].rfid}],
            "restockOrderId" : order.body.id
        });


        const expectedOrders = [{
            "id": retOrder1.body.id,
            "returnDate": "2021/11/29",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2500,"RFID":skuItems[0].rfid}],
            "restockOrderId" : order.body.id
        }, {
            "id": retOrder2.body.id,
            "returnDate": "1999/01/09",
            "products": [{"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1500,"RFID":skuItems[1].rfid}],
            "restockOrderId" : order.body.id
        }];

        const result = await agent.get("/api/returnOrders");
        result.should.have.status(200);
        expect(result.body).to.deep.equal(expectedOrders);
    });
}


function deleteReturnOrder(){
    it("deleting a return order", async function(){
        const supplier = await setupSupplier("Giulio", "Sunder", "gs@ezwh.com", "thisisasecurepassword");
        const sku1 = await setupSku("Nukeproof Scout", 13000, 15000, "Good quality hardtail MTB", 2750, 10);
        const sku2 = await setupSku("Canyon Stoic", 15000, 18000, "Good quality enduro hardtail", 1700, 3);
        const item1 = 1;
        const item2 = 2;
        await setupItem(item1, "supply for nukeproof", 2500, sku1, supplier);
        await setupItem(item2, "supply for canyon", 1500, sku2, supplier);

        const order = await agent.post("/api/restockOrder").send({
            "issueDate": "2021/11/29 09:33",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3}, {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1500,"qty":2}],
            "supplierId" : supplier
        });

        order.should.have.status(201);

        await agent.put("/api/restockOrder/" + order.body.id).send({
            "newState": "DELIVERED"
        });

        const skuItems = [{"SKUId":sku1, "rfid":"12345678901234567890123456789016"},{"SKUId":sku2,"rfid":"12345678901234567890123456789017"}];
        
        await agent.put("/api/restockOrder/" + order.body.id + "/skuItems").send({
            "skuItems": skuItems
        });

        const restock = await agent.get("/api/restockOrder/" + order.body.id);

        const retOrder = await agent.post("/api/returnOrder").send({
            "returnDate":"2021/11/29",
            "products": [{"SKUId":sku1,"description":"ordering a batch of nukeproof scout","price":2500, "RFID":skuItems[0].rfid}, {"SKUId":sku2,"description":"ordering a batch of canyon stoic","price":1500,"RFID":skuItems[1].rfid}],
            "restockOrderId" : order.body.id
        });

        const result1 = await agent.delete("/api/returnOrder/" + retOrder.body.id);
        result1.should.have.status(204);

        const result = await agent.get("/api/returnOrder/" + retOrder.body.id);
        result.should.have.status(404);

        expect(result.body.error).equal("Order Not Found");
    });
}


function deleteReturnOrderNotFound(){
    it("deleting a return order", async function(){
        const supplier = await setupSupplier("Giulio", "Sunder", "gs@ezwh.com", "thisisasecurepassword");
        const sku1 = await setupSku("Nukeproof Scout", 13000, 15000, "Good quality hardtail MTB", 2750, 10);
        const sku2 = await setupSku("Canyon Stoic", 15000, 18000, "Good quality enduro hardtail", 1700, 3);
        const item1 = 1;
        const item2 = 2;
        await setupItem(item1, "supply for nukeproof", 2500, sku1, supplier);
        await setupItem(item2, "supply for canyon", 1500, sku2, supplier);

        const order = await agent.post("/api/restockOrder").send({
            "issueDate": "2021/11/29 09:33",
            "products": [{"SKUId":sku1, "description":"ordering a batch of nukeproof scout", "price": 2500,"qty":3}, {"SKUId":sku2, "description":"ordering a batch of canyon stoic","price":1500,"qty":2}],
            "supplierId" : supplier
        });

        order.should.have.status(201);

        await agent.put("/api/restockOrder/" + order.body.id).send({
            "newState": "DELIVERED"
        });

        const skuItems = [{"SKUId":sku1, "rfid":"12345678901234567890123456789016"},{"SKUId":sku2,"rfid":"12345678901234567890123456789017"}];
        
        await agent.put("/api/restockOrder/" + order.body.id + "/skuItems").send({
            "skuItems": skuItems
        });

        const restock = await agent.get("/api/restockOrder/" + order.body.id);

        const retOrder = await agent.post("/api/returnOrder").send({
            "returnDate":"2021/11/29",
            "products": [{"SKUId":sku1,"description":"ordering a batch of nukeproof scout","price":2500, "RFID":skuItems[0].rfid}, {"SKUId":sku2,"description":"ordering a batch of canyon stoic","price":1500,"RFID":skuItems[1].rfid}],
            "restockOrderId" : order.body.id
        });

        const result1 = await agent.delete("/api/returnOrder/" + (retOrder.body.id + 10));
        result1.should.have.status(404);

        expect(result1.body.error).equal("Order Not Found");
    });
}
