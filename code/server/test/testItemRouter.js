const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const app = require("../server");
var agent = chai.request.agent(app);

describe("test create Item api", () => {
  beforeEach(async () => {});
  createALL(201, 12, "a new item", 10.99, 0, 0);
  // createALL(422,"12","a new item",10.99,0,0)
  // createALL(422,null,"a new item",10.99,0,0)
  // createALL(422,"12","a new item",-10,0,0)
  // createALL(422,"12","a new item",10.99,10,0)
  afterEach(async () => {});
});

function clearall() {
  agent.delete("/api/deleteAllItems").then(function (res) {
    res.should.have.status(204);
    agent.delete("/api/deleteAllUsers").then(function (res) {
      res.should.have.status(204);
      agent.delete("/api/deleteAllSku").then(function (res) {
        res.should.have.status(204);
        agent.delete("/api/deleteAllPositions").then(function (res) {
          res.should.have.status(204);
        });
      });
    });
  });
}

function createALL(
  expectedHTTPStatus,
  id,
  description,
  price,
  skuid,
  supplierid
) {
  it("creating Items", function (done) {
    agent.delete("/api/deleteAllItems").then(function (res) {
      res.should.have.status(204);
      agent.delete("/api/deleteAllUsers").then(function (res) {
        res.should.have.status(204);
        agent.delete("/api/deleteAllSku").then(function (res) {
          res.should.have.status(204);
          agent.delete("/api/deleteAllPositions").then(function (res) {
            res.should.have.status(204);
            agent
              .post("/api/newUser")
              .send({
                username: "user1@ezwh.com",
                name: "John",
                surname: "Smith",
                password: "testpassword",
                type: "customer",
              })
              .then(function (res) {
                res.should.have.status(200);
                agent
                  .post("/api/position")
                  .send({
                    positionID: "800234543412",
                    aisleID: "8002",
                    row: "3454",
                    col: "3412",
                    maxWeight: 1000,
                    maxVolume: 1000,
                  })
                  .then(function (res) {
                    res.should.have.status(201);
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
                        res.should.have.status(200);
                        agent
                          .get("/api/skus")
                          .send()
                          .then(function (res) {
                            let sku = res.body[0].SKUId;
                            agent
                              .get("/api/users")
                              .send()
                              .then(function (res) {
                                let supplier = res.body[0].id;
                                if (supplierid !== 0) {
                                  supplier = supplierid;
                                }
                                if (skuid !== 0) {
                                  sku = skuid;
                                }
                                agent
                                  .post("/api/item")
                                  .send({
                                    id: id,
                                    description: description,
                                    price: price,
                                    SKUId: sku,
                                    supplierId: supplier,
                                  })
                                  .then(function (res) {
                                    res.should.have.status(expectedHTTPStatus);
                                    done();
                                  });
                              });
                          });
                      });
                  });
              });
          });
        });
      });
    });
  });
}

describe("test get item api", () => {
  beforeEach(async () => {});
  createALL(201, 12, "a new item", 10.99, 0, 0);
  get_normal(200);
  clearall();
  get_normal(500);
  afterEach(async () => {});
});

function get_normal(expectedHTTPStatus) {
  it("get items", function (done) {
    agent
      .get("/api/items")
      .send()
      .then(function (res) {
        res.should.have.status(200);
        done();
      });
  });
}

describe("test get item by id api", () => {
  beforeEach(async () => {});
  createALL(201, 12, "a new item", 10.99, 0, 0);
  get_id(200, 12);
  clearall();
  get_id(404, 1);

  afterEach(async () => {});
});

function get_id(expectedHTTPStatus, id) {
  it("get items", function (done) {
    agent
      .get("/api/items/" + id.toString())
      .send()
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
        done();
      });
  });
}

describe("test modify item by id api", () => {
  beforeEach(async () => {});
  createALL(201, 12, "a new item", 10.99, 0, 0);
  modify_item(200, 12, "new", 8);
  modify_item(422, 12, "new", -10);
  modify_item(404, 20, "new", 8);

  afterEach(async () => {});
});

function modify_item(expectedHTTPStatus, id, desc, price) {
  it("get items", function (done) {
    agent
      .put("/api/item/" + id.toString())
      .send({
        newDescription: desc,
        newPrice: price,
      })
      .then(function (res) {
        // console.log(res)
        res.should.have.status(expectedHTTPStatus);
        done();
      });
  });
}

describe("test delete item by id api", () => {
  beforeEach(async () => {});
  createALL(201, 12, "a new item", 10.99, 0, 0);
  delete_id(204, 12);
  clearall();

  afterEach(async () => {});
});

function delete_id(expectedHTTPStatus, id) {
  it("get items", function (done) {
    agent
      .delete("/api/items/" + id.toString())
      .send()
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
        done();
      });
  });
}
