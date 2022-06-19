const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const app = require("../server");
var agent = chai.request.agent(app);

describe.only("test TD apis", () => {
  // beforeEach(async () => {
  //     await agent.delete('/api/allUsers');
  // })

  const item = {
    name: "test descriptor 3",
    procedureDescription: "This test is described by...",
    idSKU: 1,
  };

  const newitem = {
    newName: "test descriptor 1",
    newProcedureDescription: "This test is described by...",
    newIdSKU: 2,
  };

  // const position =
  // {
  //     "position": "800234523412"
  // }
  //"testDescriptors" : [1,3,4]

  // UpdateTDPositionByID(200,11,newitem)
  deleteAllData(204);
  newTD(201, item);
  getTD(200, item);
  getskuTDId(200, 1, item);
  //   UpdateTDByID(200, 1, newitem);
  //   // deleteItem(204,100);
  //   deleteTD(200, 52);

  // });
  function deleteAllData(expectedHTTPStatus) {
    it("Deleting data", function (done) {
      agent.delete("/api/deleteAllTD").then(function (res) {
        res.should.have.status(expectedHTTPStatus);

        agent.delete("/api/skus").then(function (res) {
          res.should.have.status(expectedHTTPStatus);
          done();
        });
      });
    });
  }
  function getTD(expectedHTTPStatus, item) {
    it("getting TD from the system", (done) => {
      agent
        .get("/api/testDescriptors")
        .then((r) => {
          r.should.have.status(expectedHTTPStatus);
          // r.body[0]["id"].should.equal(id);
          r.body[0]["name"].should.equal(item.name);
          r.body[0]["procedureDescription"].should.equal(
            item.procedureDescription
          );
          r.body[0]["idSKU"].should.equal(item.idSKU);

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  }

  function getskuTDId(expectedHTTPStatus, id, item) {
    it("getting TD from the system By ID", (done) => {
      agent
        .post("/api/testdescriptor")
        .send(item)
        .then((res) => {
          res.should.have.status(201);
          agent.get("/api/testdescriptors/" + id).then((r) => {
            r.should.have.status(expectedHTTPStatus);
            // r.body[0]["id"].should.equal(id);
            r.body.name.should.equal(item.name);
            r.body.procedureDescription.should.equal(item.procedureDescription);
            r.body.idSKU.should.equal(item.idSKU);
            done();
          });
        });
    });
  }

  function newTD(expectedHTTPStatus, item) {
    it("adding a new TD", (done) => {
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
          agent
            .post("/api/testdescriptor")
            .send(item)
            .then((res) => {
              res.should.have.status(expectedHTTPStatus);
              done();
            });
        });
    });
  }

  function UpdateTDByID(expectedHTTPStatus, id, newitem) {
    it("Updating TD By ID", (done) => {
      if (newitem !== undefined) {
        agent
          .put("/api/testdescriptor/" + id)
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
          .post("/api/testdescriptor/" + id) //we are not sending any data
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

  function deleteTD(expectedHTTPStatus, id) {
    it("Deleting TD", function (done) {
      if (!id > 0) {
        agent
          .delete("/api/testdescriptor/" + id)
          .then((res) => {
            res.should.have.status(expectedHTTPStatus);
            done();
          })
          .catch((err) => {
            done(err);
          });
      } else {
        agent
          .delete("/api/testdescriptor/" + id) //we are not sending any data
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
