const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const app = require("../server");
var agent = chai.request.agent(app);

describe("test user api", () => {
  beforeEach(async () => {
    //await agent.delete("/api/deleteAllUsers");
  });
  deleteAllData(204);
  newUser(200, "Davide", "davide", "user1@ezwh.com", "testpassword", "manager");
  newUser(422);
  newUser(409, "Davide", "davide", "user1@ezwh.com", "testpassword", "manager");

  newUser(422, "user1@ezwh.com", "Davide", "davide", "testpa", "manager");
  newUser(
    422,
    "user1@ezwh.com",
    "Davide",
    "davide",
    "testpassword",
    "usernotexisting"
  );
});
describe("test newuser api", () => {
  deleteAllData(204);
  newUser(200, "Davide", "davide", "user1@ezwh.com", "testpassword", "clerk");
  getUsers(200, "Davide", "davide", "user1@ezwh.com", "testpassword", "clerk");
});
describe("test getUsers api", () => {
  deleteAllData(204);
  getUsersV2(
    200,
    "Davide",
    "davide",
    "user1@ezwh.com",
    "testpassword",
    "clerk"
  );
});
describe("test getSuppliers api", () => {
  deleteAllData(204);
  newUser(
    200,
    "Davide",
    "davide",
    "user1@ezwh.com",
    "testpassword",
    "supplier"
  );
  getSuppliers(200, "Davide", "Davide", "user1@ezwh.com", "supplier");
  deleteAllData(204);
  newUser(200, "Davide", "davide", "user1@ezwh.com", "testpassword", "manager");
  getSuppliers(404, "Davide", "Davide", "user1@ezwh.com", "supplier");
});

describe("test managerSession api", () => {
  deleteAllData(204);
  newUser(200, "Davide", "davide", "user1@ezwh.com", "testpassword", "manager");
  managerSessions(422, "user1@ezwh.com", "testpa", "manager");
  managerSessions(200, "user1@ezwh.com", "testpassword", "manager");
  managerSessions(404, "user2@ezwh.com", "testpassword", "manager");
  managerSessions(401, "user1@ezwh.com", "testpasswordddd", "manager");
});

describe("test customerSession api", () => {
  deleteAllData(204);
  newUser(
    200,
    "Davide",
    "davide",
    "user1@ezwh.com",
    "testpassword",
    "customer"
  );
  customerSessions(422, "user1@ezwh.com", "testpa", "customer");
  customerSessions(200, "user1@ezwh.com", "testpassword", "customer");
  customerSessions(404, "user2@ezwh.com", "testpassword", "customer");
  customerSessions(401, "user1@ezwh.com", "testpasswordddd", "customer");
});
describe("test supplierSession api", () => {
  deleteAllData(204);
  newUser(
    200,
    "Davide",
    "davide",
    "user1@ezwh.com",
    "testpassword",
    "supplier"
  );
  supplierSessions(422, "user1@ezwh.com", "testpa", "supplier");
  supplierSessions(200, "user1@ezwh.com", "testpassword", "supplier");
  supplierSessions(404, "user2@ezwh.com", "testpassword", "supplier");
  supplierSessions(401, "user1@ezwh.com", "testpasswordddd", "supplier");
});

describe("test clerkSession api", () => {
  deleteAllData(204);
  newUser(200, "Davide", "davide", "user1@ezwh.com", "testpassword", "clerk");
  clerkSessions(422, "user1@ezwh.com", "testpa", "clerk");
  clerkSessions(200, "user1@ezwh.com", "testpassword", "clerk");
  clerkSessions(404, "user2@ezwh.com", "testpassword", "clerk");
  clerkSessions(401, "user1@ezwh.com", "testpasswordddd", "clerk");
});

describe("test qualityEmployeeSession api", () => {
  deleteAllData(204);
  newUser(
    200,
    "Davide",
    "davide",
    "user1@ezwh.com",
    "testpassword",
    "qualityEmployee"
  );
  qualityEmployeeSessions(422, "user1@ezwh.com", "testpa", "qualityEmployee");
  qualityEmployeeSessions(
    200,
    "user1@ezwh.com",
    "testpassword",
    "qualityEmployee"
  );
  qualityEmployeeSessions(
    404,
    "user2@ezwh.com",
    "testpassword",
    "qualityEmployee"
  );
  qualityEmployeeSessions(
    401,
    "user1@ezwh.com",
    "testpasswordddd",
    "qualityEmployee"
  );
});
describe("test deliveryEmployeeSession api", () => {
  deleteAllData(204);
  newUser(
    200,
    "Davide",
    "davide",
    "user1@ezwh.com",
    "testpassword",
    "deliveryEmployee"
  );
  deliveryEmployeeSessions(422, "user1@ezwh.com", "testpa", "deliveryEmployee");
  deliveryEmployeeSessions(
    200,
    "user1@ezwh.com",
    "testpassword",
    "deliveryEmployee"
  );
  deliveryEmployeeSessions(
    404,
    "user2@ezwh.com",
    "testpassword",
    "deliveryEmployee"
  );
  deliveryEmployeeSessions(
    401,
    "user1@ezwh.com",
    "testpasswordddd",
    "deliveryEmployee"
  );
});

