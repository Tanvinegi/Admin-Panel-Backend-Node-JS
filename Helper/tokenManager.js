"use strict";
var Jwt = require("jsonwebtoken");
var Service = require("../services");
const Response = require("../config/response");
const messages = require("../config/messages");
var setTokenInDB = async (id, tokenData) => {
	var dataToSave = {
		userId: id,
        accessToken: tokenData
	};
	let condition = {
		userId: id};
	
	await Service.sessionService.deleteSessions(condition);
	let createSession = await Service.sessionService.saveSessionData(dataToSave);
    console.log('createsssss',createSession)
	if (!createSession) throw Response.error_msg.implementationError;
};
var expireTokenInDB = async (userId) => {
	let condition = {
		userId: userId	
	};
	let removeSession = await Service.sessionService.deleteSessions(condition);
	if (!removeSession) throw Response.error_msg.implementationError;
	else return removeSession;
};
// var setToken = (tokenData, callback) => {
// 	if (!tokenData.id) {
// 		callback(Response.error_msg.implementationError);
// 	} else {
// 		// var tokenToSend = Jwt.sign(tokenData, privateKey);
// 		setTokenInDB(tokenData.id, tokenData);
// 		callback(null, { accessToken: tokenData });
// 	}
// };
var setToken = (tokenData, PRIVATE_KEY, callback) => {

	if (!tokenData.id) {
		callback(Response.error_msg.implementationError);
	} else {
		var tokenToSend = Jwt.sign(tokenData, PRIVATE_KEY);
		setTokenInDB(tokenData.id, tokenToSend);
		callback(null, { accessToken: tokenToSend });
	}
};
var expireToken = (token,callback) => {
	expireTokenInDB(token.id);
	callback(null, messages.success.LOGOUT);
};
module.exports = {
	expireToken: expireToken,
	setToken: setToken,
};