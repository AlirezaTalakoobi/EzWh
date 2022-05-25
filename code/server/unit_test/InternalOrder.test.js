const internalC = require("../modules/Controller/InternalOrderController");
const userC = require("../modules/Controller/UserController");
const skuC = require("../modules/Controller/SKUController");
const skuItemC = require("../modules/Controller/SKUItemsController");

const DAO = require("../modules/DB/DAO");

const { expect } = require("chai");

const dao = new DAO();

const ic = new internalC(dao);
const uc = new userC(dao);
const sc = new skuC(dao);
const si = new skuItemC(dao);

describe("Get restock orders", () => {
  beforeEach(async () => {
    await ic.deleteAllInternalOrders();
    await uc.deleteAll();
    await sc.deleteAllSKU();
  });
  testGetInternalAllOrders();
});

async function testGetInternalAllOrders() {
  test("getInternalOrders", async () => {
    const user = await uc.newUser(
      "Michael",
      "Jordan",
      "mj@ezwh.com",
      "customer",
      "MJtheGOAT"
    );
    const sku1 = await sc.newSKU({
      description: "Acer Aspire 3",
      weight: 100,
      volume: 20,
      price: 237,
      availableQuantity: 15,
    });
    const sku2 = await sc.newSKU({
      description: "Canyon Stoic 4",
      weight: 14000,
      volume: 400,
      price: 1789,
      availableQuantity: 10,
    });
    const order1 = await ic.createInternalOrder("2021/11/29 09:33", user.id, [
      {
        SKUId: sku2.id,
        description: "New super cool mountain bike: CANYON STOIC 4",
        price: 1789,
        qty: 2,
      },
    ]);
    const order2 = await ic.createInternalOrder("2022/05/05 09:33", user.id, [
      {
        SKUId: sku1.id,
        description: "Sweet restock of requested Acer Aspire 3",
        price: 237,
        qty: 1,
      },
    ]);

    const expectedOrders = [
      {
        id: order1,
        issueDate: "2021/11/29 09:33",
        state: "ISSUED",
        customerId: user.id,
        products: [
          {
            SKUId: sku2.id,
            description: "New super cool mountain bike: CANYON STOIC 4",
            price: 1789,
            qty: 2,
          },
        ],
      },
      {
        id: order2,
        issueDate: "2022/05/05 09:33",
        state: "ISSUED",
        customerId: user.id,
        products: [
          {
            SKUId: sku1.id,
            description: "Sweet restock of requested Acer Aspire 3",
            price: 237,
            qty: 1,
          },
        ],
      },
    ];

    const result = await ic.getInternalOrders();

    expect(result.length).equal(2);
    expect(result).to.deep.equal(expectedOrders);
  });
}

describe("Get internal orders issued", () => {
  beforeEach(async () => {
    await ic.deleteAllInternalOrders();
    await uc.deleteAll();
    await sc.deleteAllSKU();
  });
  testGetInternalOrdersIssued();
});

async function testGetInternalOrdersIssued(orders) {
  test("getRestockOrder", async () => {
    const user = await uc.newUser(
      "Michael",
      "Jordan",
      "mj@ezwh.com",
      "customer",
      "MJtheGOAT"
    );
    const sku1 = await sc.newSKU({
      description: "Acer Aspire 3",
      weight: 100,
      volume: 20,
      price: 237,
      availableQuantity: 15,
    });
    const sku2 = await sc.newSKU({
      description: "Canyon Stoic 4",
      weight: 14000,
      volume: 400,
      price: 1789,
      availableQuantity: 10,
    });
    const order1 = await ic.createInternalOrder("2021/11/29 09:33", user.id, [
      {
        SKUId: sku2.id,
        description: "New super cool mountain bike: CANYON STOIC 4",
        price: 1789,
        qty: 2,
      },
    ]);
    const order2 = await ic.createInternalOrder("2022/05/05 09:33", user.id, [
      {
        SKUId: sku1.id,
        description: "Sweet restock of requested Acer Aspire 3",
        price: 237,
        qty: 1,
      },
    ]);
    await ic.changeStateOfInternalOrder(order2, "ACCEPTED");

    const expectedOrders = [
      {
        id: order1,
        issueDate: "2021/11/29 09:33",
        state: "ISSUED",
        customerId: user.id,
        products: [
          {
            SKUId: sku2.id,
            description: "New super cool mountain bike: CANYON STOIC 4",
            price: 1789,
            qty: 2,
          },
        ],
      },
    ];

    const result = await ic.getInternalOrdersIssued();

    expect(result.length).equal(1);
    expect(result).to.deep.equal(expectedOrders);
  });
}

describe("Get internal orders accepted", () => {
  beforeEach(async () => {
    await ic.deleteAllInternalOrders();
    await uc.deleteAll();
    await sc.deleteAllSKU();
  });
  testGetInternalOrdersAccepted();
});

