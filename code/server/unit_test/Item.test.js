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
      await uc_user.deleteAll();
      await uc_sku.deleteAll();
      await uc_pos.deleteAll();
      
    });
    afterEach(async () => {
        await uc.deleteAll();
        await uc_user.deleteAll();
        await uc_sku.deleteAll();
        await uc_pos.deleteAll();

    });
    Items = {
        id : 12,
            description : "a new item",
            price : 10.99,
            SKUId : null,
            supplierId : null
    }
    testGetItems(Items);
    });

async function testGetItems(Items) {
    test("getItems", async () => {
        let passing_user = null;
        let passing_sku = null;
        await uc_user.newUser(
            "John",
            "Smith",
            "user1@ezwh.com",
            "customer",
            "testpassword",
    
          );
          let user = await uc_user.getStoredUsers();
          passing_user = user[0]["id"];
          await uc_pos.createPosition(
            "800234543412",
            "8002",
            "3454",
            "3412",
            1000,
            1000
        );
          await uc_sku.newSKU({
            description : "a new sku",
             weight : 100,
             volume : 50,
             notes : "first SKU",
             price : 10.99,
             availableQuantity : 50
          }); 
          sku = await uc_sku.getsku();
          passing_sku = sku[0]["SKUId"]
          await uc.createItem(
                12,
                "a new item",
                10.99,
                passing_sku,
                passing_user
          );
          Items = {
            id : 12,
                description : "a new item",
                price : 10.99,
                SKUId : passing_sku,
                supplierId : passing_user
        }

        let res = await uc.getItems();
        // console.log(Items)

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
        await uc_user.deleteAll();
        await uc_sku.deleteAll();
        await uc_pos.deleteAll();
        
      });
      afterEach(async () => {
          await uc.deleteAll();
          await uc_user.deleteAll();
          await uc_sku.deleteAll();
          await uc_pos.deleteAll();

      });
      Items = {
          id : 12,
              description : "a new item",
              price : 10.99,
              SKUId : null,
              supplierId : null
      }
      testGetItemByID(Items);
      });

async function testGetItemByID(Items) {
    test("getItemByID", async () => {
        let passing_user = null;
        let passing_sku = null;
        await uc_user.newUser(
            "John",
            "Smith",
            "user1@ezwh.com",
            "customer",
            "testpassword",
    
          );
          let user = await uc_user.getStoredUsers();
          passing_user = user[0]["id"];
          await uc_pos.createPosition(
            "800234543412",
            "8002",
            "3454",
            "3412",
            1000,
            1000
        );
          await uc_sku.newSKU({
            description : "a new sku",
             weight : 100,
             volume : 50,
             notes : "first SKU",
             price : 10.99,
             availableQuantity : 50
          }); 
          sku = await uc_sku.getsku();
          passing_sku = sku[0]["SKUId"]
          await uc.createItem(
                12,
                "a new item",
                10.99,
                passing_sku,
                passing_user
          );
          Items = {
            id : 12,
                description : "a new item",
                price : 10.99,
                SKUId : passing_sku,
                supplierId : passing_user
        }

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
        await uc_user.deleteAll();
        await uc_sku.deleteAll();
        await uc_pos.deleteAll();
        
      });
      afterEach(async () => {
          await uc.deleteAll();
          await uc_user.deleteAll();
          await uc_sku.deleteAll();
          await uc_pos.deleteAll();

      });
      Items = {
          id : 12,
              description : "a new item",
              price : 10.99,
              SKUId : null,
              supplierId : null
      }
      testCreateItem(Items);
      });

async function testCreateItem(Items) {
    test("createPosition", async () => {
        let passing_user = null;
        let passing_sku = null;
        await uc_user.newUser(
            "John",
            "Smith",
            "user1@ezwh.com",
            "customer",
            "testpassword",
    
          );
          let user = await uc_user.getStoredUsers();
          passing_user = user[0]["id"];
          await uc_pos.createPosition(
            "800234543412",
            "8002",
            "3454",
            "3412",
            1000,
            1000
        );
          await uc_sku.newSKU({
            description : "a new sku",
             weight : 100,
             volume : 50,
             notes : "first SKU",
             price : 10.99,
             availableQuantity : 50
          }); 
          sku = await uc_sku.getsku();
          passing_sku = sku[0]["SKUId"]
          await uc.createItem(
                12,
                "a new item",
                10.99,
                passing_sku,
                passing_user
          );
          Items = {
            id : 12,
                description : "a new item",
                price : 10.99,
                SKUId : passing_sku,
                supplierId : passing_user
        }

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
        await uc_user.deleteAll();
        await uc_sku.deleteAll();
        await uc_pos.deleteAll();
        
      });
      afterEach(async () => {
          await uc.deleteAll();
          await uc_user.deleteAll();
          await uc_sku.deleteAll();
          await uc_pos.deleteAll();

      });
      Items = {
          id : 12,
              description : "a new item",
              price : 10.99,
              SKUId : null,
              supplierId : null
      }
      testModifyItem(Items);
      });

async function testModifyItem(Items) {
    test("modifyItem", async () => {

        let passing_user = null;
        let passing_sku = null;
        await uc_user.newUser(
            "John",
            "Smith",
            "user1@ezwh.com",
            "customer",
            "testpassword",
    
          );
          let user = await uc_user.getStoredUsers();
          passing_user = user[0]["id"];
          await uc_pos.createPosition(
            "800234543412",
            "8002",
            "3454",
            "3412",
            1000,
            1000
        );
          await uc_sku.newSKU({
            description : "a new sku",
             weight : 100,
             volume : 50,
             notes : "first SKU",
             price : 10.99,
             availableQuantity : 50
          }); 
          sku = await uc_sku.getsku();
          passing_sku = sku[0]["SKUId"]
          await uc.createItem(
                12,
                "a new item",
                10.99,
                passing_sku,
                passing_user
          );
          Items = {
            id : 12,
                description : "a new sku",
                price : 12.99,
                SKUId : passing_sku,
                supplierId : passing_user
        }

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
        await uc_user.deleteAll();
        await uc_sku.deleteAll();
        await uc_pos.deleteAll();
        
      });
      afterEach(async () => {
          await uc.deleteAll();
          await uc_user.deleteAll();
          await uc_sku.deleteAll();
          await uc_pos.deleteAll();

      });
      Items = {
          id : 12,
              description : "a new item",
              price : 10.99,
              SKUId : null,
              supplierId : null
      }
      testDeleteItem({id:12});
      });
  
  async function testDeleteItem(Items) {
    test("deleteItem", async () => {
      let res = await uc.deleteItem(Items['id']);
      expect(res).toEqual(204);
    });
  }