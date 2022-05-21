const userC = require("../modules/Controller/UserController");
const DAO = require("../modules/DB/DAO");
const dao = new DAO();
const uc = new userC(dao);

describe("get user", () => {
  testUser("Davide", "Davide", "user4@ezwh.com", "testpassword");
  testUser("Dav", "dav", "user4@ezwh.com", "testpassword"); //fails
  testUser("Davide", "Davide", "user@ezwh.com", "testpassword"); //fails
  testUser("davide", "davide", "user2@ezwh.com", " "); //fails
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
