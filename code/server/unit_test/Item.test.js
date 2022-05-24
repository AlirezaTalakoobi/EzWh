const ItemController = require("../modules/Controller/ItemController");
const UserController = require("../modules/Controller/UserController");
const SKUController = require("../modules/Controller/SKUController");
const PositionController = require("../modules/Controller/PositionController");
const DAO = require("../modules/DB/DAO");
const dao = new DAO();
const uc = new ItemController(dao);
const uc_user = new UserController(dao);
const uc_sku = new SKUController(dao);
const uc_pos = new PositionController(dao); 


describe("getItems", () => {
    beforeEach(async () => {
      await uc.deleteAll();
    //   await uc_pos.deleteAll();
    //   await uc_user.deleteAll();
    //   await uc_sku.deleteAll();
    //   await uc_user.create();
    //   await uc_sku.create(); 
      await uc.createItem(
            12,
            "a new item",
            10.99,
            1,
            2
      );
    });
    afterEach(async () => {
        await uc.deleteAll();
        //   await uc_user.deleteAll();
        //   await uc_sku.deleteAll();
    });
    testGetItems(
        {
            id : 12,
            description : "a new item",
            price : 10.99,
            SKUId : 1,
            supplierId : 2

        });
    });

async function testGetItems(Items) {
    test("getItems", async () => {
        let res = await uc.getItems();
        expect(Items).toEqual({
            id : res["result"][0].id,
            description : res["result"][0].description,
            price : res["result"][0].price,
            SKUId : res["result"][0].SKUId,
            supplierId : res["result"][0].supplierId
    });
    });
}

describe("getItemByID", () => {
    beforeEach(async () => {
      await uc.deleteAll();
    //   await uc_user.deleteAll();
    //   await uc_sku.deleteAll();
    //   await uc_user.create();
    //   await uc_sku.create(); 
      await uc.createItem(
            12,
            "a new item",
            10.99,
            1,
            2
      );
    });
    afterEach(async () => {
        await uc.deleteAll();
        //   await uc_user.deleteAll();
        //   await uc_sku.deleteAll();
    });
    testGetItemByID(
        {
            id : 12,
            description : "a new item",
            price : 10.99,
            SKUId : 1,
            supplierId : 2

        });
    });

async function testGetItemByID(Items) {
    test("getItemByID", async () => {
        let res = await uc.getItemByID(12);
        expect(Items).toEqual({
            id : res["result"][0].id,
            description : res["result"][0].description,
            price : res["result"][0].price,
            SKUId : res["result"][0].SKUId,
            supplierId : res["result"][0].supplierId
    });
    });
}


describe("createItem", () => {
    beforeEach(async () => {
        await uc.deleteAll();
      //   await uc_user.deleteAll();
      //   await uc_sku.deleteAll();
      //   await uc_user.create();
      //   await uc_sku.create(); 
      });
      afterEach(async () => {
          await uc.deleteAll();
          //   await uc_user.deleteAll();
          //   await uc_sku.deleteAll();
      });
      testCreateItem(
          {
              id : 12,
              description : "a new item",
              price : 10.99,
              SKUId : 1,
              supplierId : 2
  
          });
      });

async function testCreateItem(Items) {
    test("createPosition", async () => {
        let res = await uc.createItem(
            Items["id"],Items["description"],Items["price"],Items["SKUId"],Items["supplierId"]);
        res = await uc.getItems();
        expect(Items).toEqual({

            id : res["result"][0].id,
            description : res["result"][0].description,
            price : res["result"][0].price,
            SKUId : res["result"][0].SKUId,
            supplierId : res["result"][0].supplierId
    });
    });
}

describe("modifyItem", () => {
    beforeEach(async () => {
        await uc.deleteAll();
      //   await uc_user.deleteAll();
      //   await uc_sku.deleteAll();
      //   await uc_user.create();
      //   await uc_sku.create(); 
        await uc.createItem(
              12,
              "a new item",
              10.99,
              1,
              2
        );
      });
      afterEach(async () => {
          await uc.deleteAll();
          //   await uc_user.deleteAll();
          //   await uc_sku.deleteAll();
      });
      testModifyItem(
          {
              id : 12,
              description : "a new sku",
              price : 12.99,
              SKUId : 1,
              supplierId : 2
  
          });
      });

async function testModifyItem(Items) {
    test("modifyItem", async () => {
        let res = await uc.modifyItem(
            12,"a new sku", 12.99);
            res = await uc.getItems();
            expect(Items).toEqual({
    
                id : res["result"][0].id,
                description : res["result"][0].description,
                price : res["result"][0].price,
                SKUId : res["result"][0].SKUId,
                supplierId : res["result"][0].supplierId
    });
    });
}

describe("deleteItem", () => {
    beforeEach(async () => {
      await uc.deleteAll();
      await uc.createItem(
        12,
        "a new item",
        10.99,
        1,
        2
  );
    });
    testDeleteItem({id:1});
    afterEach(async () => {
      await uc.deleteAll();
    });
  });
  
  async function testDeleteItem(Items) {
    test("deleteItem", async () => {
      let res = await uc.deleteItem(Items['id']);
      expect(res['ans']).toEqual(204);
    });
  }