const UserC = require("../modules/Controller/UserController");
const dao = require("../modules/DB/mockdao");
const user = new UserC(dao);
const bcrypt = require("bcrypt");
const saltRounds = 10;

describe("get user", () => {
  beforeEach(() => {
    dao.get.mockReset();
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync("testpassword", salt);
    const user = {
      id: undefined,
      name: "davide",
      surname: "davide",
      email: "user1@ezwh.com",
      type: "clerk",
      password: hash,
    };
    dao.get.mockReturnValueOnce(user);
  });

  test("get User", async () => {
    const username = "user1@ezwh.com";
    let res = await user.getUser(username, "testpassword");
    expect(res).toEqual({
      id: undefined,
      username: "user1@ezwh.com",
      name: "davide",
      surname: "davide",
      type: "clerk",
    });
  });
});

describe("get all users", () => {
  beforeEach(() => {
    dao.all.mockReset();
    dao.all.mockReturnValueOnce([
      {
        id: 1,
        name: "John",
        surname: "Snow",
        email: "john.snow@ezwh.com",
        type: "clerk",
      },
    ]);
  });

  test("get All Users", async () => {
    let res = await user.getStoredUsers();
    expect(res).toEqual([
      {
        id: undefined,
        name: "John",
        surname: "Snow",
        email: "john.snow@clerk.ezwh.com",
        type: "clerk",
      },
    ]);
  });
});
describe("set users", () => {
  beforeEach(() => {
    dao.run.mockReset();
  });
  test("setUser", async () => {
    const newuser = {
      name: "Davide",
      surname: "Andriano",
      username: "user2@ezwh.com",
      type: "clerk",
      password: "testpassword",
    };
    let res = await user.newUser(
      newuser.name,
      newuser.surname,
      newuser.username,
      newuser.type,
      newuser.password
    );
    expect(res).toBe(undefined);
  });
});

describe("get all suppliers", () => {
  beforeEach(() => {
    dao.all.mockReset();
    dao.get.mockReset();

    dao.all.mockReturnValueOnce([
      {
        id: 1,
        name: "John",
        surname: "John",
        email: "john.snow@ezwh.com",
        type: "supplier",
      },
    ]);
  });

  test("get All Suppliers", async () => {
    let res = await user.getSuppliers();
    expect(res).toEqual([
      {
        id: undefined,
        name: "John",
        surname: "John",
        email: "john.snow@supplier.ezwh.com",
      },
    ]);
  });
});

describe("edituser", () => {
  const edituser = {
    id: 1,
    email: "john.snow@ezwh.com",
    oldType: "supplier",
    newType: "clerk",
  };
  beforeEach(() => {
    dao.get.mockReset();
    dao.get.mockReturnValueOnce(edituser);
    dao.run.mockReset();
    dao.run.mockReturnValueOnce(edituser);
  });

  test("edit user", async () => {
    let res = await user.editUser(
      edituser.email,
      edituser.oldType,
      edituser.newType
    );
    expect(res).toEqual({
      email: "john.snow@ezwh.com",
      id: 1,
      oldType: "supplier",
      newType: "clerk",
    });
  });
});
describe("deleteuser", () => {
  const deleteuser = {
    id: 1,
    email: "john.snow@ezwh.com",
    type: "supplier",
  };
  beforeEach(() => {
    dao.get.mockReset();
    dao.get.mockReturnValueOnce(deleteuser);
    dao.run.mockReset();
    dao.run.mockReturnValueOnce(deleteuser);
  });

  test("edit user", async () => {
    let res = await user.editUser(deleteuser.email, deleteuser.type);
    expect(res).toEqual({
      id: 1,
      email: "john.snow@ezwh.com",
      type: "supplier",
    });
  });
});
