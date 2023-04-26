const _ = require("underscore");
const Joi = require("joi");
let commonHelper = require("../Helper/common");
let message = require("../config/messages");
let response = require("../config/response");
let Services = require("../services");
let TokenManager = require("../Helper/tokenManager");
let config = require("../config/env")();
const privateKey = config.APP_URLS.PRIVATE_KEY;
const env = require("../config/env")();
const Mailer = require("../Helper/mailer");

let userProjection = ["id", "firstName", "lastName", "email", "countryCode", "phoneNumber", "isBlocked", "createdAt"];

module.exports = {
	registerUser: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				firstName: Joi.string().required(),
				lastName: Joi.string().required(),
				countryCode: Joi.string().optional(),
				phoneNumber: Joi.number().optional(),
				email: Joi.string().email().required(),
				password: Joi.string().optional(),
				
			});
			let generatedString = commonHelper.generateRandomString(6, "numeric");
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let projection = ["id", "email", "isBlocked"];
			if (payload.email && payload.email != "") {
				let criteria = {
					"email": payload.email,
					"isDeleted": 0
				};
			let	userData = await Services.userService.getUsers(criteria, projection);
				if (userData && userData.isBlocked === 1) throw response.error_msg.blockUser;
				if (userData) throw response.error_msg.alreadyExist;
			}
			let criteria2 = {};
			let userDataPhone = null;
			if (payload.phoneNumber && payload.phoneNumber != "") {
				criteria2 = {
					"phoneNumber": payload.phoneNumber,
					"countryCode": payload.countryCode,
					"isDeleted": 0
				};
				userDataPhone = await Services.userService.getUsers(criteria2, projection);
				if (userDataPhone && userDataPhone.isBlocked === 1) throw response.error_msg.blockUser;
				if (userDataPhone) throw response.error_msg.numberAlreadyExist;
			}
			if(payload.password && payload.password !== "") {
				payload.password = await commonHelper.generateNewPassword(payloadData.password);
			}

        let objToSave = {};
		if (_.has(payload, "email") && payload.email != "") objToSave.email = payload.email;
		if (_.has(payload, "firstName") && payload.firstName != "") objToSave.firstName = payload.firstName;
		if (_.has(payload, "lastName") && payload.lastName != "") objToSave.lastName = payload.lastName;
		if (_.has(payload, "adminType") && payload.adminType != "") objToSave.adminType = payload.adminType;
		if (_.has(payload, "countryCode") && payload.countryCode != "") objToSave.countryCode = payload.countryCode;
		if (_.has(payload, "phoneNumber") && payload.phoneNumber != "") objToSave.phoneNumber = payload.phoneNumber;
		objToSave.passwordResetToken = generatedString;
         let user_Data = await Services.userService.saveData(objToSave);
		 let criteria3 ={};

		let usersdata = await Services.userService.getUsers(criteria3,userProjection)

		 return usersdata;
			
		
			
		} catch (err) {
			console.log("err", err);
			throw err;
		}
	},
	
	
	forgotPassword: async (payloadData) => {
		try {
			let token = await commonHelper.generateRandomNumbers(6);
			const schema = Joi.object().keys({
				email: Joi.string().email().optional().allow(""),
				countryCode: Joi.string().optional().allow(""),
				phoneNumber: Joi.string().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			if ((!payload.email) && (!payload.phoneNumber)) throw response.error_msg.emailOrPhoneNumberRequired;
			let criteria = {
				"isDeleted": 0
			};
			if (payload.email) {
				criteria.email = payload.email;
			} else {
				criteria.countryCode = payload.countryCode;
				criteria.phoneNumber = payload.phoneNumber;
			}
			let userData = await Services.userService.getUsers(criteria, ["id", "firstName", "lastName", "email", "countryCode", "phoneNumber", "isBlocked"]);
			if (!userData) throw response.error_msg.userNotFound;
			if (userData && userData.isBlocked === 1) throw response.error_msg.blockUser;
			let otp = "1111"; //await commonHelper.generateRandomNumbers(4);
			let newToken = await commonHelper.encrypt(token);
			criteria = {
				"id": userData.id
			};
			if (payload.email) {
				let path = "/api/v1/user/generatePassword?email=" + payload.email + "&token=";
				var variableDetails = {
					name: userData.firstName + " " + userData.lastName,
					otp: otp,
					ip: env.APP_URLS.API_URL,
					resetPasswordToken: env.APP_URLS.API_URL + path + token,
					// termsUrl: env.APP_URLS.API_URL + "/api/v1/user/terms",
					// privacyUrl: env.APP_URLS.API_URL + "/api/v1/user/privacy-policy"
				};
				await Mailer.sendMail("FORGOT_PASSWORD", payload.email, variableDetails);
			} else {
				otp = "1111";
				// Twilio.sendSms({ to: userData.phoneNumber, body: `Your verification code for common-library is : ${otp}` }, (err, smsData) => {
				// console.log(err, smsData);
				// });
			}
			await Services.userService.updateData(criteria, { forgotPasswordOtp: otp, forgotPasswordToken: newToken });
			return { token: token };
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	
	resetNewPassword: async(payloadData) => {
		const schema = Joi.object().keys({
			email: Joi.string().optional(),
			token: Joi.string().optional().required(),
			newPassword: Joi.string().min(5).required()
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    console.log("dddd",payload)
		let userObj = null;
		let criteria = {
			isDeleted: 0,
			passwordResetToken: payload.token
		};
		let user_Data = await Services.userService.getUsers(criteria, ["id", "email", "firstName", "password"], false);
		if (user_Data) {
			userObj = user_Data.dataValues;
			if (userObj && userObj.id) {
				let criteria = {
					id: userObj.id
				};
				let objToSave = {
					password: await commonHelper.generateNewPassword(payload.newPassword),
					passwordResetToken: null
				};
				let update = await Services.userService.updateData(criteria, objToSave);
				if (update) {
					return {};
				} else throw Response.error_msg.implementationError;
			} else {
				throw Response.error_msg.implementationError;
			}
		} else {
			throw Response.error_msg.InvalidPasswordToken;
		}
	},
	login: async(payloadData) => {
		const schema = Joi.object().keys({
			email: Joi.string().email().required(),
			password: Joi.string().required()
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let emailCriteria = {
			email: payload.email,
			isDeleted: 0
		};
		let projection = [...userProjection];
		projection.push("password");
		let checkEmailExist = await Services.userService.getUsers(emailCriteria, projection, true);
		console.log("----------------",checkEmailExist)
		if (checkEmailExist && checkEmailExist.id) {
			let comparePass = await commonHelper.comparePassword(payload.password, checkEmailExist.password);
			let tokenGenerated;
			if (checkEmailExist.isBlocked === 1) throw response.error_msg.blockUser;
			else if (!comparePass) {
				throw response.error_msg.passwordNotMatch;
			} else {
				let tokenData = {
					email: checkEmailExist.email,
					id: checkEmailExist.id,
				};
				console.log("----------------",tokenData)
				TokenManager
					.setToken(tokenData, privateKey, (err, output) => {
						if (err) {
							throw response.error_msg.implementationError;
						} else {
							if (output && output.accessToken) {
								tokenGenerated = output.accessToken;
							} else {
								throw response.error_msg.implementationError;
							}
						}
					});
				delete checkEmailExist.dataValues["password"];
				let Response = {
					accessToken: tokenGenerated,
					userDetails: checkEmailExist
				};
				return Response;
			}
		} else throw response.error_msg.emailNotFound;
	},
	resetPasswordEmail: async (payloadData) => {
		const schema = Joi.object().keys({
			email: Joi.string().optional(),
			token: Joi.string().optional().required(),
			newPassword: Joi.string().min(5).required()
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let userData = await Services.userService.getUsers({
			"isDeleted": 0,
			"forgotPasswordToken": payload.token
		}, ["id", "email"]);
		if (userData) {
			if (userData && userData.id) {
				let criteria = {
					id: userData.id
				};
				let objToSave = {
					password: await commonHelper.encrypt(payload.newPassword),
					forgotPasswordToken: null
				};
				let update = await Services.userService.updateData(criteria, objToSave);
				if (update) {
					return {};
				} else throw response.error_msg.implementationError;
			} else {
				throw response.error_msg.implementationError;
			}
		} else {
			throw response.error_msg.InvalidPasswordToken;
		}
	},
	changePassword: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				password: Joi.string().min(5).required(),
				oldPassword: Joi.string().min(5).required(),
				id: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			if (!payload || !payload.password) {
				throw response.error_msg.implementationError;
			} else {
				let criteria = {
					isDeleted: 0
				};
				if (_.has(payload, "id")) criteria.id = payload.id;
				let projection = ["id", "email", "password", "phoneNumber", "isBlocked"];
				let userData = await Services.userService.getUsers(criteria, projection);
				if (!userData) throw response.error_msg.emailAndPasswordNotFound;
				if (userData && userData.isBlocked === 1) throw response.error_msg.blockUser;
				let oldPassword = await commonHelper.encrypt(payload.oldPassword);
				if (userData && userData.password !== oldPassword) throw response.error_msg.passwordNotMatch;
				let password = await commonHelper.encrypt(payload.password);
				let objToSave = {
					password: password
				};
				let update = await Services.userService.updateData(criteria, objToSave);
				if (update) {
					return {};
				} else throw response.error_msg.implementationError;
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	logout: async(token) => {
		await TokenManager.expireToken(token, (err, output) => {
			if (err) {
				console.log("err ==>>", err);
				throw response.error_msg.implementationError;
			} else {
				return output;
			}
		});
	},
	
	getUserDetail: async (data) => {
		try {
			let criteria = {
				
			};
			let projection = [...userProjection];
			let result = await Services.userService.getAllUser(criteria, projection);
			return result;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	updateUser: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				email: Joi.string().email().optional().allow(""),
				countryCode: Joi.string().optional().allow(""),
				phoneNumber: Joi.number().optional().allow(""),
				firstName: Joi.string().optional(),
				lastName: Joi.string().optional(),
				id:Joi.string().optional(),
				isBlocked: Joi.number().valid(0, 1).optional(),
			isDeleted: Joi.number().valid(0, 1).optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id
			};
			let objToSave = {};
			if (_.has(payload, "email") && payload.email != "") objToSave.email = payload.email;
			if (_.has(payload, "phoneNumber") && payload.phoneNumber != "") objToSave.phoneNumber = payload.phoneNumber;
			if (_.has(payload, "countryCode") && payload.countryCode != "") objToSave.countryCode = payload.countryCode;
			if (_.has(payload, "firstName")) objToSave.firstName = payload.firstName;
			if (_.has(payload, "lastName")) objToSave.firstName = payload.lastName;
		
			let isUpdated = await Services.userService.updateData(criteria, objToSave);
			if (isUpdated) {
				let projection = [...userProjection]
				let userData = await Services.userService.getUsers(criteria, projection);
				let data = userData.dataValues;
			
				return data;
			} else {
				throw response.error_msg.implementationError;
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	deleteUser: async (tokenData) => {
		try {
			let session = await Services.SessionsService.getSessionDetail({
				userId: tokenData.id
			}, ["id", "deviceToken"]);
			await Services.userService.updateData({
				id: tokenData.id
			}, {
				isDeleted: 1
			});
			await Services.userService.updateSocialAccounts({
				userId: tokenData.id
			}, {
				isDeleted: 1
			});
			if (session) {
				await TokenManager.expireToken(tokenData, session.deviceToken, (err, output) => {
					if (err) {
						throw response.error_msg.implementationError;
					} else {
						return output;
					}
				});
			} else {
				return {};
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	}
};