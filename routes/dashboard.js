var express = require("express");
var router = express.Router();
const sendResponse = require("../Helper/sendResponse");
const dashboardController = require("../controllers/dashboardController");






router.get("/user-status", (req, res) => {
    let payload = req.query;
  return sendResponse.executeMethod(dashboardController.getUserStatus,payload,req,res);
});





module.exports = router;