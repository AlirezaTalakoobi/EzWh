const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);


describe('test TD apis', () => {



    // beforeEach(async () => {
    //     await agent.delete('/api/allUsers');
    // })

    const item =
    {
        "name":"test descriptor 3",
        "procedureDescription":"This test is described by...",
        "idSKU" :1
    }


    const newitem =
    {
        "newName":"test descriptor 1",
        "newProcedureDescription":"This test is described by...",
        "newIdSKU" :350
    }


    // const position =
    // {
    //     "position": "800234523412"
    // }
    //"testDescriptors" : [1,3,4]


     
    // UpdateTDPositionByID(200,11,newitem)
    
     getTD(200,item);
     getskuTDId(200, 52, item);
     newTD(200, item)
     UpdateTDByID(200,52,newitem)
    // deleteItem(204,100);
      deleteTD(200,52);


    // });

    function getTD(expectedHTTPStatus, item) {
        it('getting TD from the system', (done) => {
            
                    agent.get("/api/testDescriptors")
                        .then((r) => {
                            if (r.status !== 404) {
                                r.should.have.status(expectedHTTPStatus);
                               // r.body[0]["id"].should.equal(id);
                                r.body[0]["Name"].should.equal(item.name);
                                r.body[0]["proceduredescription"].should.equal(item.procedureDescription);
                                r.body[0]["idSKU"].should.equal(item.idSKU);
                               
                                done();
                            }
                            else {
                                agent.get("/api/testDescriptors")
                                    .then((res) => {
                                        res.should.have.status(expectedHTTPStatus);
                                        done();
                                    })
                            }
                        }

                        ).catch((err) => {
                            done(err);
                        })
                });
        
   }

    function getskuTDId(expectedHTTPStatus, id, item) {
        it('getting TD from the system By ID', (done) => {
            agent.post('/api/testdescriptor')
                .send(item)
                .then((res) => {
                    res.should.have.status(200);
                    agent.get("/api/testdescriptors/" + id)
                        .then((r) => {
                            if (r.status !== 404) {
                                //r.should.have.status(expectedHTTPStatus);
                                // r.body[0]["id"].should.equal(id);
                                r.body[0]["Name"].should.equal(item.name);
                                r.body[0]["proceduredescription"].should.equal(item.procedureDescription);
                                r.body[0]["idSKU"].should.equal(item.idSKU);
                               
                                //r.body[0]["positionID"].should.equal(item.positionID);
                                // r.body[0]["testDescriptors"].should.equal(item.testDescriptors);
                                done();
                            }
                            else {
                                agent.get("/api/testdescriptors/" + id)
                                    .then((res) => {
                                        res.should.have.status(expectedHTTPStatus);
                                        done();
                                    })
                            }
                        }

                        ).catch((err) => {
                            done(err);
                        })
                });
        });
    }

    function newTD(expectedHTTPStatus, item) {
        it('adding a new TD', (done) => {
            if (item !== undefined) {
                agent.post('/api/testdescriptor')
                    .send(item)
                    .then((res) => {
                        res.should.have.status(expectedHTTPStatus);
                       
                        done();
                    }).catch((err) => {
                        done(err);
                    })
                }
       
        });
    }

    function UpdateTDByID(expectedHTTPStatus,id,newitem) {
        it('Updating TD By ID',  (done)=> {
            if (newitem !== undefined) {
            
                agent.put('/api/testdescriptor/' + id)
                    .send(newitem)
                    .then( (res)=> {
                        res.should.have.status(200);
                        
                        done();
                    }).catch((err)=>{done(err);})
                }
             
               else {
                agent.post('/api/testdescriptor/' + id) //we are not sending any data
                    .then( (res)=> {                     
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    }).catch((err)=>{done(err);})
            }
    
        });
    }


    
function  deleteTD(expectedHTTPStatus, id) {
    it('Deleting TD', function (done) {
        if(!id >0){
        agent.delete('/api/testdescriptor/'+id)
            .then( (res)=> {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch((err)=>{
                done(err);
            });
        }

        else{
            agent.delete('/api/testdescriptor/'+id) //we are not sending any data
            .then( (res)=> {                     
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch((err)=>{
                done(err);
            }).catch((err)=>{
                done(err);
            })
        }
    });
}
    
})
