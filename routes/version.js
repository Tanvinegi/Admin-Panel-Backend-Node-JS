var express = require("express");
var router = express.Router();
const  versionController = require("../controllers/versionController");
const authentication = require("../middleware/userAuthentication").verifyToken;
const sendResponse = require("../Helper/sendResponse");

router.post("/add-app-detail", (req, res) => {
 	return sendResponse.executeMethod(versionController.addAppDetails, req.body, req, res);
});

router.get("/get-app-detail", (req, res) => {
	let payload = req.query;
  return sendResponse.executeMethod(versionController.getAppDetails, payload, req, res);
});


router.delete("/:id",authentication, (req, res) => {
	let payload = req.params;
	return sendResponse.executeMethod(versionController.deleteAppVersion, payload, req, res);
});


router.put("/edit", authentication,async (req, res) => {
  let payload = req.body;
	return sendResponse.executeMethod(versionController.editDetails, payload, req, res);
});



router.get("/getplatform-detail/:platform", (req, res) => {
	let payload = req.params;
  return sendResponse.executeMethod(versionController.getPlatform, payload, req, res);
});



router.get("/count/:appname/:platform", (req, res) => {
	let payload = req.params;
  return sendResponse.executeMethod(versionController.countAppVersion, payload, req, res);
});

router.get("/app-version-detail/:appname", (req, res) => {
	let payload = req.params;
  return sendResponse.executeMethod(versionController.appVersionDetails, payload, req, res);
});



module.exports = router;