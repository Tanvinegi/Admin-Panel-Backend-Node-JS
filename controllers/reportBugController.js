const _ = require("underscore");
const Service = require("../services");
const message = require("../config/messages.js");
let response = require("../config/response");
const Joi = require("joi");
let commonHelper = require("../Helper/common");
const path = require("path");
const reportBugProjection = ["id","ReportedBy","ReportedItem","Status"];


module.exports = {
  register: async (payloadData) => {

      const schema = Joi.object().keys({
      ReportedBy: Joi.string().required(),
      ReportedItem: Joi.string().required(),
      Status: Joi.string().valid("pending","approved","declined")
    });

      let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
      console.log("@@@@@@",payload)
      if (!payload) throw response.error_msg.fieldsRequired;
   
      let objToSave = {};

      if (_.has(payload, "ReportedBy") && payload.ReportedBy != "") objToSave.ReportedBy = payload.ReportedBy;
      if (_.has(payload, "ReportedItem") && payload.ReportedItem != "") objToSave.ReportedItem = payload.ReportedItem;
      if (_.has(payload, "Status") && payload.Status != "") objToSave.Status = payload.Status;
          console.log("####",objToSave)
    let bugData = await Service.reportBugService.saveData(objToSave);
    console.log("####",bugData)
    if (bugData) {return message.success.ADDED;} else {return response.error_msg.notAdded;}
  },


  getAllReported: async (payloadData) => {
    const schema = Joi.object().keys({
      limit: Joi.number().optional(),
      skip: Joi.number().optional(),
      sortBy: Joi.string().optional(),
      orderBy: Joi.string().optional(),
      search: Joi.string().optional().allow(""),
      ReportedBy: Joi.string().optional(),
      ReportedItem: Joi.string().optional(),
      Status: Joi.string().optional()
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    let bugData= await Service.reportBugService.getAllReportBug(
      payload,
      reportBugProjection,
      parseInt(payload.limit, 10) || 10,
      parseInt(payload.skip, 10) || 0
    );
    if (bugData) {
      return bugData;
    } else {
      return {
        rows: [],
        count: 0,
      };
    }
  },

  editBug: async (payloadData) => {
		try {
      const schema = Joi.object().keys({
        ReportedBy: Joi.string().required(),
        ReportedItem: Joi.string().required(),
        Status: Joi.string().valid("pending","approved","declined"),
        id: Joi.string().guid({ version: "uuidv4" }).required()
      });
    
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payloadData.id
			};
			let objToUpdate = {};
      if (_.has(payload, " ReportedBy") && payload.ReportedBy != "")objToUpdate.ReportedBy = payload.ReportedBy;
      if (_.has(payload, " ReportedItem") && payload.ReportedItem != "")objToUpdate.ReportedItem = payload.ReportedItem;
      if (_.has(payload, " Status") && payload.Status != "")objToUpdate.Status = payload.Status;
	
		
			let isUpdated = await Service.reportBugService.updateData(criteria,objToUpdate);
			if (isUpdated) {
				let projection = [...reportBugProjection]
				let userData = await Service.reportBugService.getReportBug(criteria, projection);
				return userData;
			} else {
				throw response.error_msg.implementationError;
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
};