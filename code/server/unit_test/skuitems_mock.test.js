const SKUIC = require("../modules/Controller/SKUItemsController");
const dao = require("../modules/DB/mockdao");
const skui = new SKUIC(dao);

describe("get skus", () => {
  beforeEach(() => {
    dao.all.mockReset();
    dao.all.mockReturnValueOnce([
      {
        RFID: "12345678901234567890123456789014",
        skuID: 1,
        available: 50,
        dateOfStock: "2020/10/22",
      },
    ]);
  });

  test("get items", async () => {
    let res = await skui.getSKUItems();
    console.log(res);
    expect(res).toEqual([
      {
        RFID: "12345678901234567890123456789014",
        SKUId: 1,
        Available: 50,
        DateOfStock: "2020/10/22",
      },
    ]);
  });
});

describe("get skus by id", () => {
  const item = {
    RFID: "12345678901234567890123456789014",
    skuID: 1,
    available: 1,
    dateOfStock: "2020/10/22",
  };
  beforeEach(() => {
    dao.all.mockReset();
    dao.all.mockReturnValueOnce([item]);
  });

  test("get items", async () => {
    let res = await skui.getSKUItemsBySKUId();
    console.log(res);
    expect(res).toEqual([
      {
        RFID: "12345678901234567890123456789014",
        SKUId: 1,
        DateOfStock: "2020/10/22",
      },
    ]);
  });
});

describe("get skus by rfid", () => {
  const item = {
    RFID: "12345678901234567890123456789014",
    skuID: 1,
    available: 30,
    dateOfStock: "2020/10/22",
  };
  beforeEach(() => {
    dao.get.mockReset();
    dao.get.mockReturnValueOnce(item);
  });

  test("get items", async () => {
    let res = await skui.getSKUItemsByRFID(item.rfid);
    expect(res).toEqual({
      RFID: "12345678901234567890123456789014",
      SKUId: 1,
      Available: 30,
      DateOfStock: "2020/10/22",
    });
  });
});

describe("set sku items", () => {
  const newitem = {
    RFID: "12345678901234567890123456789014",
    available: 30,
    skuId: 1,
    dateOfStock: "2020/10/22",
  };
  beforeEach(() => {
    dao.run.mockReset(newitem);
    dao.get.mockReset(newitem);
    dao.all.mockReset([{ ID: 1 }]);
  });
  test("set item", async () => {
    let res = await skui.newSKUItem(
      newitem.RFID,
      newitem.skuID,
      newitem.dateOfStock
    );
    expect(res).toBe(undefined);
  });
});

// describe("get all suppliers", () => {
//   beforeEach(() => {
//     dao.all.mockReset();
//     dao.get.mockReset();

//     dao.all.mockReturnValueOnce([
//       {
//         id: 1,
//         name: "John",
//         surname: "John",
//         email: "john.snow@ezwh.com",
//         type: "supplier",
//       },
//     ]);
//   });

//   test("get All Suppliers", async () => {
//     let res = await user.getSuppliers();
//     expect(res).toEqual([
//       {
//         id: undefined,
//         name: "John",
//         surname: "John",
//         email: "john.snow@supplier.ezwh.com",
//       },
//     ]);
//   });
// });

// describe("edituser", () => {
//   const edituser = {
//     id: 1,
//     email: "john.snow@ezwh.com",
//     oldType: "supplier",
//     newType: "clerk",
//   };
//   beforeEach(() => {
//     dao.get.mockReset();
//     dao.get.mockReturnValueOnce(edituser);
//     dao.run.mockReset();
//     dao.run.mockReturnValueOnce(edituser);
//   });

//   test("edit user", async () => {
//     let res = await user.editUser(
//       edituser.email,
//       edituser.oldType,
//       edituser.newType
//     );
//     expect(res).toEqual({
//       email: "john.snow@ezwh.com",
//       id: 1,
//       oldType: "supplier",
//       newType: "clerk",
//     });
//   });
// });
// describe("deleteuser", () => {
//   const deleteuser = {
//     id: 1,
//     email: "john.snow@ezwh.com",
//     type: "supplier",
//   };
//   beforeEach(() => {
//     dao.get.mockReset();
//     dao.get.mockReturnValueOnce(deleteuser);
//     dao.run.mockReset();
//     dao.run.mockReturnValueOnce(deleteuser);
//   });

//   test("edit user", async () => {
//     let res = await user.editUser(deleteuser.email, deleteuser.type);
//     expect(res).toEqual({
//       id: 1,
//       email: "john.snow@ezwh.com",
//       type: "supplier",
//     });
//   });
// });
