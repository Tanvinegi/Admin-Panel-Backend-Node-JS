"use strict";
const Sequelize = require("sequelize");
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");


exports.getSessionDetail = (criteria, projection) => {
	if ("notInId" in criteria) {
		criteria.id != criteria.notInId;
		delete criteria.notInId;
	}
	return new Promise((resolve, reject) => {
		Models.Sessions.findOne({ where: criteria, attributes: projection })
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("err", err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.getSessionList = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let order = "";
		order = [[Sequelize.literal("id Desc")]];
		Models.Sessions.findAll({
			limit,
			offset,
			where: criteria,
			attributes: projection,
			order: order
		}).then(result => {
			resolve(result);
		}).catch(function (err) {
			console.log(err);
			reject(Response.error_msg.implementationError);
		});
	});
};
exports.getSessionDeviceToken = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let order = "";
		order = [[Sequelize.literal("id Desc")]];
		Models.Sessions.findAll({
			limit,
			offset,
			where: criteria,
			distinct:true,
			col:"deviceToken",
			attributes: projection,
			order: order
		}).then(result => {
			resolve(result);
		}).catch(function (err) {
			console.log(err);
			reject(Response.error_msg.implementationError);
		});
	});
};


exports.saveSessionData = async (objToSave) => {
	return await baseService.saveData(Models.Sessions, objToSave);
};

exports.updateSessionData =async (criteria, objToSave) => {
	return await baseService.updateData(Models.Sessions, criteria, objToSave);
};

exports.deleteSessions = async(criteria) => {
	return await baseService.delete(Models.Sessions, criteria);	
};
