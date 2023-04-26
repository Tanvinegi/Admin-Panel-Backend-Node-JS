"use strict ";
var Jwt = require("jsonwebtoken");
var Service = require("../services");
const Response = require("../config/response");
const messages = require("../config/messages");
var setTokenInDBAdmin = async (userId, userType, token) => {
	var dataToSave = {
		adminId: userId,
		userType: userType,
		accessToken: token,
	};
	let condition = {
		adminId: userId,
	};
	await Service.AdminSessionService.deleteSessions(condition);
	let createSession = await Service.AdminSessionService.saveSessionData(dataToSave);
	if (!createSession) throw Response.error_msg.implementationError;
};
var expireTokenInDBAdmin = async (userId) => {
	let condition = {
		adminId: userId,
	};
	return await Service.AdminSessionService.deleteSessions(condition);
};
var setTokenAdmin = (tokenData, PRIVATE_KEY, callback) => {
	if (!tokenData.id || !tokenData.type) {
		callback(Response.error_msg.implementationError);
	} else {
		var tokenToSend = Jwt.sign(tokenData, PRIVATE_KEY);
		setTokenInDBAdmin(tokenData.id, tokenData.type, tokenToSend);
		callback(null, { accessToken: tokenToSend });
	}
};
var expireTokenAdmin = (token, callback) => {
	expireTokenInDBAdmin(token.id);
	callback(null, messages.success.LOGOUT);
};
module.exports = {
	expireToken: expireTokenAdmin,
	setToken: setTokenAdmin,
};