const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const app = require("../server");
var agent = chai.request.agent(app);

//insert
describe("test insert item api", () => {
  beforeEach(async () => {
    //await agent.delete("/api/deleteAllUsers");
  });
  deleteAllData(204);

  newSKUItem(200, "12345678909876543212345678909876", "2020/11/03", undefined);
  newSKUItem(404, "12345678909876543212345678909876", "2020/11/03", 888888);
  newSKUItem(409, "12345678909876543212345678909876", "2020/11/03", undefined);
});

//GETITEMS
describe("test get items api", () => {
  beforeEach(async () => {
    //await agent.delete("/api/deleteAllUsers");
  });
  deleteAllData(204);
  newSKUItem(200, "12345678909876543212345678909876", "2020/11/03");
  getSKUITEMS(200, "12345678909876543212345678909876", 0, "2020/11/03");
});

describe("test get item api", () => {
  deleteAllData(204);
  newSKUItem(200, "12345678909876543212345678909876", "2020/11/03", undefined);
  getSKUItemsById(404, "12345678909876543212345678909876", 4, "2020/11/03");
  getSKUItemByRFID(200, "12345678909876543212345678909876", 0, "2020/11/03");
  getSKUItemByRFID(404, "12345678909876543212345678909889");
});

describe("test edit item api", () => {
  deleteAllData(204);
  newSKUItem(200, "12345678909876543212345678909876", "2020/11/03", undefined);
  editItem(
    200,
    "12345678909876543212345678909876",
    "12345678909876543212345678909879",
    15
  );
  editItem(
    404,
    "12345678909876543212345678909871",
    "12345678909876543212345678909877",
    1
  );
  editItem(422);
  editItem(422, "123456789098765432123");
});

describe("test delete item api", () => {
  deleteAllData(204);
  agent
    .post("/api/sku/")
    .send({
      description: "a new sku",
      weight: 100,
      volume: 50,
      notes: "first SKU",
      price: 10.99,
      availableQuantity: 50,
    })
    .then(function (res) {
      res.should.have.status(200);
      newSKUItem(
        200,
        "12345678909876543212345678909876",
        res.body,
        "2020/11/03"
      );
      deleteItem(204, "12345678909876543212345678909876");
      deleteItem(404, "12345678909876543212345678909877");
      deleteItem(422, "29876543212345678909877");
    });
  deleteAllData(204);
});
function deleteAllData(expectedHTTPStatus) {
  it("Deleting data", function (done) {
    agent.delete("/api/deleteAllSKUItems").then(function (res) {
      res.should.have.status(expectedHTTPStatus);
      done();
    });
  });
}
function newSKUItem(expectedHTTPStatus, RFID, DateOfStock, SKUId) {
  it("adding new items", function (done) {
    agent
      .post("/api/sku")
      .send({
        description: "a new sku",
        weight: 100,
        volume: 50,
        notes: "first SKU",
        price: 10.99,
        availableQuantity: 50,
      })
      .then(function (res) {
        const item = {
          RFID: RFID,
          SKUId: SKUId === undefined ? res.body.id : SKUId,
          DateOfStock: DateOfStock,
        };
        console.log(item);
        if (RFID !== undefined) {
          agent
            .post("/api/skuitem/")
            .send(item)
            .then(function (res) {
              res.should.have.status(expectedHTTPStatus);
              done();
            });
        } else if (res === "Item with RFID already existing") {
          agent.post("/api/skuitem/").then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
          });
        } else if (res === "No SKU associated to SKUId") {
          agent
            .post("/api/skuitem/")
            .send(item)
            .then(function (res) {
              res.should.have.status(expectedHTTPStatus);
              done();
            });
        }
      });
  });
}

function getSKUITEMS(expectedHTTPStatus, RFID, Available, DateOfStock) {
  it("getting items from the system", function (done) {
    agent.get("/api/skuitems/").then(function (res) {
      res.should.have.status(expectedHTTPStatus);
      res.body[0].RFID.should.equal(RFID);
      res.body[0].Available.should.equal(Available);
      res.body[0].DateOfStock.should.equal(DateOfStock);
      done();
    });
  });
}
function getSKUItemsById(expectedHTTPStatus, RFID, SKUId, DateOfStock) {
  it("getting items by id from the system", function (done) {
    agent.get("/api/skuitems/sku/" + SKUId).then(function (res) {
      if (res.body === "no item associated to id") {
        res.should.have.status(expectedHTTPStatus);
        done();
      } else {
        res.should.have.status(expectedHTTPStatus);
        res.body[0].RFID.should.equal(RFID);
        res.body[0].SKUId.should.equal(SKUId);
        res.body[0].DateOfStock.should.equal(DateOfStock);
        done();
      }
    });
  });
}

function getSKUItemByRFID(expectedHTTPStatus, RFID, Available, DateOfStock) {
  it("getting items by rfid from the system", function (done) {
    let item = {
      RFID: RFID,
      Available: Available,
      DateOfStock: DateOfStock,
    };
    agent.get("/api/skuitems/" + item.RFID).then(function (r) {
      if (r.body === "no SKU found with this rfid") {
        r.should.have.status(expectedHTTPStatus);
        done();
      } else {
        r.should.have.status(expectedHTTPStatus);
        r.body.RFID.should.equal(RFID);
        r.body.Available.should.equal(Available);
        r.body.DateOfStock.should.equal(DateOfStock);
        done();
      }
    });
  });
}

function editItem(expectedHTTPStatus, RFID, newRFID, newAvailable) {
  it("edit items", function (done) {
    let item = {
      RFID: RFID,
      newRFID: newRFID,
      newAvailable: newAvailable,
    };
    if (item.RFID === undefined || item.RFID.length < 32) {
      agent.put("/api/skuitems/" + RFID).then(function (res) {
        res.should.have.status(expectedHTTPStatus);
        done();
      });
    } else if (RFID !== undefined && RFID.length === 32) {
      agent
        .put("/api/skuitems/" + RFID)
        .send(item)
        .then(function (res) {
          res.should.have.status(expectedHTTPStatus);
          done();
          if (res === "Item not found") {
            res.should.have.status(expectedHTTPStatus);
            done();
          }
        });
    } else {
      agent.put("/api/skuitems/" + RFID).then(function (res) {
        res.should.have.status(expectedHTTPStatus);
        done();
      });
    }
  });
}

function deleteItem(expectedHTTPStatus, RFID) {
  it("delete item", function (done) {
    agent
      .delete("/api/skuitems/" + RFID)
      .send({ RFID: RFID })
      .then(function (res) {
        if (RFID < 32) {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else if (res.message) {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else {
          res.should.have.status(expectedHTTPStatus);
          done();
        }
      });
  });
}
