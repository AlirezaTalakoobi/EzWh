const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const app = require("../server");
var agent = chai.request.agent(app);

describe("test create pos api", () => {
  beforeEach(async () => {
  });
  createALL(201,"800234543412","8002","3454","3412",1000,1000)
  // createALL(422,null,null,"3454","3412",1000,1000)

  // createALL(422,"12","a new item",10.99,0,0)
  // createALL(422,null,"a new item",10.99,0,0)
  // createALL(422,"12","a new item",-10,0,0)
  // createALL(422,"12","a new item",10.99,10,0)
  afterEach(async () => {
  })
});

function clearall(){
  agent.delete("/api/deleteAllPositions")
    .then(function (res) {
      res.should.have.status(204);
          })}

function createALL(expectedHTTPStatus,id,isle,row,col,weight,vol){
  it("creating pos", function (done) {
    
    agent.delete("/api/deleteAllPositions")
    .then(function (res) {
      res.should.have.status(204);
      agent.post("/api/position").send({
        positionID:id,
        aisleID: isle,
        row: row,
        col: col,
        maxWeight: weight,
        maxVolume: vol

      }).then(function (r){
        r.should.have.status(201);
        done()
      })
    })
  })
}
      

describe("test get item api", () => {
  beforeEach(async () => {
  });
  createALL(201,"800234543412","8002","3454","3412",1000,1000)
  get_normal(200)
  clearall()
  get_normal(200)

  afterEach(async () => {
  })
});


function get_normal(expectedHTTPStatus){
  it("get pos", function (done) {
    agent.get("/api/positions").send(
      ).then(function (res){
        res.should.have.status(200);
        done();
      })})}
    



// describe("test modify item by id api", () => {
//   beforeEach(async () => {
//   });
//   createALL(201,12,"a new item",10.99,0,0)
//   modify_item(200,12,"new",8)
//   modify_item(422,12,"new",-10)
//   modify_item(404,20,"new",8)



//   afterEach(async () => {
//   })
// });

// function modify_item(expectedHTTPStatus,id,desc,price){
//   it("put items", function (done) {
//     agent.put("/api/item/" + id.toString()).send({
//       "newDescription" : desc,
//       "newPrice" : price
//      }
//       ).then(function (res){
//         // console.log(res)
//         res.should.have.status(expectedHTTPStatus);
//         done();
//       })})}


describe("test delete item by id api", () => {
  beforeEach(async () => {
  });
  createALL(201,"800234543412","8002","3454","3412",1000,1000)
  delete_id(204,"800234543412")



  afterEach(async () => {
  })
});

function delete_id(expectedHTTPStatus,id){
  it("delete items", function (done) {
    agent.delete("/api/position/" + id).send(
      ).then(function (res){
        res.should.have.status(expectedHTTPStatus);
        done();
      })})}