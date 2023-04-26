var express = require("express");
var router = express.Router();
const env = require("./../config/env")();
/* GET home page. */
router.get("/", (req, res) => {
	res.render("index", { title: "Express" });
});
router.get("/documentation", (req, res) => {
	let jsonData = require("./../config/documentation/swagger.json");
	delete jsonData.host;
	jsonData.host = env.APP_URLS.DOMAIN;
	return res.status(200).send(jsonData);
});
router.get("/documentation-admin", (req, res) => {
	let jsonData = require("./../config/documentation/swagger-admin.json");
	delete jsonData.host;
	jsonData.host = env.APP_URLS.DOMAIN;
	return res.status(200).send(jsonData);
});
module.exports = router;
