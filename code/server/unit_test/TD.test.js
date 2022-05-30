const { Test } = require("mocha");
const TDController = require("../modules/Controller/TDController");
const DAO = require("../modules/DB/DAO");
const dao = new DAO();
const TDC = new TDController(dao);


describe("TestDescription", () => {
    beforeEach(async () => {
     // await TDC.deleteAll();
   

    await TDC.newTestDescriptor("aaaaa","bbbbb",4);
});
afterEach(async () => {
  //  await TDC.deleteAll();
    //   await uc_user.deleteAll();
    //   await uc_sku.deleteAll();
});
    testTestDescriptor(
        {
            
            Name:"aaaaa",
            proceduredescription: "bbbbb",
            idSKU:4

        }
      
    );
    // });

async function testTestDescriptor(test1) {
    test("get td", async () => {
        let res = await TDC.getTestDescriptionById("97");
        console.log(res);
        expect(test1).toEqual({
            
            Name : res[0].Name,
            proceduredescription: res[0].proceduredescription,
            idSKU : res[0].idSKU,
            
    });
    });
}

testsetTD(
    "aaaaa","bbbbb",4
);

async function testsetTD(name,procedureDescription,idSKU) {
    test('set Item', async () => {
        let res = await TDC.newTestDescriptor(name,procedureDescription,idSKU);
        expect(res).toEqual({"id":119});
    });
}

testnewDC(
    "aaaaa","bbbbb",4
);


async function testnewDC(name,procedureDescription,idSKU) {
    test('NewDC', async () => {
        let res = await TDC.newTestDescriptor(name,procedureDescription,idSKU);
        expect(res).toEqual({"message": "Created"});
    });
}


testEtditbyId(
    {
        newName:"test descriptor 1",
        newProcedureDescription:"This test is described by...",
        newIdSKU :920
    }
,98
    
);


async function testEtditbyId(Body,Id) {
    test('update Item by id', async () => {
        let res = await TDC.editTDbyid(Body,Id);
        expect(res).toEqual({"message": "Success"});
    });
}

});

// describe("TestDescription", () => {
//     beforeEach(async () => {
//      //await TDC.deleteAll();
   

//     await TDC.newTestDescriptor(

//         "cvbc",
//         "bvnvn",
//         4
//   );
// });
// afterEach(async () => {
//     //await TDC.deleteAll();
//     //   await uc_user.deleteAll();
//     //   await uc_sku.deleteAll();
// });
//     TestDescriptorbyID(
//         {
            
//           Id:33,
//           Name: "cvbc",
//           proceduredescription: "bvnvn",
//           idSKU: 4

//         },
      
//     );
//     // });

// async function TestDescriptorbyID(test1) {
//     test("getbyID", async () => {
//         let res = await TDC.getTestDescriptionById(33);
//         console.log(res);
//         expect(test1).toEqual({
//             Id:res[0].Id,
//             Name : res[0].Name,
//             proceduredescription: res[0].proceduredescription,
//             idSKU : res[0].idSKU,
            
//     });
//     });
// } 
// });
