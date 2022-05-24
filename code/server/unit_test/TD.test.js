const TDController = require("../modules/Controller/TDController");
const DAO = require("../modules/DB/DAO");
const dao = new DAO();
const TDC = new TDController(dao);


describe("getItems", () => {
    beforeEach(async () => {
      await TDC.deleteAll();
    
      await TDC.TestDescriptor(
            5,
            "cvbc",
            "bvnvn",
            4
            
      );
    });
    afterEach(async () => {
        await TDC.deleteAll();
       
    });
    testTestDescriptor(
        {
            id: 5,
            Name:"cvbc",
            proceduredescription: "bvnvn",
            idSKU:4

        });
    });

async function testTestDescriptor() {
    test("getItems", async () => {
        let res = await TDC.TestDescriptor(Id);
        console.log(res);
        expect(Id).toEqual({
            Id : res["result"][0].id,
            Name : res["result"][0].description,
            proceduredescription: res["result"][0].weight,
            idSKU : res["result"][0].volume,
            
    });
    });
}