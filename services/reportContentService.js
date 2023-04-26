const _ = require("underscore");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");



exports.saveData = async (objToSave) => {
	return await baseService.saveData(Models.ReportBug, objToSave);
};

exports.updateData = async (criteria, objToSave,) => {
	console.log("%%%%%%%%%",objToSave)
	return await baseService.updateData(Models.ReportBug, criteria, objToSave);
};
exports.delete = async (criteria) => {
	return await baseService.delete(Models.ReportBug, criteria);
};

exports.count = async (criteria) => {
	let where = {};
	
	if (criteria && (criteria.isBlocked !== undefined)) {
		where.isBlocked = criteria.isBlocked;
	}
	return await baseService.count(Models.ReportBug, where);
};
exports.getReporcontent = async(criteria, projection) => {
	return await baseService.getSingleRecord(Models.ReportBug, criteria, projection);

};

exports.getAllReportContent = (criteria, projection, limit, offset) => {
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
				title: {
					[Op.like]: "%" + criteria.search + "%"
				},
				message: {
					[Op.like]: "%" + criteria.search + "%"
				},
				image: {
					[Op.like]: "%" + criteria.search + "%"
				},
			}
		};
	}
	
	where.isDeleted = 0;
	if (criteria["isBlocked"] === 1) where.isBlocked = 1;
	if (criteria["isDeleted"] === 1) where.isBlocked = 0;
	
	
	return new Promise((resolve, reject) => {
		Models.ReportBug
			.findAndCountAll({
				limit,
				offset,
				where: where,
				attributes: projection,
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





