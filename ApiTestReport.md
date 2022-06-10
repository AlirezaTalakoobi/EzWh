# Integration and API Test Report

Date: 25-05-22

Version: 1.0

# Contents

- [Integration and API Test Report](#integration-and-api-test-report)
- [Contents](#contents)
- [Dependency graph](#dependency-graph)
- [Integration approach](#integration-approach)
- [Integration Tests](#integration-tests)
  - [Step 1](#step-1)
- [API testing - Scenarios](#api-testing---scenarios)
- [Coverage of Scenarios and FR](#coverage-of-scenarios-and-fr)
- [Coverage of Non Functional Requirements](#coverage-of-non-functional-requirements)

  - [](#)

- [Tests](#tests)

- [Scenarios](#scenarios)

- [Coverage of scenarios and FR](#scenario-coverage)
- [Coverage of non-functional requirements](#nfr-coverage)

# Dependency graph

```plantuml
package "Routers"{
[user]
[sku]
[internalOrder]
[item]
[position]
[restockOrder]
[returnOrder]
[SkuItem]
[testDescriptor]
[testResult]
}

package "Controller classes"{
[userController]
[skuController]
[internalorderController]
[restockOrderController]
[positionController]
[returnOrderController]
[testresultController]
[SkuitemsController]
[itemController]
[testdescriptorController]


}

database "EzWh"{
[EzWh Database]
}

[skuController].down.[EzWh Database]
[userController].down.[EzWh Database]
[internalorderController].down.[EzWh Database]
[itemController].down.[EzWh Database]
[positionController].down.[EzWh Database]
[restockOrderController].down.[EzWh Database]
[returnOrderController].down.[EzWh Database]
[SkuitemsController].down.[EzWh Database]
[testdescriptorController].down.[EzWh Database]
[testresultController].down.[EzWh Database]

[userController].up.[user]
[skuController].up.[sku]
[testdescriptorController].up.[sku]
[position_service].up.[sku]
[internalorderController].up.[internalOrder]
[sku_service].up.[item]
[itemController].up.[item]
[positionController].up.[position]
[restockOrderController].up.[restockOrder]
[SkuitemsController].up.[restockOrder]
[returnOrderController].up.[returnOrder]
[SkuitemsController].up.[SkuItem]
[skuController].up.[SkuItem]
[testdescriptorController].up.[testDescriptor]
[skuController].up.[testDescriptor]
[testdescriptorController].up.[testResult]
[SkuitemsController].up.[testResult]
[testresultController].up.[testResult]

```

# Integration approach

We have used a bottom up starting by unit tests, of which there is one for each "Controller" class and then testing every API accessed by the Router Class in which every controller is connected.

# Integration Tests

## Step 1

| Classes                   | mock up used                                                                                               | Jest test cases                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| user Controller           | get user,get all users,get All Users,set users,get all suppliers,edituser,deleteuser                       | getUser,testUserWrong,testGetUsers,insertNewUser,testInsertUserExisting,getSuppliers,testEmptySuppliers,testEditUser,testEditUserNotDefined,testDeleteUser,testDeleteUserNotExisting                                                                                                                                                                                |
| sku Controller            |                                                                                                            | TestSKC, testgetSKU, testEtdit, testEtditposition,                                                                                                                                                                                                                                                                                                                  |
| internal order Controller |                                                                                                            | testGetInternalAllOrders, testGetInternalOrdersIssued, testGetInternalOrdersAccepted, testGetInternalOrder, testGetInternalOrderNotFound, testCreateInternalOrder, testCreateInternalOrderInvalidProducts ,testCreateInternalOrderInvalidCustomer ,testModifyStateOfInternalOrderNotCompleted ,testModifyStateOfInternalOrderCompleted                              |
| restock Order Controller  |                                                                                                            | deleteAllRestockOrders, testGetRestockAllOrders, testGetRestockOrdersIssued, testGetRestockOrder, testCreateRestockOrder, testCreateRestockOrderInvalidData, testModifyStateOfRestockOrder, testAddSkuItemsToRestockOrder, testAddSkuItemsToRestockOrderInvalidItems, testAddTransportNoteToRestockOrder ,testDeleteRestockOrder                                    |
| position Controller       | get Position, create Position ,modify Position ,change Position ID,delete Position                         | testGetPosition, testCreatePosition,testModifyPosition, testChangePositionID, testDeletePosition                                                                                                                                                                                                                                                                    |
| return Order Controller   |                                                                                                            | testGetReturnAllOrders, testGetReturnOrder, testCreateReturnOrder,testCreateReturnOrderRestockOrderNotFound, testCreateReturnOrderInvalidItemsWrongPrice, testCreateReturnOrderInvalidItemsWrongSKUIdForItem, testCreateReturnOrderInvalidItemsWrongDescription ,testDeleteReturnOrder                                                                              |
| test result Controller    | get Test Results By RFID,get Test Results For RFID By ID,create Test Result,modify Test Result,delete Test | testGetTestResultsByRFID ,testGetTestResultsForRFIDByID ,testCreateTestResult, testModifyTestResult ,testDeleteTestResult                                                                                                                                                                                                                                           |
| Sku Items Controller      | get skus,get skus by id,get skus by rfid,get items,set item,edit sku item,delete item                      | testgetSKUItems, testgetSKUItemsNOTFOUND, testGetSKUItemBYID, testGetSKUItemBYIDGreaterQuantity, testGetSKUItemBYIDNotExisting ,testgetItemByRFID, testgetItemByRFIDNotExisting ,testInsertItem ,testInsertItemSKUIDNotexisting ,testInsertRFIDExisting,testUpdateItem ,testUpdateItemNotFound,testUpdateRFIDAlreadyExisting, testDeleteItem,testDeleteItemNotFound |
| Item Controller           | get items,get Item By ID,get Item By ID,create Item,modify Item,delete item                                | testGetItems,testGetItemByID,testCreateItem,testModifyItem,testDeleteItem                                                                                                                                                                                                                                                                                           |

# API testing - Scenarios

# Coverage of Scenarios and FR

| Scenario ID | Functional Requirements covered        | Mocha Test(s)                                                   |
| ----------- | -------------------------------------- | --------------------------------------------------------------- |
| 1.1         | FR 2.1                                 | 'new sku'                                                       |
| 1.2         | FR 2.1                                 | 'UpdateTDPositionByID'                                          |
| 1.3         | FR 2.1                                 | 'UpdateTDByID'                                                  |
| 2.1         | FR 3.1.1                               | 'insert position'                                               |
| 2.2         | FR 3.1.1                               | 'update position byID '                                         |
| 2.3         | FR 3.1.1, FR 3.1.4                     | 'insert position'                                               |
| 2.4         | FR 3.1.1, FR 3.1.4                     | 'modify position'                                               |
| 2.5         | FR 3.1.2                               | 'Delete position '                                              |
| 3.1         | FR 5                                   | ' creating new order'                                           |
| 3.2         | FR 5                                   | ' creating new order                                            |
| 4.1         | FR 1.1                                 | 'test newuser'                                                  |
| 4.2         | FR 1.5                                 | 'test edit user'                                                |
| 4.2         | FR 1.2                                 | 'test delete user'                                              |
| 5.1.1       | FR 5.12                                | 'changing state of restock order'                               |
|             | FR 7                                   | 'create item'                                                   |
| 5.2         | FR 5.12                                | 'changing state of restock order                                |
| 5.3         | FR 3.1.4                               | 'put new position data to the database'                         |
|             | FR 5.12                                | 'changing state of restock order '                              |
| 6           | FR 5.9                                 | 'creating a new return order '                                  |
|             | FR 8.2                                 | 'modify a test result'                                          |
| 9.1         | FR 6.1, FR 6.2, FR 6.3, FR 6.4, FR 6.5 | 'creating a new internal order'                                 |
| 9.3         | FR 6.6                                 | 'delete internal order by ID'                                   |
| 10.1        | FR 6.7, FR 6.8                         | 'change state of internal order to completed and add sku items' |
| 11.1        | FR 7                                   | 'create item'                                                   |
| 11.2        | FR 7                                   | 'modify item by id '                                            |
| 12.1        | FR 3.2                                 | 'newTD'                                                         |
| 12.2        | FR 3.2.2                               | 'UpdateTDByID'                                                  |
| 12.3        | FR 3.2.3                               | 'delete TD'                                                     |

# Coverage of Non Functional Requirements

###

| Non Functional Requirement | Test name                                       |
| -------------------------- | ----------------------------------------------- |
| NFR6                       | newSKUItem,getSKUItemByRFID,editItem,deleteItem |
