const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const app = require("../server");
var agent = chai.request.agent(app);

describe("test SKU apis", () => {
  // beforeEach(async () => {
  //     await agent.delete('/api/allUsers');
  // })

  const item = {
    description: "a new sku",
    weight: 100,
    volume: 50,
    notes: "first SKU",
    availableQuantity: 50,
    price: 10.99,
    //"positionID" : null
    //"testDescriptors":[]
  };

  const newitem = {
    newDescription: "a new sku",
    newWeight: 100,
    newVolume: 50,
    newNotes: "first SKU",
    newPrice: 10.99,
    newAvailableQuantity: 50,
  };

  const position = {
    position: "800234523412",
  };
  //"testDescriptors" : [1,3,4]

  newSKU(201, item);
  UpdateTDPositionByID(200, 350, newitem);
  UpdateTDByID(200, 350, newitem);
  getTD(200, item);
  getskubyId(200, 350, item);
  deleteItem(204, 100);
  // deleteItem(422);

  // });

  function getTD(expectedHTTPStatus, item) {
    it("getting sku from the system", (done) => {
      agent
        .get("/api/skus/")
        .then((r) => {
          if (r.status !== 404) {
            r.should.have.status(expectedHTTPStatus);
            // r.body[0]["id"].should.equal(id);
            r.body[0]["description"].should.equal(item.description);
            r.body[0]["weight"].should.equal(item.weight);
            r.body[0]["volume"].should.equal(item.volume);
            r.body[0]["notes"].should.equal(item.notes);
            r.body[0]["availableQuantity"].should.equal(item.availableQuantity);
            r.body[0]["price"].should.equal(item.price);
            //r.body[0]["positionID"].should.equal(item.positionID);
            // r.body[0]["testDescriptors"].should.equal(item.testDescriptors);
            done();
          } else {
            agent.get("/api/skus/").then((res) => {
              res.should.have.status(expectedHTTPStatus);
              done();
            });
          }
        })
        .catch((err) => {
          done(err);
        });
    });
  }

  function getskubyId(expectedHTTPStatus, id, item) {
    it("getting sku from the system By ID", (done) => {
      agent
        .post("/api/sku/")
        .send(item)
        .then((res) => {
          res.should.have.status(200);
          agent
            .get("/api/skus/" + id)
            .then((r) => {
              if (r.status !== 404) {
                r.should.have.status(expectedHTTPStatus);
                // r.body[0]["id"].should.equal(id);
                r.body[0]["description"].should.equal(item.description);
                r.body[0]["weight"].should.equal(item.weight);
                r.body[0]["volume"].should.equal(item.volume);
                r.body[0]["notes"].should.equal(item.notes);
                r.body[0]["availableQuantity"].should.equal(
                  item.availableQuantity
                );
                r.body[0]["price"].should.equal(item.price);
                //r.body[0]["positionID"].should.equal(item.positionID);
                // r.body[0]["testDescriptors"].should.equal(item.testDescriptors);
                done();
              } else {
                agent.get("/api/skus/" + id).then((res) => {
                  res.should.have.status(expectedHTTPStatus);
                  done();
                });
              }
            })
            .catch((err) => {
              done(err);
            });
        });
    });
  }

  function newSKU(expectedHTTPStatus, item) {
    it("adding a new SKU", (done) => {
      if (item !== undefined) {
        agent
          .post("/api/sku")
          .send(item)
          .then((res) => {
            res.should.have.status(expectedHTTPStatus);
            //res.body.should.equal("new item is inserted");
            done();
          })
          .catch((err) => {
            done(err);
          });
      }
      // } else {
      // //     agent.post('/api/sku') //we are not sending any data
      // //         .then((res) => {
      // //             res.should.have.status(expectedHTTPStatus);
      // //             done();
      // //         }).catch((err) => {
      // //             done(err);
      // //         })

      //  }
    });
  }

  function UpdateTDByID(expectedHTTPStatus, id, newitem) {
    it("Updating SKU By ID", (done) => {
      if (newitem !== undefined) {
        agent
          .put("/api/sku/" + id)
          .send(newitem)
          .then((res) => {
            res.should.have.status(200);

            done();
          })
          .catch((err) => {
            done(err);
          });
      } else {
        agent
          .post("/api/skus/" + id) //we are not sending any data
          .then((res) => {
            res.should.have.status(expectedHTTPStatus);
            done();
          })
          .catch((err) => {
            done(err);
          });
      }
    });
  }

  function UpdateTDPositionByID(expectedHTTPStatus, id, position) {
    it("Updating SKU By ID", (done) => {
      if (position !== undefined) {
        agent
          .put("/api/sku/" + id)
          .send(position)
          .then((res) => {
            res.should.have.status(200);

            done();
          })
          .catch((err) => {
            done(err);
          });
      } else {
        agent
          .post("/api/skus/" + id) //we are not sending any data
          .then((res) => {
            res.should.have.status(expectedHTTPStatus);
            done();
          })
          .catch((err) => {
            done(err);
          });
      }
    });
  }

  function deleteItem(expectedHTTPStatus, id) {
    it("Deleting item", function (done) {
      if (!id > 0) {
        agent
          .delete("/api/skus/" + id)
          .then((res) => {
            res.should.have.status(expectedHTTPStatus);
            done();
          })
          .catch((err) => {
            done(err);
          });
      } else {
        agent
          .delete("/api/skus/" + id) //we are not sending any data
          .then((res) => {
            res.should.have.status(expectedHTTPStatus);
            done();
          })
          .catch((err) => {
            done(err);
          })
          .catch((err) => {
            done(err);
          });
      }
    });
  }
});
