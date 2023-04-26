const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const sendResponse = require("../Helper/sendResponse");
const MULTER = require("../Helper/upload");
const authentication = require("../middleware/adminAuthentication").verifyToken;


router.post("/register",MULTER.upload.single("image"),(req, res) => {
    let payload = req.body;
    var path =req.file.path;
  
    console.log("@@@@@@@@@@",path)
return sendResponse.executeMethod(notificationController.register,payload,path,res);}
);


router.get("/notifDetail/:id",  (req, res) => {
	return sendResponse.executeMethod(notificationController.getNotifById, req.params, req, res);
});





router.delete("/delete/:id",(req, res) => {
  return sendResponse.executeMethod(notificationController.deleteNotification,req.params,req, res);
});


router.put("/edit",authentication,MULTER.upload.single("image"),(req, res) => {
  let payload = req.body;
  var path =req.file.path;
return sendResponse.executeMethod(notificationController.editNotification,payload,path,res);
  }
);

router.get("/list", (req, res) => {
  let payload = req.query;
  // if (payload.skip && payload.limit && payload.skip > 0) {
  //   payload.skip = (payload.skip - 1) * payload.limit;
  // }
  return sendResponse.executeMethod(notificationController.getFilter,payload,req,res);
});

module.exports = router;