const _ = require("underscore");
const Joi = require("joi");
const appConstants = require("./../config/appConstants");
const Response = require("../config/response");
let commonHelper = require("../Helper/common");
let config = require("../config/env")();
let message = require("../config/messages");
let Services = require("../services");



module.exports = {
	getUserStatus: async(payloadData) => {
        let criteria1 ={
            isBlocked: 0,
        }
		let active_user = await Services.userService.getAllUser(criteria1);
		let user_active =active_user.count    
        console.log("active",active_user.count)
        let criteria2 ={
            isBlocked: 1,
        }
        let blocked_user = await Services.userService.getAllUser(criteria2);
        let user_blocked =blocked_user.count
        console.log("blocked",blocked_user.count)
    
 

          // 1 => EMAIL_OR_PHONE,  2 => FACEBOOK, 3 => GMAIL, 4 => APPLE, 5 => MICROSOFT
        let criteria4 ={
            loginType: 1,
        }
      
        let userSocialEmailorPhone= await Services.userSocialService.getAllSocial(criteria4);
        let criteria5 ={
            loginType: 2,
        }
      
        let userSocialFacebook= await Services.userSocialService.getAllSocial(criteria5);
        let criteria6 ={
            loginType: 3,
        }
      
        let userSocialGMAIL= await Services.userSocialService.getAllSocial(criteria6);
        let criteria7 ={
            loginType: 4,
        }
      
        let userSocialAPPLE= await Services.userSocialService.getAllSocial(criteria7);
        let criteria8 ={
            loginType: 5,
        }
      
        let userSocialMICROSOFT= await Services.userSocialService.getAllSocial(criteria8);
       
       
        let criteria15={
         platform:"IOS"
        }
        
      
        let IOSdata= await Services.VersionService.getAppDetails(criteria15);

        let criteria16={
            platform:"Android"
           }
           
         
           let Androiddata= await Services.VersionService.getAppDetails(criteria16);


      
    let criteria12 ={Status:"pending"}
    let reportBugpending= await Services.reportBugService.getAllReportBug(criteria12);

    let criteria13 ={Status:"approved"}
    let reportBugapproved= await Services.reportBugService.getAllReportBug(criteria13);

    let criteria14 ={Status:"declined"}
    let reportBugdeclined= await Services.reportBugService.getAllReportBug(criteria14);
   

   
    if ( IOSdata && Androiddata &&  reportBugapproved && reportBugpending && reportBugdeclined &&  userSocialEmailorPhone && userSocialFacebook && userSocialGMAIL && userSocialMICROSOFT && userSocialAPPLE && active_user && active_user.count!==0 ) {
        return { "reportBugpending":reportBugpending.count,
        "reportBugapproved": reportBugapproved.count,
        "reportBugdeclined":reportBugdeclined.count,
        "BUGS_REPORTED":reportBugapproved.count
         +reportBugdeclined.count+reportBugpending.count,
    "EmailorPhone":userSocialEmailorPhone.count,
        "FACEBOOK": userSocialFacebook.count,
        "GMAIL":userSocialGMAIL.count,
        "APPLE":userSocialAPPLE.count,
        "MICROSOFT":userSocialMICROSOFT.count,
        "TOTAL_USER":userSocialEmailorPhone.count+
         +userSocialFacebook.count
       +userSocialGMAIL.count
        +userSocialAPPLE.count
       +userSocialMICROSOFT.count,"active":user_active, "blocked":user_blocked ,"total": user_active+user_blocked,
       "IOS":IOSdata.count,"Android":Androiddata.count,"TOTAL_Platform":IOSdata.count+Androiddata.count }
    } else {
          throw	Response.error_msg.notFound;
    }


},

};

  