//put
describe("test edit user api", () => {
  deleteAllData(204);
  newUser(
    200,
    "Davide",
    "davide",
    "user1@ezwh.com",
    "testpassword",
    "customer"
  );
  editUser(200, "user1@ezwh.com", "customer", "clerk");
  editUser(404, "user4@ezwh.com", "customer", "customer");
  editUser(422, "user1@ezwh.com", "manager", "deliveryman");
});
//delete
describe("test delete user api", () => {
  deleteAllData(204);
  newUser(
    200,
    "Davide",
    "davide",
    "user1@ezwh.com",
    "testpassword",
    "customer"
  );
  deleteUser(204, "user1@ezwh.com", "customer");
  deleteUser(404, "user4@ezwh.com", "customer");
  deleteUser(422, "user1@ezwh.com", "manager");
  deleteAllData(204);
});

describe("create setup users", () => {
  deleteAllData(204);
  newUser(
    200,
    "Davide",
    "Andriano",
    "user1@ezwh.com",
    "testpassword",
    "customer"
  );

  newUser(
    200,
    "Pouya",
    "Hakimifard",
    "qualityEmployee1@ezwh.com",
    "testpassword",
    "qualityEmployee"
  );
  newUser(200, "Giulio", "Sunder", "clerk1@ezwh.com", "testpassword", "clerk");
  newUser(
    200,
    "Alireza",
    "Talakoobi",
    "deliveryEmployee1@ezwh.com",
    "testpassword",
    "deliveryEmployee"
  );
  newUser(
    200,
    "Luca",
    "Ardito",
    "supplier1@ezwh.com",
    "testpassword",
    "supplier"
  );
  newUser(
    200,
    "Maurizio",
    "Morisio",
    "manager1@ezwh.com",
    "testpassword",
    "manager"
  );
});

//functions
function deleteAllData(expectedHTTPStatus) {
  it("Deleting data", function (done) {
    agent.delete("/api/deleteAllUsers").then(function (res) {
      res.should.have.status(expectedHTTPStatus);
      done();
    });
  });
}

function newUser(expectedHTTPStatus, name, surname, username, password, type) {
  it("adding new users", function (done) {
    if (username !== undefined) {
      let user = {
        name: name,
        surname: surname,
        username: username,
        password: password,
        type: type,
      };
      agent
        .post("/api/newUser/")
        .send(user)
        .then(function (res) {
          res.should.have.status(expectedHTTPStatus);
          done();
        });
    } else if (username !== undefined && password.length < 8) {
      agent
        .post("/api/newUser")
        .send(user)
        .then(function (res) {
          res.should.have.status(expectedHTTPStatus);
          res.body.username.should.equal(username);
          done();
        });
    } else if (
      username !== undefined &&
      (type !== "customer " ||
        type !== "qualityEmployee " ||
        type !== "clerk " ||
        type !== "deliveryEmployee " ||
        type !== "supplier " ||
        type !== "manager ")
    ) {
      agent
        .post("/api/newUser")
        .send(user)
        .then(function (res) {
          res.should.have.status(expectedHTTPStatus);
          res.body.username.should.equal(username);
          done();
        });
    } else {
      agent.post("/api/newUser").then(function (res) {
        res.should.have.status(expectedHTTPStatus);
        done();
      });
    }
  });
}

function getUsersV2(
  expectedHTTPStatus,
  name,
  surname,
  username,
  password,
  type
) {
  it("getting users data from the system", function (done) {
    let user = {
      name: name,
      surname: surname,
      username: username,
      password: password,
      type: type,
    };
    agent
      .post("/api/newUser/")
      .send(user)
      .then(function (res) {
        agent.get("/api/users/").then(function (r) {
          r.should.have.status(expectedHTTPStatus);
          r.body[0].name.should.equal(name);
          r.body[0].surname.should.equal(surname);
          r.body[0].email.should.equal(
            username.replace("ezwh", `${type}.ezwh`)
          );
          r.body[0].type.should.equal(type);
          done();
        });
      });
  });
}

function getUsers(expectedHTTPStatus, name, surname, username, password, type) {
  it("getting users data from the system", function (done) {
    agent.get("/api/users/").then(function (res) {
      res.should.have.status(expectedHTTPStatus);
      res.body[0].name.should.equal(name);
      res.body[0].surname.should.equal(surname);
      res.body[0].email.should.equal(username.replace("ezwh", `${type}.ezwh`));
      res.body[0].type.should.equal(type);
      done();
    });
  });
}

function getSuppliers(expectedHTTPStatus, name, surname, username, type) {
  it("getting suppliers from the system", function (done) {
    agent.get("/api/suppliers/").then(function (res) {
      if (res.body === "Users Not found") {
        res.should.have.status(expectedHTTPStatus);
        done();
      } else {
        res.should.have.status(expectedHTTPStatus);
        res.body[0].name.should.equal(name);
        res.body[0].surname.should.equal(surname);
        res.body[0].email.should.equal(
          username.replace("ezwh", `${type}.ezwh`)
        );
        done();
      }
    });
  });
}

