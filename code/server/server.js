"use strict";
const { Router } = require("express");
const express = require("express");
const userrouter = require("./modules/Routes/UserRoute");
const skuitemsrouter = require("./modules/Routes/SKUItemsRouter");
const restockorderrouter = require("./modules/Routes/RestockOrderRoute");
const internalorderrouter = require("./modules/Routes/InternalOrderRoute");
const returnorderrouter = require("./modules/Routes/ReturnOrderRoute");
const skurouter = require("./modules/Routes/SkuRouter");
const testdescriptorrouter = require("./modules/Routes/TDRouter");
const positionrouter = require("./modules/Routes/PositionRouter");
const TestResultRouter = require("./modules/Routes/TestResultRouter");
const ItemRouter = require("./modules/Routes/ItemRouter");


// init express
const app = new express();
const port = 3001;

app.use(express.json());
app.use("/api", positionrouter);
app.use("/api", TestResultRouter);
app.use("/api", ItemRouter);


app.use("/api", userrouter);
app.use("/api", skuitemsrouter);
app.use("/api", restockorderrouter);
app.use("/api", internalorderrouter);
app.use("/api", returnorderrouter);
app.use("/api", skurouter);
app.use("/api", testdescriptorrouter);

//GET /api/test
// app.get("/api/hello", (req, res) => {
//   let message = {
//     message: "Hello World!",
//   };
//   return res.status(200).json(message);
// });

// app.post("/api/testdb", async (req, res) => {
//   if (Object.keys(req.body).length === 0) {
//     return res.status(422).json({ error: `Empty body request` });
//   }
//   let user = req.body.user;
//   if (
//     user === undefined ||
//     user.name === undefined ||
//     user.surname === undefined ||
//     user.name == "" ||
//     user.surname == ""
//   ) {
//     return res.status(422).json({ error: `Invalid user data` });
//   }
//   await db.newTableName();
//   db.storeUser(user);
//   return res.status(201).end();
// });

// app.get("/api/testdb", async (req, res) => {
//   try {
//     const userlist = await db.getStoredUsers();
//     res.status(200).json(userlist);
//   } catch (err) {
//     res.status(404).end();
//   }
// });

// app.delete("/api/testdb", (req, res) => {
//   try {
//     db.dropTable();
//     res.status(204).end();
//   } catch (err) {
//     res.status(500).end();
//   }
// });

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;
