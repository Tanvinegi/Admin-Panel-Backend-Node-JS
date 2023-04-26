const Jwt = require("jsonwebtoken");
const Services = require("../services");
const env = require("../config/env")();
const response = require("../config/response");
const verifyToken = async(req, res, next) => {
	try {
		if (req.headers && req.headers.authorization) {
			var token = req.headers.authorization;
			console.log("ff",token)

			token = token.replace("Bearer ", "");
			let tokenData = await Jwt.verify(token, env.APP_URLS.PRIVATE_KEY);
			let userSession = await Services.sessionService.getSessionDetail({
				"userId": tokenData.id,
				"accessToken": token
			}, ["userId"]);
            console.log("-------------==============",userSession)
            
			if (!userSession) {
				return res.status(401).json({
					statusCode: 401,
					message: "The token is not valid or User not Found!",
				});
			} else {
				let criteria = {
					"id": tokenData.id,
					"isDeleted": "0",
				};
				let projection = ["id","isBlocked"];
				let user_Data = await Services.userService.getUsers(criteria, projection);
				if (user_Data) {
					if (user_Data && user_Data.isBlocked === 1) {
						return res.status(401).json({
							statusCode: 401,
							message: "Your account has been blocked by the Admin. Please contact support@support.com.",
						});
					} else {
						req.credentials = tokenData;
						req.credentials.accessToken = req.headers.authorization;
						await next();
					}
				} else {
					return res.status(401).json({
						statusCode: 401,
						message: "The token is not valid or User not Found!",
					});
				}
			}
		} else {
			return res.status(401).send(response.error_msg.invalidToken);
		}
	} catch (err) {
		console.log(err);
		return res.status(401).send(response.error_msg.invalidToken);
	}
};
module.exports = {
	verifyToken: verifyToken
};