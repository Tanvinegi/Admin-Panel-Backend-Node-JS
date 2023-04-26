const _ = require("underscore");
const Joi = require("joi");
const response = require("../config/response");
let commonHelper = require("../Helper/common");
const moment = require("moment");
let config = require("../config/env")();
let message = require("../config/messages");
const Service = require("../services");
const adminAchievementProjection = ["id","name","Type","createdAt"]


module.exports = {
  register: async (payloadData) => {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      Type: Joi.string().required(),
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    let objToSave = {};
    if (_.has(payload, "name") && payload.name != "")objToSave.name = payload.name;
    if (_.has(payload, "Type") && payload.Type != "")objToSave.Type = payload.Type;
   
    let AchievementData = await Service.AdminAchievementService.saveData(
      objToSave,
      
    );
    if (AchievementData) {
      return message.success.ADDED;
    } else {
      throw response.error_msg.notAdded;
    }
  },
  
  editAchievement: async (payloadData) => {
    console.log("@@@@@@@",payloadData);
    const schema = Joi.object().keys({
        name: Joi.string().optional(),
        Type: Joi.string().optional(),
        id: Joi.string().guid({ version: "uuidv4" }).required(),
      
      });
      let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    
      let criteria = {
        id: payload.id,
      };
      let objToSave = {};
      if (_.has(payload, "name") && payload.name != "")objToSave.name = payload.name;
      if (_.has(payload, "Type") && payload.Type != "")objToSave.Type = payload.Type;
  
    let user = await Service.AdminAchievementService.getAdminAchievement(criteria);
   
    let projection = [...adminAchievementProjection]; 
    if(user){
    let updateData = Service.AdminAchievementService.updateData(criteria,
      objToSave,projection
    );
    if (updateData) {
      return message.success.UPDATED;
    } else {
      throw response.error_msg.implementationError;
    }
}
else {
    throw response.error_msg.implementationError;
  }
  },
  
  deleteAchievement: async (paramData) => {
    const schema = Joi.object().keys({
      id: Joi.string().guid({ version: "uuidv4" }).required(),
    });
    let payload = await commonHelper.verifyJoiSchema(paramData, schema);

    let criteria = {
      id: payload.id,
    };
    let deleteData = Service.AdminAchievementService.delete(
      criteria
    );
    if (deleteData) {
      return message.success.DELETED;
    } else {
      throw response.error_msg.implementationError;
    }
  },
  getAllAdminsAchievement: async (payloadData) => {
    const schema = Joi.object().keys({
      // limit: Joi.number().required(),
      // skip: Joi.number().required(),
      sortBy: Joi.string().optional(),
      orderBy: Joi.string().optional(),
      search: Joi.string().optional().allow(""),
      name: Joi.string().optional(),
      Type: Joi.string().optional(),
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    let adminData = await Service.AdminAchievementService.getAllAdminAchievement(
      payload,
      adminAchievementProjection,
      parseInt(payload.limit, 10) || 10,
      parseInt(payload.skip, 10) || 0
    );
    if (adminData) {
      return adminData;
    } else {
      return {
        rows: [],
        count: 0,
      };
    }
  },

};