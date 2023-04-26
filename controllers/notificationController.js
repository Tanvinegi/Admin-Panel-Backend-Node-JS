const _ = require("underscore");
const Service = require("../services");
const message = require("../config/messages.js");
let response = require("../config/response");
const Joi = require("joi");
let commonHelper = require("../Helper/common");
const path = require("path");
const notificationProjection = ["id","message","image","title"];



module.exports = {
  register: async (payloadData,path) => {
    console.log("$$$$$$$$$$$$$$",payloadData)
    const schema = Joi.object().keys({
      title: Joi.string().required(),
      message: Joi.string().required(),
    });
     console.log("######",path)
     let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
     console.log("######",payload)
    if (!payload) throw response.error_msg.fieldsRequired;
   
    let objToSave = {};
		if (_.has(payload, "title") && payload.title != "") objToSave.title = payload.title;
		if (_.has(payload, "message") && payload.message != "") objToSave.message = payload.message;
   
    objToSave.image = path; 
    let findData = await Service.NotificationService.saveData(objToSave);
    if (findData) {
      return message.success.ADDED;
    } else {
      return response.error_msg.notAdded;
    }
  },

  deleteNotification: async(paramData) => {
		const schema = Joi.object().keys({
			id: Joi.string().guid({ version: "uuidv4" }).required()
		});
		let payload = await commonHelper.verifyJoiSchema(paramData, schema);
    console.log("$$$$$$$$$$$$$$",payload)
    console.log("$$$$$$$$$$$$$$",paramData)
		let criteria = {
			id: payload.id,

		};
   

		let dataTodelete = Service.NotificationService.delete(criteria, notificationProjection, true);
		if (dataTodelete) {
			return message.success.DELETED;
		} else {
			throw response.error_msg.recordNotFound;
		}
	},

  editNotification: async (payloadData,path) => {
		try {
			const schema = Joi.object().keys({
			title: Joi.string().required(),
      message: Joi.string().required(),
			isBlocked: Joi.number().valid(0, 1).optional(),
			isDeleted: Joi.number().valid(0, 1).optional(),
      id: Joi.string().guid({ version: "uuidv4" }).required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payloadData.id
			};
			let objToSave = {};
      if (_.has(payload, "title") && payload.title != "") objToSave.title = payload.title;
      if (_.has(payload, "message") && payload.message != "") objToSave.message = payload.message;
			if (_.has(payload, "isBlocked") && payload.isBlocked != "") objToSave.isBlocked = payload.isBlocked;
			if (_.has(payload, "isDeleted")) objToSave.isDeleted = payload.isDeleted;
	
		
      objToSave.image = path; 
			let isUpdated = await Service.NotificationService.updateData(criteria, objToSave);
			if (isUpdated) {
				let projection = [...notificationProjection]
        projection.push("isBlocked");
				let userData = await Service.NotificationService.getNotification(criteria, projection);
			
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
    let notification = await Service.NotificationService.getAllNotification(
      payload,
      notificationProjection,
      parseInt(payload.limit, 10) || 10,
      parseInt(payload.skip, 10) || 0
    );
    if (notification) {
      return notification;
    } else {
      return {
        rows: [],
        count: 0,
      };
    }
  },
  getNotifById: async(paramData) => {
		const schema = Joi.object().keys({
			id: Joi.string().guid({ version: "uuidv4" }).required()
		});
		let payload = await commonHelper.verifyJoiSchema(paramData, schema);
    console.log("$$$$$$$$$$$$$$",payload)
    console.log("$$$$$$$$$$$$$$",paramData)
		let criteria = {
			id: payload.id,
		};
		let notifDetail = Service.NotificationService.getNotification(criteria, notificationProjection, true);
		if (notifDetail) {
			return notifDetail;
		} else {
			throw response.error_msg.recordNotFound;
		}
	},
};