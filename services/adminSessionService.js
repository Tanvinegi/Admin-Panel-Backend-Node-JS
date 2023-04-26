"use strict";
const Sequelize = require("sequelize");
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");

/**
 * ######### @function getDetail ########
 * ######### @params => criteria, projection  ########
 * ######### @logic => Used to retrieve users ########
 */
exports.getSessionDetail =async (criteria, projection) => {
	return await baseService.getSingleRecord(Models.AdminSessions, criteria, projection);
};
/**
 * ######### @function getSessionList                ########
 * ######### @params => criteria, projection         ########
 * ######### @logic => Used to retrieve session list ########
 */
exports.getSessionList = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let order = "";
		order = [
			[Sequelize.literal("id Desc")]
		];
		Models.AdminSessions.findAll({
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
/**
 * ######### @function saveData ########
 * ######### @params => criteria, user data ########
 * ######### @logic => Used to create users ########
 */
exports.saveSessionData = async(objToSave) => {
	return await baseService.saveData(Models.AdminSessions, objToSave);	
};
/**
 * ######### @function updateData ########
 * ######### @params => criteria, objToSave ########
 * ######### @logic => Used to update users ########
 */
exports.updateSessionData =async (criteria, objToSave) => {
	return await baseService.updateData(Models.AdminSessions, criteria, objToSave);	
};
/**
 * #########    @function deleteSessions         ########
 * #########    @params => criteria           ########
 * #########    @logic => Used to delete sessions #######
 */
exports.deleteSessions = async(criteria) => {
	return await baseService.delete(Models.AdminSessions, criteria);
};