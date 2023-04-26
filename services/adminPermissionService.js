
"use strict";
const Models = require("../models");
const baseService = require("./base");

/**
 * ######### @function createAdminPermission ########
 * ######### @params => objToSave     ########
 * ######### @logic => Add permission to admin users ########
 */
exports.createAdminPermission = async (objToSave) => {
	return await baseService.saveData(Models.AdminPermissions, objToSave);
	
};
/**
 * ######### @function updateAdminPermissions ########
 * ######### @params => criteria, objToSave ########
 * ######### @logic => Used to update users ########
 */
exports.updateAdminPermissions = async (criteria, objToSave) => {
	return await baseService.updateData(Models.AdminPermissions, criteria, objToSave);


};
/**
 * #########    @function deleteAdminPermissions            ########
 * #########    @params => criteria                         ########
 * #########    @logic => Delete permission of admin user   #######
 */
exports.deleteAdminPermissions = async (criteria) => {
	return await baseService.delete(Models.AdminPermissions, criteria);

};