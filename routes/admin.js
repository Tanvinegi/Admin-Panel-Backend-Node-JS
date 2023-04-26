var express = require("express");
var router = express.Router();
const sendResponse = require("../Helper/sendResponse");
const adminController = require("../controllers/adminController");
const authentication = require("../middleware/adminAuthentication").verifyToken;


router.post("/",(req, res) => {
	return sendResponse.executeMethod(adminController.addAdmin, req.body, req, res);
});

router.put("/reset-password", (req, res) => {
	return sendResponse.executeMethod(adminController.resetNewPassword, req.body, req, res);
});

router.post("/login", (req, res) => {
	return sendResponse.executeMethod(adminController.login, req.body, req, res);
});

router.put("/logout", authentication,(req, res) => {

	let token = req.credentials;
	return sendResponse.executeMethod(adminController.logout, token, req, res);
});

router.get("/", (req, res) => {
	let payload = req.query;
	// if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
	// 	payload.skip = (payload.skip - 1) * payload.limit;
	// }
	return sendResponse.executeMethod(adminController.getAllAdmins, payload, req, res);
});

router.put("/change-password", authentication, async (req, res) => {

	let tokenData = req.credentials;
	let payload = req.body;
	payload.id = tokenData.id;
	return sendResponse.executeMethod(adminController.resetPassword, payload, req, res);
});

router.put("/block", authentication, async(req, res) => {
	let payload = req.body || {};
	payload.id = req.credentials.id;
	return sendResponse.executeMethod(adminController.updateAdmin,payload, req, res);
});


router.post("/forgot-password", (req, res) => {
	return sendResponse.executeMethod(adminController.forgotPassword, req.body, req, res);
});

router.delete("/delete/:id",(req, res) => {
	return sendResponse.executeMethod(adminController.deleteAdmin,req.params,req, res);
  });

  router.get("/profile", authentication, (req, res) => {
	let token = req.credentials;
	return sendResponse.executeMethod(adminController.getAdminProfile, token.id, req, res);
});
module.exports = router;
