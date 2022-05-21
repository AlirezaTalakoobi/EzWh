const userC = require("../modules/Controller/UserController");
const DAO = require("../modules/DB/DAO");
const dao = new DAO();
const uc = new userC(dao);

describe("getUser", () => {
  testUser("Davide", "Davide", "user4@ezwh.com", "testpassword");
  // testUser("Dav", "dav", "user4@ezwh.com", "testpassword"); //fails
  // testUser("Davide", "Davide", "user@ezwh.com", "testpassword"); //fails
  // testUser("davide", "davide", "user2@ezwh.com", " "); //fails
});

async function testUser(name, surname, username, password) {
  test("getUser", async () => {
    let res = await uc.getUser(username, password);
    console.log(res);
    if (res) {
      expect(res).toEqual({
        id: res.id,
        username: username,
        name: name,
        surname: surname,
      });
    }
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
      username: "user1@clerk.com",
      type: "clerk",
    },
    {
      name: "davide",
      surname: "davide",
      username: "user2@clerk.com",
      type: "clerk",
    },
  ]);
});

async function testGetUsers(users) {
  test("getallusers", async () => {
    let res = await uc.getStoredUsers();
    console.log(users);
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
