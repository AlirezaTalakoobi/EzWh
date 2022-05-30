const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const app = require("../server");
var agent = chai.request.agent(app);

describe("test create  test api", () => {
  beforeEach(async () => {
  });
  createALL(201,0,"12345678901234567890123456789015","2021/11/28",true)
  createALL(404,10,"12345678901234567890123456789015","2021/11/28",true)

  afterEach(async () => {
  })
});

function clearall(){
  agent.delete("/api/deleteAllTests")
    .then(function (res) {
      res.should.have.status(204);
      agent.delete("/api/deleteAllSKUItems")
      .then(function (res) {
        res.should.have.status(204);
        agent.delete("/api/deleteAllSku")
        .then(function (res) {
          res.should.have.status(204);
          agent.delete("/api/deleteAllTD").then(function (res) {
            res.should.have.status(204);
          })})})})
}

function createALL(expectedHTTPStatus,td_id,rfid,Date,result){
  it("creating Test result", function (done) {
    agent.delete("/api/deleteAllTests")
    .then(function (res) {
      res.should.have.status(204);
      agent.delete("/api/deleteAllSKUItems")
      .then(function (res) {
        res.should.have.status(204);
        agent.delete("/api/deleteAllSku")
        .then(function (res) {

          res.should.have.status(204);
          agent.delete("/api/deleteAllTD").then(function (res) {
            res.should.have.status(204);
            agent.post("/api/sku")
            .send({
                "description" : "a new sku",
                "weight" : 100,
                "volume" : 50,
                "notes" : "first SKU",
                "price" : 10.99,
                "availableQuantity" : 50})

              .then(function (res) {
                res.should.have.status(200);
                agent.get("/api/skus").send(
                  ).then(function (res){
                let sku = res.body[0].SKUId
                agent.post("/api/skuitem").send({
                  "RFID":rfid,
                  "SKUId":sku,
                  "Available":1,
      
      
                    }
                    ).then(function (res){
                        res.should.have.status(200);
                        agent.post("/api/testdescriptor").send({
                          "name":"test descriptor 3",
                          "procedureDescription":"This test is described by...",
                          "idSKU" :sku
              
                              }
                              ).then(function (res){
                                  res.should.have.status(200);
                                  agent.get("/api/testdescriptors").send(
                                    ).then(function (res){
                                      let td = res.body[0].Id

                                      if(td_id!==0){
                                        td = td_id
                                      }
                                      agent.post("/api/skuitems/testResult").send({
                                        "rfid":rfid,
                                        "idTestDescriptor":td,
                                        "Date":Date,
                                        "Result": result
                            
                                    }
                                    ).then(function (res){
                                        res.should.have.status(expectedHTTPStatus);
                                        done();
                                    })
                                  })
                                })
                              })
                                
                              })
                    })
              })
           
          })})})})
  
}


describe("test get test api", () => {
  beforeEach(async () => {
  });
  createALL(201,0,"12345678901234567890123456789015","2021/11/28",true)
  get_normal(200,"12345678901234567890123456789015")
  clearall()
  get_normal(500,"12345678901234567890123456789015")
  afterEach(async () => {
  })
});


function get_normal(expectedHTTPStatus, rfid){
  it("get items", function (done) {
    agent.get("/api/skuitems/" + rfid.toString() + "/testResults").send(
      ).then(function (res){
        res.should.have.status(200);
        done();
      })})}
    

describe("test get test by id api", () => {
  beforeEach(async () => {
  });
  createALL(201,0,"12345678901234567890123456789015","2021/11/28",true)
  get_id(200,"12345678901234567890123456789015",1)
  clearall()
  get_id(422,"123456789012345678923456789015",3)
  clearall()
  get_id(422,"1234567890123456789234567dfs89015",10)
  afterEach(async () => {
  })
});

function get_id(expectedHTTPStatus,rfid,id){
  it("get test", function (done) {
    agent.get("/api/skuitems/" + rfid.toString() + "/testResults", id).send(
      )
      .then(function (res){
        res.should.have.status(expectedHTTPStatus);
        done();
      })})}

describe("test modify test by id api", () => {
  beforeEach(async () => {
  });
  createALL(201,0,"12345678901234567890123456789015","2021/11/28",true)
  modify_item(404,"12345678901234567890123456789015",1,10,"2021/11/28",true)



  afterEach(async () => {
  })
});

function modify_item(expectedHTTPStatus,rfid,id,newid,date,result){
  it("mosify items", function (done) {
    agent.put("/api/skuitems/" + rfid.toString() + "/testResult", id).send({
      "newIdTestDescriptor":newid,
      "newDate":date,
      "newResult": result

     }
      ).then(function (res){
        res.should.have.status(expectedHTTPStatus);
        done();
      })})}


describe("test delete item by id api", () => {
  beforeEach(async () => {
  });
  createALL(201,0,"12345678901234567890123456789015","2021/11/28",true)
  delete_id(404,"12345678901234567890123456789015",1)



  afterEach(async () => {
  })
});

function delete_id(expectedHTTPStatus,rfid,id){
  it("delete items", function (done) {
    agent.delete("/api/skuitems/" + rfid + "/testResult/", id.toString()).send(
      ).then(function (res){
        console.log(res.status)
        res.should.have.status(expectedHTTPStatus);
        done();
      })})}