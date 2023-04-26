var express = require("express");
var router = express.Router();
const sendResponse = require("../Helper/sendResponse");
const userSocialController = require("../controllers/userSocialController");






router.post("/add", (req, res) => {
    let payload = req.body;
  return sendResponse.executeMethod(userSocialController.addAccount,payload,req,res);
});


module.exports = router;