const express = require("express");
const router = express.Router();
const reportContentController = require("../controllers/reportContentController");
const authentication = require("../middleware/adminAuthentication").verifyToken;
const sendResponse = require("../Helper/sendResponse");


router.post("/register", (req, res) => {
    let payload =req.body;
  return sendResponse.executeMethod(reportContentController.register,payload,req,res);
});


router.put("/edit",authentication, (req, res) => {

    return sendResponse.executeMethod(reportContentController.editContent,req.body,req,res);
});


router.get("/list", (req, res) => {
    let payload = req.query;
    if (payload.skip && payload.limit && payload.skip > 0) {
      payload.skip = (payload.skip - 1) * payload.limit;
    }
    return sendResponse.executeMethod(reportContentController.getAllReported,payload,req,res);
  });

module.exports = router;