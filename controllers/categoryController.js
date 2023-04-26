const _ = require("underscore");
const Service = require("../services");
const Joi = require("joi");
const commonHelper = require("../Helper/common");
let response = require("../config/response");
const message = require("../config/messages.js");
const path = require("path");

let categoryProjection = ["id", "name", "image",  "createdAt","updatedAt"];



module.exports = {
  register: async (payloadData,path) => {
    console.log("$$$$$$$$$$$$$$",payloadData)
    const schema = Joi.object().keys({
      name: Joi.string().required(),
     
    });
     console.log("######",path)
     let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
     console.log("######",payload)
    if (!payload) throw response.error_msg.fieldsRequired;
   
    let objToSave = {};
		if (_.has(payload, "name") && payload.name != "") objToSave.name = payload.name;
	 
    objToSave.image = path; 
    
    let findData = await Service.CategoryService.saveData(objToSave);
    if (findData) {
      return message.success.ADDED;
    } else {
      return response.error_msg.notAdded;
    }
  },

  deleteCategory: async(paramData) => {
		const schema = Joi.object().keys({
			id: Joi.string().guid({ version: "uuidv4" }).required()
		});
		let payload = await commonHelper.verifyJoiSchema(paramData, schema);
    console.log("$$$$$$$$$$$$$$",payload)
    console.log("$$$$$$$$$$$$$$",paramData)
		let criteria = {
			id: payload.id,

		};
   

		let dataTodelete = Service.CategoryService.delete(criteria,categoryProjection, true);
		if (dataTodelete) {
			return message.success.DELETED;
		} else {
			throw response.error_msg.recordNotFound;
		}
	},

  editCategory: async (payloadData,path) => {
		try {
			const schema = Joi.object().keys({
      name: Joi.string().optional(),
			isBlocked: Joi.number().valid(0, 1).optional(),
			isDeleted: Joi.number().valid(0, 1).optional(),
      id: Joi.string().guid({ version: "uuidv4" }).required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payloadData.id
			};
			let objToSave = {};
      if (_.has(payload, "name") && payload.name != "") objToSave.name = payload.name;
			if (_.has(payload, "isBlocked") && payload.isBlocked != "") objToSave.isBlocked = payload.isBlocked;
			if (_.has(payload, "isDeleted")) objToSave.isDeleted = payload.isDeleted;
	
		objToSave.image = path; 

			let isUpdated = await Service.CategoryService.updateData(criteria, objToSave);
			if (isUpdated) {
				let projection = [...notificationProjection]
        projection.push("isBlocked");
				let userData = await Service.CategoryService.getCategory(criteria, projection);
				return userData;
			} else {
				throw response.error_msg.implementationError;
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	},

  getFilter: async (payloadData) => {
    const schema = Joi.object().keys({
      limit: Joi.number().optional(),
      skip: Joi.number().optional(),
      sortBy: Joi.string().optional(),
      orderBy: Joi.string().optional(),
      search: Joi.string().optional().allow(""),
      userType: Joi.string().optional(),
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    let categoryDetail = await Service.CategoryService.getAllCategories(
      payload,
      categoryProjection,
      parseInt(payload.limit, 10) || 10,
      parseInt(payload.skip, 10) || 0
    );
    if (categoryDetail) {
      return categoryDetail;
    } else {
      return {
        rows: [],
        count: 0,
      };
    }
  },
  getCategoryById: async(paramData) => {
		const schema = Joi.object().keys({
			id: Joi.string().guid({ version: "uuidv4" }).required()
		});
		let payload = await commonHelper.verifyJoiSchema(paramData, schema);
    console.log("$$$$$$$$$$$$$$",payload)
    console.log("$$$$$$$$$$$$$$",paramData)
		let criteria = {
			id: payload.id,
		};
		let categoryDetail = Service.CategoryService.getCategory(criteria,categoryProjection, true);
		if (categoryDetail) {
			return categoryDetail;
		} else {
			throw response.error_msg.recordNotFound;
		}
	},
};