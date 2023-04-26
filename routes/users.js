
var express = require("express");
var router = express.Router();
const sendResponse = require("../Helper/sendResponse");
const userController = require("../controllers/userController");
const controllers = require("../controllers");
const authentication = require("../middleware/userAuthentication").verifyToken;


router.post("/",(req, res) => {
	return sendResponse.executeMethod(userController.registerUser, req.body, req, res);
});

router.put("/reset-password", (req, res) => {
	return sendResponse.executeMethod(userController.resetNewPassword, req.body, req, res);
});

router.post("/login", (req, res) => {
	return sendResponse.executeMethod(userController.login, req.body, req, res);
});

router.put("/logout",authentication,(req, res) => {

	let token = req.credentials;
	return sendResponse.executeMethod(userController.logout, token, req, res);
});


router.get("/", async (req, res) => {
	return sendResponse.executeMethod(controllers.userController.getUserDetail, req.credentials, req, res);
});


router.put("/profile/change-password", authentication, async (req, res) => {

	let tokenData = req.credentials;
	let payload = req.body;
	payload.id = tokenData.id;
	return sendResponse.executeMethod(userController.resetPassword, payload, req, res);
});

router.put("/update",authentication,async (req, res) => {
	let payload = req.body || {};
	payload.id = req.credentials.id;
	return sendResponse.executeMethod(userController.updateUser, payload, req, res);
});

router.put("/block", authentication, (req, res) => {
	
	return sendResponse.executeMethod(userController.updateUser, req.body, req, res);
});

router.delete("/delete/:id",(req, res) => {
	return sendResponse.executeMethod(adminController.deleteAdmin,req.params,req, res);
  });


module.exports = router;
