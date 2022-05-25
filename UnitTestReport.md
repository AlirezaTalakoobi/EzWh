# Unit Testing Report

Date: 25-05-22

Version: 1.0

# Contents

- [Black Box Unit Tests](#black-box-unit-tests)

- [White Box Unit Tests](#white-box-unit-tests)

# Black Box Unit Tests

    <Define here criteria, predicates and the combination of predicates for each function of each class.
    Define test cases to cover all equivalence classes and boundary conditions.
    In the table, report the description of the black box test case and (traceability) the correspondence with the Jest test case writing the
    class and method name that contains the test case>
    <Jest tests  must be in code/server/unit_test  >

# CLASS USERController

### Class USERController - method newUser(**name, surname, username, type, password**)

    In this method we insert a new user inside the database, if the user with that given email exists a message of "Conflict" is returned to API layer which means the user is already existing , and prints "Conflict" setting the status as 404, otherwise the new user is correctly inserted into the database

**Criteria for method newUser:**

- EMPTY DB
- USER ALREADY EXISTING

**Predicates for method newUser:**

| Criteria              | Predicate |
| --------------------- | --------- |
| EMPTY DB              | T/F       |
| USER ALREADY EXISTING | T/F       |
|                       |           |
|                       |           |

**Boundaries**:

| Criteria              | Boundary values |
| --------------------- | --------------- |
| EMPTY DB              | N/A             |
| USER ALREADY EXISTING | N/A             |
|                       |                 |

**Combination of predicates**:

| EMPTY DB | USER ALREADY EXISTING | Valid / Invalid | Description of the test case                                                                                   | Jest test case         |
| -------- | --------------------- | --------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------- |
| TRUE     |                       | VALID           | The database is empty then the user is inserted in the database and the data of the user inserted are returned | testInsertUser         |
| FALSE    | FALSE                 | VALID           | The user doesn't exist so it can be inserted into the database, and the info of the user are returned          | testInsertUser         |
| FALSE    | TRUE                  | INVALID         | The email provided is already registered so the operation fails and a "Conflict" message is returned           | testInsertUserExisting |

### Class USERController - method getStoredUsers()

A list of registered users is returned

**Criteria for method getStoredUsers:**

- Empty Database

**Predicates for method getStoredUsers:**

| Criteria           | Predicate |
| ------------------ | --------- |
| DATABASE NOT EMPTY | T         |

**Boundaries**:

| Criteria           | Boundary values                                              |
| ------------------ | ------------------------------------------------------------ |
| DATABASE NOT EMPTY | If the database is empty an empty array of users is returned |

**Combination of predicates**:

| DATABASE NOT EMPTY | Valid / Invalid | Description of the test case  | Jest test case |
| ------------------ | --------------- | ----------------------------- | -------------- |
| T                  | VALID           | An array of users is returned | testGetUsers   |

### Class USERController - method getUser(**username,password**)

    Gets users by username and password

**Criteria for method getUser:**
USER EXISTANCE

**Predicates for method getUser:**

| Criteria       | Predicate |
| -------------- | --------- |
| USER EXISTANCE | T/F       |
| WRONG FIELDS   | T/F       |

**Boundaries**:

| Criteria       | Boundary values |
| -------------- | --------------- |
| USER EXISTANCE | N/A             |
| WRONG FIELDS   | N/A             |

**Combination of predicates**:

| WRONG INPUTS | USER EXISTANCE | Valid / Invalid | Description of the test case          | Jest test case |
| ------------ | -------------- | --------------- | ------------------------------------- | -------------- |
| T            | T              | I               | An error is returned                  | testUserWrong  |
| F            | T              | V               | Informations of the user are returned | testUser       |

### Class USERController - method getSuppliers()

    Gets all suppliers if defined

**Criteria for method getSuppliers:**
EMPTY DATABASE
SUPPLIERS EXISTING

**Predicates for method getSuppliers:**

| Criteria           | Predicate |
| ------------------ | --------- |
| SUPPLIERS EXISTING | T/F       |
| EMPTY DATABASE     | T/F       |

**Boundaries**:

| Criteria           | Boundary values |
| ------------------ | --------------- |
| SUPPLIERS EXISTING | N/A             |
| EMPTY DATABASE     | N/A             |

**Combination of predicates**:

| EMPTY DATABASE | SUPPLIERS EXISTING | Valid / Invalid | Description of the test case                         | Jest test case     |
| -------------- | ------------------ | --------------- | ---------------------------------------------------- | ------------------ |
| T              |                    | I               | An error is shown after checking suppliers existance | testEmptySuppliers |
| F              | T                  | V               | Informations of the suppliers are returned           | testGetSuppliers   |
| F              | F                  | V               | An error is shown after checking suppliers existance | testEmptySuppliers |

### Class USERController - method editUser(**username, oldType, newType**)

    Edits an user inside the database

**Criteria for method editUser:**
EMPTY DATABASE
USER EXISTS
WRONG INPUTS

**Predicates for method editUser:**

| Criteria       | Predicate |
| -------------- | --------- |
| EMPTY DATABASE | T/F       |
| USER EXISTS    | T/F       |
| WRONG INPUTS   | T/F       |

**Boundaries**:

| Criteria       | Boundary values |
| -------------- | --------------- |
| EMPTY DATABASE | N/A             |
| USER EXISTS    | N/A             |
| WRONG INPUTS   | N/A             |

**Combination of predicates**:

| EMPTY DATABASE | USER EXISTS | WRONG INPUTS | Valid / Invalid | Description of the test case                                   | Jest test case         |
| -------------- | ----------- | ------------ | --------------- | -------------------------------------------------------------- | ---------------------- |
| T              |             |              | I               | An error is shown after checking user to be modified existance | testEditUserNotDefined |
| F              | T           | T            | I               | An error is shown after checking user to be modified existance | testEditUserNotDefined |
| F              | F           | F            | I               | An error is shown after checking user to be modified existance | testEditUserNotDefined |
| F              | T           | F            | V               | The user is modified                                           | testEditUser           |
| F              | F           | T            | I               | An error is shown after checking user to be modified existance | testEditUserNotDefined |

### Class USERController - method deleteUser(**username, type**)

    Deletes an user from the system

**Criteria for method deleteUser:**
EMPTY DATABASE
USER EXISTS
WRONG INPUTS

**Predicates for method deleteUser:**

| Criteria       | Predicate |
| -------------- | --------- |
| EMPTY DATABASE | T/F       |
| USER EXISTS    | T/F       |
| WRONG INPUTS   | T/F       |

**Boundaries**:

| Criteria       | Boundary values |
| -------------- | --------------- |
| EMPTY DATABASE | N/A             |
| USER EXISTS    | N/A             |
| WRONG INPUTS   | N/A             |

**Combination of predicates**:

| EMPTY DATABASE | USER EXISTS | WRONG INPUTS | Valid / Invalid | Description of the test case                                  | Jest test case            |
| -------------- | ----------- | ------------ | --------------- | ------------------------------------------------------------- | ------------------------- |
| T              |             |              | I               | An error is shown after checking user to be deleted existance | testDeleteUserNotExisting |
| F              | T           | T            | I               | An error is shown after checking user to be deleted existance | testDeleteUserNotExisting |
| F              | F           | F            | I               | An error is shown after checking user to be deleted existance | testDeleteUserNotExisting |
| F              | T           | F            | V               | The user is deleted                                           | testDeleteUser            |
| F              | F           | T            | I               | An error is shown after checking user to be deleted existance | testDeleteUserNotExisting |

# CLASS SKUItemsController

### Class SKUItemsController - method getSKUItems()

    Gets all the sku items with thier availability

**Criteria for method getSKUItems:**

- EMPTY DB

**Predicates for method getSKUItems:**

| Criteria | Predicate |
| -------- | --------- |
| EMPTY DB | T/F       |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
| EMPTY DB | N/A             |

**Combination of predicates**:

| EMPTY DB | Valid / Invalid | Description of the test case                       | Jest test case          |
| -------- | --------------- | -------------------------------------------------- | ----------------------- |
| T        | V               | returns a list of all the skuitems in the database | getSKUItems             |
| F        | V               | returns an empty list of skuitems                  | testgetSKUItemsNOTFOUND |

### Class SKUItemsController - method newSKUItem(**RFID, SKUId, DateOfStock**)

    In this method we insert a new skuitem inside the database, if the item with that given RFID exists a message of "Item with RFID already existing" is returned to API layer which means the item is already existing

**Criteria for method newSKUItem:**

- SKUID NOT EXISTING
- REGISTERED RFID

**Predicates for method newSKUItem:**

| Criteria           | Predicate |
| ------------------ | --------- |
| SKUID NOT EXISTING | T/F       |
| REGISTERED RFID    | T/F       |

**Boundaries**:

| Criteria           | Boundary values |
| ------------------ | --------------- |
| SKUID NOT EXISTING | N/A             |
| REGISTERED RFID    | N/A             |

**Combination of predicates**:

| SKUID NOT EXISTING | REGISTERED RFID | Valid / Invalid | Description of the test case                                                     | Jest test case                 |
| ------------------ | --------------- | --------------- | -------------------------------------------------------------------------------- | ------------------------------ |
| T                  | F               | I               | The item cannot be inserted and it's displayed "No SKU associated to SKUId"      | testInsertItemSKUIDNotexisting |
| F                  | T               | I               | The item cannot be inserted and it's displayed "Item with RFID already existing" | testInsertRFIDExisting         |
| F                  | F               | V               | The item is correctly inserted into the database and the new item is returned    | testInsertItem                 |

### Class SKUItemsController - method getSKUItemByID(id)

    Gets all the sku items with availability=1

**Criteria for method getSKUItemByID:**

- EMPTY DB
- AVAILABILITY GREATER THAN OR LOWER THAN 1
- WRONG SKU ID

**Predicates for method getSKUItemByID:**

| Criteria                                  | Predicate |
| ----------------------------------------- | --------- |
| EMPTY DB                                  | T/F       |
| AVAILABILITY GREATER THAN OR LOWER THAN 1 | T/F       |
| WRONG SKU ID                              | T/F       |

**Boundaries**:

| Criteria                                  | Boundary values |
| ----------------------------------------- | --------------- |
| EMPTY DB                                  | N/A             |
| AVAILABILITY GREATER THAN OR LOWER THAN 1 | N/A             |
| WRONG SKU ID                              | N/A             |

**Combination of predicates**:

| EMPTY DB | AVAILABILITY GREATER OR LOWER THAN 1 | WRONG SKU ID | Valid / Invalid | Description of the test case                                    | Jest test case                    |
| -------- | ------------------------------------ | ------------ | --------------- | --------------------------------------------------------------- | --------------------------------- |
| T        |                                      |              | I               | No items returned and it's displayed "no item associated to id" | testGetSKUItemBYIDNotExisting     |
| F        | T                                    | F            | I               | No items returned and it's displayed "no item associated to id" | testGetSKUItemBYIDGreaterQuantity |
| F        | T                                    | T            | I               | No items returned and it's displayed "no item associated to id" | testGetSKUItemBYIDNotExisting     |
| F        | F                                    | T            | I               | No items returned and it's displayed "no item associated to id" | testGetSKUItemBYIDNotExisting     |
| F        | F                                    | F            | V               | Items with available quantity=1 and skuid=id are returned       | testGetSKUItemBYID                |

### Class SKUItemsController - method getSKUItemsByRFID(RFID)

    Gets informations of item with given RFID

**Criteria for method getSKUItemsByRFID:**

- EMPTY DB
- WRONG RFID
- ITEM EXISTS

**Predicates for method getSKUItemsByRFID:**

| Criteria   | Predicate |
| ---------- | --------- |
| EMPTY DB   | T/F       |
| WRONG RFID | T/F       |

**Boundaries**:

| Criteria   | Boundary values |
| ---------- | --------------- |
| EMPTY DB   | N/A             |
| WRONG RFID | N/A             |

**Combination of predicates**:

| EMPTY DB | WRONG RFID | ITEM EXISTS | Valid / Invalid | Description of the test case                                     | Jest test case               |
| -------- | ---------- | ----------- | --------------- | ---------------------------------------------------------------- | ---------------------------- |
| T        |            |             | I               | no items are found and "no SKU found with this rfid" is returned | testgetItemByRFIDNotExisting |
| F        | T          | T           | I               | no items are found and "no SKU found with this rfid" is returned | testgetItemByRFIDNotExisting |
| F        | T          | F           | I               | no items are found and "no SKU found with this rfid" is returned | testgetItemByRFIDNotExisting |
| F        | F          | T           | V               | Item informations are returned                                   | testgetItemByRFID            |
| F        | F          | F           | I               | no items are found and "no SKU found with this rfid" is returned | testgetItemByRFIDNotExisting |

### Class SKUItemsController - method updateSKUItems( **rfid, newRFID,newAvailable,newDateOfStock**)

    update informations of item with given RFID

**Criteria for method updateSKUItems:**

- EMPTY DB
- WRONG RFID
- newRFIDExisting
- ITEM EXISTS

**Predicates for method updateSKUItems:**

| Criteria        | Predicate |
| --------------- | --------- |
| EMPTY DB        | T/F       |
| WRONG RFID      | T/F       |
| ITEM EXISTS     | T/F       |
| newRFIDExisting | T/F       |

**Boundaries**:

| Criteria        | Boundary values |
| --------------- | --------------- |
| EMPTY DB        | N/A             |
| WRONG RFID      | N/A             |
| ITEM EXISTS     | N/A             |
| newRFIDExisting | N/A             |

**Combination of predicates**:

| EMPTY DB | WRONG RFID | ITEM EXISTS | newRFIDExisting | Valid / Invalid | Description of the test case                                         | Jest test case                |
| -------- | ---------- | ----------- | --------------- | --------------- | -------------------------------------------------------------------- | ----------------------------- |
| T        |            |             |                 | I               | no item is found and "Item not found" is displayed                   | testUpdateItemNotFound        |
| F        | F          | T           | F               | V               | the item is modified and it's sent as response                       | testUpdateItem                |
| F        | T          | F           |                 | I               | no item is found and "Item not found" is displayed                   | testUpdateItemNotFound        |
| F        | F          | T           | T               | I               | The item is not update since there is another one with the same rfid | testUpdateRFIDAlreadyExisting |

### Class SKUItemsController - method deleteItem( **rfid**)

    delete item with given RFID

**Criteria for method updateSKUItems:**

- EMPTY DB
- WRONG RFID
- ITEM EXISTS

**Predicates for method updateSKUItems:**

| Criteria    | Predicate |
| ----------- | --------- |
| EMPTY DB    | T/F       |
| WRONG RFID  | T/F       |
| ITEM EXISTS | T/F       |

**Boundaries**:

| Criteria    | Boundary values |
| ----------- | --------------- |
| EMPTY DB    | N/A             |
| WRONG RFID  | N/A             |
| ITEM EXISTS | N/A             |

**Combination of predicates**:

| EMPTY DB | WRONG RFID | ITEM EXISTS | Valid / Invalid | Description of the test case                                                                                                          | Jest test case         |
| -------- | ---------- | ----------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| T        |            |             | I               | the item is not found and a message of error is displayed                                                                             | testDeleteItemNotFound |
| F        | F          | T           | V               | after deletion of the item, the test tries to get the item with rfid without finding it and it displays "no SKU found with this rfid" | testDeleteItem         |
| F        | T          | F           | I               | the item is not found and a message of error is displayed                                                                             | testDeleteItemNotFound |
| F        | F          | T           | I               | the item is not found and a message of error is displayed                                                                             | testDeleteItemNotFound |

# White Box Unit Tests

### Test cases Users

| Unit name  | Jest test case            |
| ---------- | ------------------------- |
| Users test | testUser                  |
| Users test | testUserWrong             |
| Users test | testGetUsers              |
| Users test | testInsertUser            |
| Users test | testInsertUserExisting    |
| Users test | testGetSuppliers          |
| Users test | testEmptySuppliers        |
| Users test | testEditUser              |
| Users test | testEditUserNotDefined    |
| Users test | testDeleteUser            |
| Users test | testDeleteUserNotExisting |

### Test cases SKUItems

| Unit name     | Jest test case                    |
| ------------- | --------------------------------- |
| SKUItems test | testgetSKUItems                   |
| SKUItems test | testgetSKUItemsNOTFOUND           |
| SKUItems test | testGetSKUItemBYID                |
| SKUItems test | testGetSKUItemBYIDGreaterQuantity |
| SKUItems test | testGetSKUItemBYIDNotExisting     |
| SKUItems test | testgetItemByRFID                 |
| SKUItems test | testgetItemByRFIDNotExisting      |
| SKUItems test | testInsertItem                    |
| SKUItems test | testInsertItemSKUIDNotexisting    |
| SKUItems test | testInsertRFIDExisting            |
| SKUItems test | testUpdateItem                    |
| SKUItems test | testUpdateItemNotFound            |
| SKUItems test | testUpdateRFIDAlreadyExisting     |
| SKUItems test | testDeleteItem                    |
| SKUItems test | testDeleteItemNotFound            |

### Test cases Item

| Unit name      | Jest test case  |
|----------------|-----------------|
| Item test      | testGetItems    |
| Item test      | testGetItemByID |
| Item test      | testCreateItem  |
| Item test      | testModifyItem  |
| Item test      | testDeleteItem  |


### Test cases Position

| Unit name          | Jest test case       |
|--------------------|----------------------|
| Position test      | testGetPosition      |
| Position test      | testCreatePosition   |
| Position test      | testModifyPosition   |
| Position test      | testChangePositionID |
| Position test      | testDeletePosition   |


### Test cases TestResult

| Unit name          | Jest test case       |
|--------------------|----------------------|
| TestResult test      | testGetTestResultsByRFID      |
| TestResult test      | testGetTestResultsForRFIDByID   |
| TestResult test      | testModifyTestResult   |
| TestResult test      | testChangePositionID |
| TestResult test      | testDeleteTestResult   |

### Code coverage report

####Users Coverage
![image](/Unit%20Tests%20Coverage/Schermata%202022-05-25%20alle%2016.06.22.png)
####SKUItems Coverage (**SKU is checked in another test coverage**)
![image](/Unit%20Tests%20Coverage/Schermata%202022-05-25%20alle%2016.06.41.png)
####Item Coverage
![image](/Unit%20Tests%20Coverage/Schermata%202022-05-25%20alle%2023.33.55.png)
####Item Coverage
![image](/Unit%20Tests%20Coverage/Schermata%202022-05-25%20alle%2023.42.37.png)
####Restock Orders Coverage
![image](/Unit%20Tests%20Coverage/Schermata%202022-05-25%20alle%2023.44.40.png)
####Internal Orders Coverage
![image](/Unit%20Tests%20Coverage/Schermata%202022-05-25%20alle%2023.47.09.png)
####Return Orders Coverage
![image](/Unit%20Tests%20Coverage/Schermata%202022-05-25%20alle%2023.48.32.png)
####SKU Coverage
![image](/Unit%20Tests%20Coverage/Schermata%202022-05-25%20alle%2023.50.18.png)

#### Test Descriptor Coverage

![image](/Unit%20Tests%20Coverage/Schermata%202022-05-25%20alle%2023.51.29.png)

#### Test Result Coverage

![image](/Unit%20Tests%20Coverage/Schermata%202022-05-25%20alle%2023.52.17.png)

### Loop coverage analysis

    <Identify significant loops in the units and reports the test cases
    developed to cover zero, one or multiple iterations >

| Unit name | Loop rows | Number of iterations | Jest test case |
| --------- | --------- | -------------------- | -------------- | --- |
|           |           |                      |                |
|           |           |                      |                |
|           |           |                      |                |     |
