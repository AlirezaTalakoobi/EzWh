const userC = require("../modules/Controller/UserController");
const DAO = require("../modules/DB/DAO");
const dao = new DAO();
const uc = new userC(dao);

describe("getUser", () => {
  beforeEach(async () => {
    await uc.deleteAll();
    await uc.newUser(
      "davide",
      "davide",
      "user1@ezwh.com",
      "clerk",
      "testpassword"
    );
  });
  testUser("davide", "davide", "user1@ezwh.com", "clerk", "testpassword");
});

async function testUser(name, surname, username, type, password) {
  test("getUser", async () => {
    let res = await uc.getUser(username, password);
    if (res) {
      expect(res).toEqual({
        id: res.id,
        username: username,
        name: name,
        surname: surname,
        type: type,
      });
    }
  });
}
describe("getUserError", () => {
  testUserWrong("user1@ezwh.com", "testpa");
});

async function testUserWrong(username, password) {
  test("Wrong fields", async () => {
    let res = await uc.getUser(username, password);
    expect(res).toEqual({
      message: "Wrong Username/Password",
    });
  });
}

describe("getAllUsers", () => {
  beforeEach(async () => {
    await uc.deleteAll();
    await uc.newUser(
      "davide",
      "davide",
      "user1@ezwh.com",
      "clerk",
      "testpassword"
    );
    await uc.newUser(
      "davide",
      "davide",
      "user2@ezwh.com",
      "clerk",
      "testpassword"
    );
  });
  testGetUsers([
    {
      name: "davide",
      surname: "davide",
      username: "user1@clerk.ezwh.com",
      type: "clerk",
    },
    {
      name: "davide",
      surname: "davide",
      username: "user2@clerk.ezwh.com",
      type: "clerk",
    },
  ]);
});

async function testGetUsers(users) {
  test("getallusers", async () => {
    let res = await uc.getStoredUsers();
    expect(res).toEqual([
      {
        id: res[0].id,
        name: users[0].name,
        surname: users[0].surname,
        email: users[0].username,
        type: users[0].type,
      },
      {
        id: res[1].id,
        name: users[1].name,
        surname: users[1].surname,
        email: users[1].username,
        type: users[1].type,
      },
    ]);
  });
}

describe("insertNewUser", () => {
  beforeEach(async () => {
    // await uc.deleteAll();
  });
  testInsertUser({
    name: "davide",
    surname: "davide",
    username: "user1@clerk.com",
    type: "supplier",
    password: "testpassword",
  });
  testInsertUserExisting({
    name: "davide",
    surname: "davide",
    username: "user1@clerk.com",
    type: "supplier",
    password: "testpassword",
  });
});

async function testInsertUser(user) {
  test("insert newUser", async () => {
    let res = await uc.newUser(
      user.name,
      user.surname,
      user.username,
      user.type,
      user.password
    );
    res = await uc.getUser(user.username, user.password);
    expect(res).toEqual({
      id: res.id,
      username: user.username.replace("ezwh", `${user.type}`),
      name: user.name,
      surname: user.surname,
      type: user.type,
    });
  });
}

async function testInsertUserExisting(user) {
  test("insert newUser", async () => {
    let res = await uc.newUser(
      user.name,
      user.surname,
      user.username,
      user.type,
      user.password
    );
    expect(res).toEqual({
      message: "Conflict",
    });
  });
}

describe("getSuppliers", () => {
  beforeEach(async () => {
    await uc.deleteAll();
  });
  afterEach(async () => {
    await uc.deleteAll();
  });
  testGetSuppliers([
    {
      name: "davide",
      surname: "davide",
      username: "user1@ezwh.com",
      type: "supplier",
      password: "testpassword",
    },
    {
      name: "davide",
      surname: "davide",
      username: "user2@ezwh.com",
      type: "clerk",
      password: "testpassword",
    },
  ]);
  testEmptySuppliers();
});

async function testEmptySuppliers() {
  test("getEmptySuppliers", async () => {
    let res = await uc.getSuppliers();
    expect(res).toEqual({ error: "Users Not found" });
  });
}
async function testGetSuppliers(users) {
  test("getsuppliers", async () => {
    for (user of users) {
      await uc.newUser(
        user.name,
        user.surname,
        user.username,
        user.type,
        user.password
      );
    }
    let res = await uc.getSuppliers();
    expect(res).toEqual([
      {
        id: res[0].id,
        name: users[0].name,
        surname: users[0].surname,
        email: users[0].username.replace("ezwh", `${users[0].type}.ezwh`),
      },
    ]);
  });
}

describe("editUser", () => {
  beforeEach(async () => {
    await uc.deleteAll();
    await uc.newUser(
      "davide",
      "davide",
      "user1@ezwh.com",
      "supplier",
      "testpassword"
    );
  });
  testEditUser({
    username: "user1@ezwh.com",
    newType: "clerk",
    oldType: "supplier",
  });
  afterEach(async () => uc.deleteAll());
  testEditUserNotDefined({
    username: "user1@ezwh.com",
    newType: "manager",
    oldType: "manager",
  });
});

async function testEditUser(user) {
  test("edituser", async () => {
    await uc.editUser(user.username, user.oldType, user.newType);
    let res = await uc.getUser(user.username, "testpassword");
    expect(res).toEqual({
      id: res.id,
      username: user.username,
      name: res.name,
      surname: res.surname,
      type: user.newType,
    });
  });
}
async function testEditUserNotDefined(user) {
  test("edituser", async () => {
    let res = await uc.editUser(user.username, user.oldType, user.newType);
    expect(res).toEqual({
      message: "wrong username or oldType fields or user doesn't exists",
    });
  });
}

describe("deleteUser", () => {
  beforeEach(async () => {
    await uc.deleteAll();
    await uc.newUser(
      "davide",
      "davide",
      "user1@ezwh.com",
      "supplier",
      "testpassword"
    );
  });
  testDeleteUser({
    username: "user1@ezwh.com",
    type: "supplier",
  });
  testDeleteUserNotExisting({
    username: "user5@ezwh.com",
    type: "supplier",
  });
});

async function testDeleteUser(user) {
  test("deleteuser", async () => {
    res = await uc.deleteUser(user.username, user.type);
    res = await uc.getUser(user.username, "testpassword");
    expect(res).toEqual(undefined);
  });
}
async function testDeleteUserNotExisting(user) {
  test("deleteuser", async () => {
    res = await uc.deleteUser(user.username, user.type);
    expect(res).toEqual({
      message: "wrong username or oldType fields or user doesn't exists",
    });
  });
}
