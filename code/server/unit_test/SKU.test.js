const SKUController = require("../modules/Controller/SKUController");
const DAO = require("../modules/DB/DAO");
const dao = new DAO();
const SKC = new SKUController(dao);


