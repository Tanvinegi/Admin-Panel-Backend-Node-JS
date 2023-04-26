const Service = require("../services");
const Joi = require("joi");
const commonHelper = require("../Helper/common");
let response = require("../config/response");
const message = require("../config/messages");
const achievementLevelProjection = ["id","levelName","createdAt","deletedAt","achievementId"];

module.exports = {
  register: async (payloadData) => {
    const schema = Joi.object().keys({
         levelName: Joi.string().required(),
      });
      let payload = await commonHelper.verifyJoiSchema(payloadData,schema);
      let objToSave = {};
      if (_.has(payload, "levelName") && payload.levelName != "")objToSave.levelName = payload.levelName;
    
      let AchievementData = await Service.AchievementLevelService.saveData(objToSave);
      if (AchievementData) {
        return message.success.ADDED;
      } else {
        throw response.error_msg.notAdded;
      }
    },
 
  editAchievementLevel:  async (payloadData) => {
    console.log("@@@@@@@",payloadData);
    const schema = Joi.object().keys({
        levelName: Joi.string().optional(),
        id: Joi.string().guid({ version: "uuidv4" }).required(),
      
      });
      let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    
      let criteria = {
        id: payload.id
      };
      let objToSave = {};
      if (_.has(payload, "levelName") && payload.levelName != "")objToSave.levelName = payload.levelName;
   
  
    let user = await Service.AchievementLevelService.getAchievementLevel(criteria);
   
    let projection = [...achievementLevelProjection]; 
    if(user){
    let updateData = Service.AchievementLevelService.updateData(criteria,
      objToSave,projection);
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
  deleteAchievementLevel: async (paramData) => {
    const schema = Joi.object().keys({
      id: Joi.string().guid({ version: "uuidv4" }).required(),
    });
    let payload = await commonHelper.verifyJoiSchema(paramData, schema);

    let criteria = {
      id: payload.id,
    };
    let objToSave = { isDeleted: 1};
    let updateData = Service.AchievementLevelService.updateData(criteria,
      objToSave,projection);
    let deleteData = Service.AchievementLevelService.delete(criteria);
    if (deleteData) {
      return message.success.DELETED;
    } else {
      throw response.error_msg.implementationError;
    }
  },
  getAllAchievementLevel: async (payloadData) => {
    const schema = Joi.object().keys({
      // limit: Joi.number().required(),
      // skip: Joi.number().required(),
      sortBy: Joi.string().optional(),
      orderBy: Joi.string().optional(),
      search: Joi.string().optional().allow(""),
      levelName: Joi.string().optional(),
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    let get = await Service.AchievementLevelService.getAllAchievementLevel(
      payload,
      achievementLevelProjection,
      parseInt(payload.limit, 10) || 10,
      parseInt(payload.skip, 10) || 0
    );
    if (get) {
      return get;
    } else {
      return {
        rows: [],
        count: 0,
      };
    }
  },
};