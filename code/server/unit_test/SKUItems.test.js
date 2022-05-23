const SKUIC = require("../modules/Controller/SKUItemsController");
const DAO = require("../modules/DB/DAO");
const dao = new DAO();
const skuitem = new SKUIC(dao);