async function testGetInternalOrdersAccepted(orders) {
  test("getRestockOrder", async () => {
    const user = await uc.newUser(
      "Michael",
      "Jordan",
      "mj@ezwh.com",
      "customer",
      "MJtheGOAT"
    );
    const sku1 = await sc.newSKU({
      description: "Acer Aspire 3",
      weight: 100,
      volume: 20,
      price: 237,
      availableQuantity: 15,
    });
    const sku2 = await sc.newSKU({
      description: "Canyon Stoic 4",
      weight: 14000,
      volume: 400,
      price: 1789,
      availableQuantity: 10,
    });
    const order1 = await ic.createInternalOrder("2021/11/29 09:33", user.id, [
      {
        SKUId: sku2.id,
        description: "New super cool mountain bike: CANYON STOIC 4",
        price: 1789,
        qty: 2,
      },
    ]);
    const order2 = await ic.createInternalOrder("2022/05/05 09:33", user.id, [
      {
        SKUId: sku1.id,
        description: "Sweet restock of requested Acer Aspire 3",
        price: 237,
        qty: 1,
      },
    ]);
    await ic.changeStateOfInternalOrder(order1, "ACCEPTED");

    const expectedOrders = [
      {
        id: order1,
        issueDate: "2021/11/29 09:33",
        state: "ACCEPTED",
        customerId: user.id,
        products: [
          {
            SKUId: sku2.id,
            description: "New super cool mountain bike: CANYON STOIC 4",
            price: 1789,
            qty: 2,
          },
        ],
      },
    ];

    const result = await ic.getInternalOrdersAccepted();

    expect(result.length).equal(1);
    expect(result).to.deep.equal(expectedOrders);
  });
}

describe("Get internal order by id", () => {
  beforeEach(async () => {
    await ic.deleteAllInternalOrders();
    await uc.deleteAll();
    await sc.deleteAllSKU();
  });
  testGetInternalOrder();
  testGetInternalOrderNotFound();
});

async function testGetInternalOrder() {
  test("getInternalOrder", async () => {
    const user = await uc.newUser(
      "Michael",
      "Jordan",
      "mj@ezwh.com",
      "customer",
      "MJtheGOAT"
    );
    const sku1 = await sc.newSKU({
      description: "Acer Aspire 3",
      weight: 100,
      volume: 20,
      price: 237,
      availableQuantity: 15,
    });
    const order2 = await ic.createInternalOrder("2022/05/05 09:33", user.id, [
      {
        SKUId: sku1.id,
        description: "Sweet restock of requested Acer Aspire 3",
        price: 237,
        qty: 1,
      },
    ]);

    const result = await ic.getInternalOrder(order2);

    const expectedOrder = {
      id: order2,
      issueDate: "2022/05/05 09:33",
      state: "ISSUED",
      customerId: user.id,
      products: [
        {
          SKUId: sku1.id,
          description: "Sweet restock of requested Acer Aspire 3",
          price: 237,
          qty: 1,
        },
      ],
    };

    expect(result).to.deep.equal(expectedOrder);
  });
}

async function testGetInternalOrderNotFound() {
  test("getInternalOrderNotFound", async () => {
    const user = await uc.newUser(
      "Michael",
      "Jordan",
      "mj@ezwh.com",
      "customer",
      "MJtheGOAT"
    );
    const sku1 = await sc.newSKU({
      description: "Acer Aspire 3",
      weight: 100,
      volume: 20,
      price: 237,
      availableQuantity: 15,
    });
    const order2 = await ic.createInternalOrder("2022/05/05 09:33", user.id, [
      {
        SKUId: sku1.id,
        description: "Sweet restock of requested Acer Aspire 3",
        price: 237,
        qty: 1,
      },
    ]);

    const result = await ic.getInternalOrder(order2 + 1);

    expect(result).to.deep.equal(-1);
  });
}

describe("Create new internal order and retrieve it by id", () => {
  beforeEach(async () => {
    await ic.deleteAllInternalOrders();
    await uc.deleteAll();
    await sc.deleteAllSKU();
  });
  testCreateInternalOrder();
  testCreateInternalOrderInvalidProducts();
  testCreateInternalOrderInvalidCustomer();
});

async function testCreateInternalOrder(issueDate, customerId, products) {
  test("createRestockOrder", async () => {
    const user = await uc.newUser(
      "Michael",
      "Jordan",
      "mj@ezwh.com",
      "customer",
      "MJtheGOAT"
    );
    const sku2 = await sc.newSKU({
      description: "Canyon Stoic 4",
      weight: 14000,
      volume: 400,
      price: 1789,
      availableQuantity: 10,
    });
    const order1 = await ic.createInternalOrder("2021/11/29 09:33", user.id, [
      {
        SKUId: sku2.id,
        description: "New super cool mountain bike: CANYON STOIC 4",
        price: 1789,
        qty: 2,
      },
    ]);

    const result = await ic.getInternalOrder(order1);

    const expectedOrder = {
      id: order1,
      issueDate: "2021/11/29 09:33",
      state: "ISSUED",
      customerId: user.id,
      products: [
        {
          SKUId: sku2.id,
          description: "New super cool mountain bike: CANYON STOIC 4",
          price: 1789,
          qty: 2,
        },
      ],
    };

    expect(order1).greaterThanOrEqual(1);
    expect(result).to.deep.equal(expectedOrder);
  });
}

