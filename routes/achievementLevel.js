var express = require("express");
var router = express.Router();
const sendResponse = require("../Helper/sendResponse");
const achievementLevelController = require("../controllers/achievementLevelController");
const authentication =require("../middleware/adminAuthentication").verifyToken;

router.post("/register", (req, res) => {
 let payload=req.body;
  return sendResponse.executeMethod(achievementLevelController.register, payload, req, res);
});

router.put("/edit",authentication,(req, res) => {
    return sendResponse.executeMethod(achievementLevelController.editAchievementLevel, req.body, req, res);
  });

router.delete("/delete/:id" ,authentication,(req, res) => {
    return sendResponse.executeMethod(achievementLevelController.deleteAchievementLevel,req.params,req,res);
});

router.get("/list", (req, res) => {
    let payload = req.query;
  //   if (payload.skip && payload.limit && payload.skip > 0) {
  //   payload.skip = (payload.skip - 1) * payload.limit;
  // }
  return sendResponse.executeMethod(achievementLevelController.getAllAchievementLevel,payload,req,res);
});

module.exports = router;