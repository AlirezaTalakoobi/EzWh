const TDController = require("../modules/Controller/TDController");
const DAO = require("../modules/DB/DAO");
const dao = new DAO();
const TDC = new SKUController(dao);


describe("getItems", () => {
    beforeEach(async () => {
      await TDC.deleteAll();
    //   await uc_user.deleteAll();
    //   await uc_sku.deleteAll();
    //   await uc_user.create();
    //   await uc_sku.create(); 
      await TDC.createItem(
            33,
            "a new item",
            "Pouya",
            1
            
      );
    });
    afterEach(async () => {
        await TDC.deleteAll();
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

async function TestTdescriptor(Items) {
    test("getItems", async () => {
        let res = await TDC.TestDescriptor();
        expect(Items).toEqual({
            id : res["result"][0].id,
            description : res["result"][0].description,
            price : res["result"][0].price,
            SKUId : res["result"][0].SKUId,
            supplierId : res["result"][0].supplierId
    });
    });
}