function managerSessions(expectedHTTPStatus, username, password, type) {
  it("manager sessions", function (done) {
    let user = {
      username: username,
      password: password,
      type: type,
    };
    agent
      .post("/api/managerSessions/")
      .send(user)
      .then(function (res) {
        if (
          username === undefined ||
          password.length < 8 ||
          type !== "manager"
        ) {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else if (res.body.message === "User not existing") {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else if (res.body === "Wrong Username/Password") {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else {
          res.should.have.status(expectedHTTPStatus);
          res.body.username.should.equal(username);
          done();
        }
      });
  });
}

function customerSessions(expectedHTTPStatus, username, password, type) {
  it("customer sessions", function (done) {
    let user = {
      username: username,
      password: password,
      type: type,
    };
    agent
      .post("/api/customerSessions/")
      .send(user)
      .then(function (res) {
        if (
          username === undefined ||
          password.length < 8 ||
          type !== "customer"
        ) {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else if (res.body.message === "User not existing") {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else if (res.body === "Wrong Username/Password") {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else {
          res.should.have.status(expectedHTTPStatus);
          res.body.username.should.equal(username);
          done();
        }
      });
  });
}

function supplierSessions(expectedHTTPStatus, username, password, type) {
  it("supplier sessions", function (done) {
    let user = {
      username: username,
      password: password,
      type: type,
    };
    agent
      .post("/api/supplierSessions/")
      .send(user)
      .then(function (res) {
        if (
          username === undefined ||
          password.length < 8 ||
          type !== "supplier"
        ) {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else if (res.body.message === "User not existing") {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else if (res.body === "Wrong Username/Password") {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else {
          res.should.have.status(expectedHTTPStatus);
          res.body.username.should.equal(username);
          done();
        }
      });
  });
}

function clerkSessions(expectedHTTPStatus, username, password, type) {
  it("clerk sessions", function (done) {
    let user = {
      username: username,
      password: password,
      type: type,
    };
    agent
      .post("/api/clerkSessions/")
      .send(user)
      .then(function (res) {
        if (username === undefined || password.length < 8 || type !== "clerk") {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else if (res.body.message === "User not existing") {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else if (res.body === "Wrong Username/Password") {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else {
          res.should.have.status(expectedHTTPStatus);
          res.body.username.should.equal(username);
          done();
        }
      });
  });
}

function qualityEmployeeSessions(expectedHTTPStatus, username, password, type) {
  it("qualityEmployee sessions", function (done) {
    let user = {
      username: username,
      password: password,
      type: type,
    };
    agent
      .post("/api/qualityEmployeeSessions/")
      .send(user)
      .then(function (res) {
        if (
          username === undefined ||
          password.length < 8 ||
          type !== "qualityEmployee"
        ) {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else if (res.body.message === "User not existing") {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else if (res.body === "Wrong Username/Password") {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else {
          res.should.have.status(expectedHTTPStatus);
          res.body.username.should.equal(username);
          done();
        }
      });
  });
}

function deliveryEmployeeSessions(
  expectedHTTPStatus,
  username,
  password,
  type
) {
  it("deliveryEmployee sessions", function (done) {
    let user = {
      username: username,
      password: password,
      type: type,
    };
    agent
      .post("/api/deliveryEmployeeSessions/")
      .send(user)
      .then(function (res) {
        if (
          username === undefined ||
          password.length < 8 ||
          type !== "deliveryEmployee"
        ) {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else if (res.body.message === "User not existing") {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else if (res.body === "Wrong Username/Password") {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else {
          res.should.have.status(expectedHTTPStatus);
          res.body.username.should.equal(username);
          done();
        }
      });
  });
}

function editUser(expectedHTTPStatus, username, oldType, newType) {
  it("edit users", function (done) {
    if (username !== undefined) {
      let user = {
        username: username,
        oldType: oldType,
        newType: newType,
      };
      agent
        .put("/api/users/" + username)
        .send(user)
        .then(function (res) {
          res.should.have.status(expectedHTTPStatus);
          done();
        });
    } else if (
      res.message === "wrong username or oldType fields or user doesn't exists"
    ) {
      agent
        .put("/api/users/" + username)
        .send(user)
        .then(function (res) {
          res.should.have.status(expectedHTTPStatus);
          done();
        });
    }
  });
}
function deleteUser(expectedHTTPStatus, username, type) {
  it("delete user sessions", function (done) {
    let user = {
      username: username,
      type: type,
    };
    agent
      .delete("/api/users/" + username + "/" + type)
      .send(user)
      .then(function (res) {
        if (username !== undefined && type !== undefined) {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else if (res.error === "Validation problems") {
          res.should.have.status(expectedHTTPStatus);
          done();
        } else if (res.message) {
          res.should.have.status(expectedHTTPStatus);
          done();
        }
      });
  });
}
