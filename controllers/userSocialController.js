const _ = require("underscore");
const Joi = require("joi");
let commonHelper = require("../Helper/common");
let message = require("../config/messages");
let response = require("../config/response");
let Services = require("../services");
let config = require("../config/env")();
const env = require("../config/env")();




module.exports = {
	addAccount: async (payloadData) => {
		try{
			const schema = Joi.object().keys({
				userId: Joi.string().guid({ version: "uuidv4" }).optional(),
				social_id: Joi.string().optional().allow(""),
				loginType: Joi.number().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {id:payload.userId};	
			let	userWithIdExist = await Services.userService.getUsers(criteria)	
			if (!userWithIdExist) throw response.error_msg.notFound; 
			if (userWithIdExist){
		    if (userWithIdExist.isBlocked === 1) throw response.error_msg.blockUser;
		
				let addSocialData = {};
				addSocialData.userId = userWithIdExist.id
	    if (_.has(payload, "social_id") && payload.social_id != "")addSocialData.social_id = payload.social_id;
	    if (_.has(payload, "loginType")) addSocialData.loginType = payload.loginType;
		 let saveSocialData	=	 await Services.userSocialService.saveData(addSocialData);
		  
		 return message.success.ADDED
			}
			else {
				throw response.error_msg.implementationError
			}

		}
		catch (err) {
			console.log("err", err);
			throw err;
		}	
		
				
	
	
	
	


	
}


}