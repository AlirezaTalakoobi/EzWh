const SKUController = require("../modules/Controller/SKUController")
const DAO = require("../modules/DB/DAO");
const dao = new DAO();
const SKC = new SKUController(dao);


describe("SKU", () => {
    beforeEach(async () => {
        //await SKC.deleteAll();


        await SKC.newSKU( {
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        }
    );
    });
    afterEach(async () => {
        //  await TDC.deleteAll();
        //   await uc_user.deleteAll();
        //   await uc_sku.deleteAll();
    });
    TestSKC(
        {

            
            
            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            availableQuantity: 50,
            price: 10.99,
            positionID:null ,
            

        }

    );
    // });

    async function TestSKC(test1) {
        test("getSKUByid", async () => {
            let res = await SKC.getSKUbyId("920");
            console.log(res);
            expect(test1).toEqual({

                SKUId: res[0].SKUId,
                description:res[0].description,
                weight: res[0].weight,
                volume: res[0].volume,
                notes: res[0].notes,
                availableQuantity: res[0].availableQuantity,
                price: res[0].price,
                positionID: res[0].positionID

            });
        });
    }

    testgetSKU(
        {
            description : " new sku",
            weight:100,
            volume:50,
            notes:"first SKU",
            availableQuantity:50,
            price :10.99
        }
    );





    async function testgetSKU(Body) {
        test('set Item', async () => {
            let res = await SKC.newSKU(Body);
            expect(res).toEqual({"id": 1064});
        });

    }
    
    testEtdit(
        {
            newDescription : "a new sku",
            newWeight : 100,
            newVolume : 50,
            newNotes : "first SKU",
            newPrice : 10.99,
            newAvailableQuantity: 50
        },920
        
    );


    async function testEtdit(Body,Id) {
        test('update Item', async () => {
            let res = await SKC.editsku(Body,Id);
            expect(res).toEqual({"message": "Success"});
        });
    }

    
   
    
    
    testEtditposition(
        {
            position: "800234523412"
        },920
        
    );


    async function testEtditposition(position,Id) {
        test('update Item Position', async () => {
            let res = await SKC.editskuPosition(position,Id);
            expect(res).toEqual({"message": "Success"});
        });
    }

})