async function testCreateInternalOrderInvalidProducts() {
  test("createRestockOrderInvalidProducts", async () => {
    const user = await uc.newUser(
      "Michael",
      "Jordan",
      "mj@ezwh.com",
      "customer",
      "MJtheGOAT"
    );
    const sku2 = await sc.newSKU({
      description: "Canyon Stoic 4",
      weight: 14000,
      volume: 400,
      price: 1789,
      availableQuantity: 10,
    });
    const order1 = await ic.createInternalOrder("2021/11/29 09:33", user.id, [
      {
        SKUId: sku2.id + 1,
        description: "New super cool mountain bike: CANYON STOIC 4",
        price: 1789,
        qty: 2,
      },
    ]);

    expect(order1).equal(-1);
  });
}

async function testCreateInternalOrderInvalidCustomer() {
  test("createRestockOrderInvalidCustomer", async () => {
    const user = await uc.newUser(
      "Michael",
      "Jordan",
      "mj@ezwh.com",
      "customer",
      "MJtheGOAT"
    );
    const sku2 = await sc.newSKU({
      description: "Canyon Stoic 4",
      weight: 14000,
      volume: 400,
      price: 1789,
      availableQuantity: 10,
    });
    const order1 = await ic.createInternalOrder(
      "2021/11/29 09:33",
      user.id + 1,
      [
        {
          SKUId: sku2.id,
          description: "New super cool mountain bike: CANYON STOIC 4",
          price: 1789,
          qty: 2,
        },
      ]
    );

    expect(order1).equal(-2);
  });
}

describe("Modify state of internal order and retrieve it by id", () => {
  beforeEach(async () => {
    await ic.deleteAllInternalOrders();
    await uc.deleteAll();
    await sc.deleteAllSKU();
    await si.deleteAll();
  });

  testModifyStateOfInternalOrderNotCompleted();
  testModifyStateOfInternalOrderCompleted();
});

async function testModifyStateOfInternalOrderNotCompleted() {
  test("changeStateOfRestockOrderNotCompleted", async () => {
    const user = await uc.newUser(
      "Michael",
      "Jordan",
      "mj@ezwh.com",
      "customer",
      "MJtheGOAT"
    );
    const sku1 = await sc.newSKU({
      description: "Acer Aspire 3",
      weight: 100,
      volume: 20,
      price: 237,
      availableQuantity: 15,
    });
    const order2 = await ic.createInternalOrder("2022/05/05 09:33", user.id, [
      {
        SKUId: sku1.id,
        description: "Sweet restock of requested Acer Aspire 3",
        price: 237,
        qty: 1,
      },
    ]);

    await ic.changeStateOfInternalOrder(order2, "ACCEPTED");

    const result = await ic.getInternalOrder(order2);
    //console.log(res);

    const expectedOrder = {
      id: order2,
      issueDate: "2022/05/05 09:33",
      state: "ACCEPTED",
      customerId: user.id,
      products: [
        {
          SKUId: sku1.id,
          description: "Sweet restock of requested Acer Aspire 3",
          price: 237,
          qty: 1,
        },
      ],
    };

    expect(result).to.deep.equal(expectedOrder);
  });
}

async function testModifyStateOfInternalOrderCompleted() {
  test("changeStateOfRestockOrderToCompleted", async () => {
    const user = await uc.newUser(
      "Michael",
      "Jordan",
      "mj@ezwh.com",
      "customer",
      "MJtheGOAT"
    );
    const sku1 = await sc.newSKU({
      description: "Acer Aspire 3",
      weight: 100,
      volume: 20,
      price: 237,
      availableQuantity: 15,
    });
    const order2 = await ic.createInternalOrder("2022/05/05 09:33", user.id, [
      {
        SKUId: sku1.id,
        description: "Sweet restock of requested Acer Aspire 3",
        price: 237,
        qty: 2,
      },
    ]);

    const skuItems = [
      { SkuId: sku1.id, RFID: "01234567890123456789012345678901" },
      { SkuId: sku1.id, RFID: "98765432109876543210987654321098" },
    ];
    await si.newSKUItem(skuItems[0].RFID, skuItems[0].SkuId, null);
    await si.newSKUItem(skuItems[1].RFID, skuItems[1].SkuId, null);

    await ic.changeStateOfInternalOrder(order2, "COMPLETED", skuItems);

    const result = await ic.getInternalOrder(order2);

    const expectedOrder = {
      id: order2,
      issueDate: "2022/05/05 09:33",
      state: "COMPLETED",
      customerId: user.id,
      products: [
        {
          SKUId: sku1.id,
          description: "Sweet restock of requested Acer Aspire 3",
          price: 237,
          RFID: skuItems[0].RFID,
        },
        {
          SKUId: sku1.id,
          description: "Sweet restock of requested Acer Aspire 3",
          price: 237,
          RFID: skuItems[1].RFID,
        },
      ],
    };

    expect(result).to.deep.equal(expectedOrder);
  });
}
