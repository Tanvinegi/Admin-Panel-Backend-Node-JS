"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const appConstants = require("./../config/appConstants");
const baseService = require("./base");

Models.Admin.hasMany(Models.AdminPermissions);
var AdminPermissions = {
	model: Models.AdminPermissions,
	attributes: [...appConstants.APP_CONSTANTS.ADMIN_MODULES, "id", "isBlocked"],
	required: true
};

/**
 * ######### @function getAdmin ########
 * ######### @params => criteria, projection  ########
 * ######### @logic => Used to retrieve specific admin ########
 */
exports.getAdmin = (criteria, projection, includePermissions) => {
	return new Promise((resolve, reject) => {
		Models.Admin
			.findOne({
				where: criteria,
				attributes: projection,
				// include: includePermissions ? [AdminPermissions] : [],
			})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("get err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};
/**
 * ######### @function updateAdmins ########
 * ######### @params => criteria, objToSave  ########
 * ######### @logic => Used to update admin ########
 */
exports.updateAdmins = async(criteria, objToSave) => {
	return await baseService.updateData(Models.Admin, criteria, objToSave);

};
/**
 * ######### @function addAdmin ########
 * ######### @params => criteria, objToSave  ########
 * ######### @logic => Used to add admin ########
 */
exports.addAdmin = async (objToSave) => {
	return await baseService.saveData(Models.Admin, objToSave);
	
	
};
/**
 * ######### @function getAllAdmins ########
 * ######### @params => criteria, projection,limit, offset     ########
 * ######### @logic => Used to retrieve all the matching admin users ########
 */
 exports.delete = async (criteria) => {
	return await baseService.delete(Models.Admin, criteria);
};
exports.getAllAdmins = (criteria, projection, limit, offset) => {
	let where = {};
	let order = [
		[
			criteria.sortBy ? criteria.sortBy : "createdAt",
			criteria.orderBy ? criteria.orderBy : "DESC"
		]
	];
	if (criteria && criteria.search) {
		where = {
			[Op.or]: {
				firstName: {
					[Op.like]: "%" + criteria.search + "%"
				},
				lastName: {
					[Op.like]: "%" + criteria.search + "%"
				},
				email: {
					[Op.like]: "%" + criteria.search + "%"
				},
			}
		};
	}
	if (criteria && criteria.adminType) {
		where.adminType = criteria.adminType;
	}
	where.isDeleted = 0;
	if (criteria["isBlocked"] === 1) where.isBlocked = 1;
	if (criteria["isActive"] === 1) where.isBlocked = 0;
	let adminPermissions = {...AdminPermissions };
	if (criteria.accessPermissions) {
		let whereCondition = {};
		let modules = criteria.accessPermissions.split(",");
		modules.forEach((module) => {
			whereCondition[module] = 1;
		});
		adminPermissions.where = whereCondition;
	}
	return new Promise((resolve, reject) => {
		Models.Admin
			.findAndCountAll({
				limit,
				offset,
				where: where,
				attributes: projection,
				include: [adminPermissions],
				order: order,
			})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("getAll err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};
/**
 * #########    @function countAdmins         ########
 * #########    @params => criteria          ########
 * #########    @logic => Used to count admin users #######
 */
exports.countAdmins = (criteria) => {
	let where = {};
	if (criteria && criteria.search) {
		where = {
			[Op.or]: {
				firstName: {
					[Op.like]: "%" + criteria.search + "%"
				},
				lastName: {
					[Op.like]: "%" + criteria.search + "%"
				},
				email: {
					[Op.like]: "%" + criteria.search + "%"
				},
			}
		};
	}
	if (criteria["isBlocked"] === 1) where.isBlocked = 1;
	if (criteria["isActive"] === 1) where.isBlocked = 0;
	where.isDeleted = 0;
	if (criteria.accessPermissions) {
		AdminPermissions.where = {};
		if (criteria.accessPermissions) {
			AdminPermissions.where = {};
			criteria.accessPermissions.hasOwnProperty.call(() => {
				AdminPermissions.where.dashboard = 1;
			}, "dashboard");
		}
	}
	where.isDeleted = 0;
	return new Promise((resolve, reject) => {
		Models.Admin.count({
			where: where,
			include: [AdminPermissions]
		})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("count err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};