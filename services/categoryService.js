const _ = require("underscore");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");




exports.saveData = async (objToSave) => {
	return await baseService.saveData(Models.Category, objToSave);
};

exports.updateData = async (criteria, objToSave,) => {
	console.log("%%%%%%%%%",objToSave)
	return await baseService.updateData(Models.Category, criteria, objToSave);
};
exports.delete = async (criteria) => {
	return await baseService.delete(Models.Category, criteria);
};

exports.count = async (criteria) => {
	let where = {};
	
	if (criteria && (criteria.isBlocked !== undefined)) {
		where.isBlocked = criteria.isBlocked;
	}
	return await baseService.count(Models.Category, where);
};
exports.getCategory = async(criteria, projection) => {
	return await baseService.getSingleRecord(Models.Category, criteria, projection);

};

exports.getAllCategories = (criteria, projection, limit, offset) => {
  let where = {};
  let order = [
    [
      criteria.sortBy
        ? criteria.sortBy
        : "name" || "createdAt" || "image" || "cId",
      criteria.orderBy ? criteria.orderBy : "ASC" || "DESC",
    ],
  ];
  if (criteria && criteria.search) {
    where = {
      [Op.or]: {
        name: {
          [Op.like]: "%" + criteria.search + "%",
        },
      },
    };
  }
  where.deletedAt = null;
  return new Promise((resolve, reject) => {
    Models.Category
      .findAndCountAll({
        limit,
        offset,
        where: where,
        attributes: projection,
        order: order,
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.log("getAll err ==>>  ", err);
      });
  });
};