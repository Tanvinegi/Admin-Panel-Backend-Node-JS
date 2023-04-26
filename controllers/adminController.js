const _ = require("underscore");
const moment = require("moment");
const Joi = require("joi");
const appConstants = require("./../config/appConstants");
const Response = require("../config/response");
let commonHelper = require("../Helper/common");
let config = require("../config/env")();
let message = require("../config/messages");
let Services = require("../services");
const privateKey = config.APP_URLS.PRIVATE_KEY_ADMIN;
let TokenManager = require("../Helper/adminTokenManager");
let NotificationManager = require("../Helper/mailer");
let adminProjection = ["id", "firstName", "lastName", "email", "countryCode", "phoneNumber", "adminType", "image", "isBlocked", "createdAt"];



module.exports = {
	getAllAdmins: async(payloadData) => {
		const schema = Joi.object().keys({
			// limit: Joi.number().required(),
			// skip: Joi.number().required(),
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
			adminType: Joi.string().optional().allow(""),
			isBlocked: Joi.number().optional(),
			isActive: Joi.number().optional(),
			accessPermissions: Joi.string().optional(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let admins = await Services.AdminService.getAllAdmins(payload, adminProjection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
		if (admins) {
			return admins;
		} else {
			return {
				rows: [],
				count: 0,
			};
		}
	},
  addAdmin: async(payloadData) => {
		const schema = Joi.object().keys({
			email: Joi.string().optional(),
			firstName: Joi.string().optional(),
			lastName: Joi.string().optional(),
			countryCode: Joi.string().optional(),
			phoneNumber: Joi.number().integer().optional(),
			adminType: Joi.any().valid(...appConstants.APP_CONSTANTS.ADMIN_TYPES).optional(),
			accessPermissions: Joi.array().items({
				module: Joi.string().optional(),
				permission: Joi.number().valid(0, 1).optional(),
			}).optional(),
		});
		let generatedString = commonHelper.generateRandomString(6, "numeric");
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    console.log("ssksksksk",payload)
		let condition = {
			email: payload.email,
			isDeleted: 0,
		};
		let checkAdmin = await Services
			.AdminService
			.getAdmin(condition, ["id", "email", "emailVerified"], false);
		if (checkAdmin) throw Response.error_msg.alreadyExist;
		let objToSave = {};
		if (_.has(payload, "email") && payload.email != "") objToSave.email = payload.email;
		if (_.has(payload, "firstName") && payload.firstName != "") objToSave.firstName = payload.firstName;
		if (_.has(payload, "lastName") && payload.lastName != "") objToSave.lastName = payload.lastName;
		if (_.has(payload, "adminType") && payload.adminType != "") objToSave.adminType = payload.adminType;
		if (_.has(payload, "countryCode") && payload.countryCode != "") objToSave.countryCode = payload.countryCode;
		if (_.has(payload, "phoneNumber") && payload.phoneNumber != "") objToSave.phoneNumber = payload.phoneNumber;
		objToSave.passwordResetToken = generatedString;
		let addAdmin = await Services.AdminService.addAdmin(objToSave);
		let permissions = {};
		if (addAdmin) {
			if (payload.accessPermissions) {
				payload.accessPermissions.forEach((accessPermission) => {
					permissions[accessPermission.module] = accessPermission.permission;
				});
			}
			permissions.adminId = addAdmin.dataValues.id;
			await Services.AdminPermissionService.createAdminPermission(permissions);
			
			let path = "/admin/v1/admin/generatePassword?email=" + payload.email + "&token=";
			var variableDetails = {
				user_name: (payload.firstName + payload.lastName || "Admin User"),
				ip: config.APP_URLS.API_URL,
				baseUrl: config.APP_URLS.API_URL,
				s3Url: config.AWS.S3.s3Url,
				resetPasswordToken: config.APP_URLS.API_URL + path + generatedString
			};
			// await NotificationManager.sendMail("ADD_ADMIN", payload.email, variableDetails);
		} else throw Response.error_msg.implementationError;
	},


  
  login: async(payloadData) => {
		const schema = Joi.object().keys({
			email: Joi.string().email().required(),
			password: Joi.string().required(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let emailCriteria = {
			email: payload.email,
			isDeleted: 0
		};
		let projection = [...adminProjection];
		projection.push("password");
		let checkEmailExist = await Services.AdminService.getAdmin(emailCriteria, projection, true);
		if (checkEmailExist && checkEmailExist.id) {
			let comparePass = await commonHelper.comparePassword(payload.password, checkEmailExist.password);
			let tokenGenerated;
			if (checkEmailExist.isBlocked === 1) throw Response.error_msg.blockUser;
			else if (!comparePass) {
				throw Response.error_msg.passwordNotMatch;
			} else {
				let tokenData = {
					email: checkEmailExist.email,
					id: checkEmailExist.id,
					type: checkEmailExist.adminType
				};
				TokenManager
					.setToken(tokenData, privateKey, (err, output) => {
						if (err) {
							throw Response.error_msg.implementationError;
						} else {
							if (output && output.accessToken) {
								tokenGenerated = output.accessToken;
							} else {
								throw Response.error_msg.implementationError;
							}
						}
					});
				delete checkEmailExist.dataValues["password"];
				let response = {
					accessToken: tokenGenerated,
					adminDetails: checkEmailExist
				};
				return response;
			}
		} else throw Response.error_msg.emailNotFound;
	},
  resetNewPassword: async(payloadData) => {
		const schema = Joi.object().keys({
			email: Joi.string().optional(),
			token: Joi.string().optional().required(),
			newPassword: Joi.string().min(5).required()
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    console.log("dddd",payload)
		let adminObj = null;
		let criteria = {
			isDeleted: 0,
			passwordResetToken: payload.token
		};
		let admin = await Services.AdminService.getAdmin(criteria, ["id", "email", "firstName", "password"], false);
		if (admin) {
			adminObj = admin.dataValues;
			if (adminObj && adminObj.id) {
				let criteria = {
					id: adminObj.id
				};
				let objToSave = {
					password: await commonHelper.generateNewPassword(payload.newPassword),
					forgotPasswordGeneratedAt: null,
					passwordResetToken: null
				};
				let update = await Services.AdminService.updateAdmins(criteria, objToSave);
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
  logout: async(token) => {
		await TokenManager.expireToken(token, (err, output) => {
			if (err) {
				console.log("err ==>>", err);
				throw Response.error_msg.implementationError;
			} else {
				return output;
			}
		});
	},
	resetPassword: async(payloadData) => {
		const schema = Joi.object().keys({
			id: Joi.string().guid({ version: "uuidv4" }).required(),
			password: Joi.string().min(5).required(),
			oldPassword: Joi.string().min(5).required(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		console.log("$$$$$$$$$$$$$4",payload)
		let adminObj = null;
		if (!payload || !payload.password) {
			throw Response.error_msg.implementationError;
		} else {
			let criteria = {
				id: payload.id,
				isDeleted: 0
			};
			let admin = await Services.AdminService.getAdmin(criteria, ["id", "email", "firstName", "password"],false);
			console.log("@@@@@@@@@@@@@@%%%%%%%%%%%%%",admin)
			if (admin) {
				let comparePass = await commonHelper.comparePassword(payload.oldPassword, admin.password);
				if (!comparePass) {
					throw Response.error_msg.oldPasswordNotMatch;
				} else {
					adminObj = admin.dataValues;
					console.log("datvalues",adminObj)
					if (adminObj && adminObj.id) {
						let objToSave = {
							password: await commonHelper.generateNewPassword(payload.password),
							forgotPasswordGeneratedAt: null,
							passwordResetToken: null
						};
						await Services.AdminService.updateAdmins(criteria, objToSave);
					} else {
						throw Response.error_msg.implementationError;
					}
				}
			} else throw Response.error_msg.InvalidPasswordToken;
		}
	},
	updateAdmin: async(payloadData) => {
		const schema = Joi.object().keys({
			id: Joi.string().guid({ version: "uuidv4" }).required(),
			email: Joi.string().optional(),
			firstName: Joi.string().optional(),
			lastName: Joi.string().optional(),
			countryCode: Joi.string().optional(),
			phoneNumber: Joi.string().optional(),
			adminType: Joi.any().valid(...appConstants.APP_CONSTANTS.ADMIN_TYPES).optional(),
			isBlocked: Joi.number().valid(0, 1).optional(),
			isDeleted: Joi.number().valid(0, 1).optional(),
			accessPermissions: Joi.array().items({
				module: Joi.string().required(),
				permission: Joi.number().valid(0, 1).required(),
			}).optional(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		console.log(">>>>>>>>>>>>>",payload)
		let checkEmailExist;
		if (payload.email) {
			let criteria = {
				email: payload.email,
				isDeleted: 0,
			};
			checkEmailExist = await Services.AdminService.getAdmin(criteria, ["id", "email"], false);
			if ((checkEmailExist) && (payload.id !== checkEmailExist.dataValues.id)) {
				throw Response.error_msg.existsInAnotherAccount;
			}
		}
		let condition = {
			id: payload.id,
		};
		let objToSave = {};
		if (_.has(payload, "email") && payload.email != "") objToSave.email = payload.email;
		if (_.has(payload, "firstName") && payload.firstName != "") objToSave.firstName = payload.firstName;
		if (_.has(payload, "lastName") && payload.lastName != "") objToSave.lastName = payload.lastName;
		if (_.has(payload, "adminType") && payload.adminType != "") objToSave.adminType = payload.adminType;
		if (_.has(payload, "countryCode") && payload.countryCode != "") objToSave.countryCode = payload.countryCode;
		if (_.has(payload, "phoneNumber") && payload.phoneNumber != "") objToSave.phoneNumber = payload.phoneNumber;
		if (_.has(payload, "isBlocked")) objToSave.isBlocked = payload.isBlocked;
		if (_.has(payload, "isDeleted")) objToSave.isDeleted = payload.isDeleted;

		await Services.AdminService.updateAdmins(condition, objToSave);
		let permissionObject = payload.accessPermissions;
		if (payload.accessPermissions) {
			payload.accessPermissions.forEach((accessPermission) => {
				permissionObject[accessPermission.module] = accessPermission.permission;
			});
			await Services.AdminPermissionService.updateAdminPermissions({ adminId: payload.id }, permissionObject);
		}
		return message.success.UPDATED;
	},
	forgotPassword: async(payloadData) => {
		const schema = Joi.object().keys({
			email: Joi.string().email().required()
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let generatedString = commonHelper.generateRandomString(6, "numeric");
		var adminObj = null;
		var criteria = {
			email: payload.email,
			isDeleted: 0
		};
		let adminData = await Services.AdminService.getAdmin(criteria, ["email", "firstName", "lastName", "id", "forgotPasswordGeneratedAt", "isBlocked"], false);
		adminObj = adminData;
		if (!adminObj) {
			throw Response.error_msg.emailNotFound;
		} else if (adminObj && adminObj.isBlocked === 1) {
			throw Response.error_msg.blockUser;
		} else if (adminObj && adminObj.forgotPasswordGeneratedAt && (moment(new Date(Date.now())).diff(adminObj.forgotPasswordGeneratedAt, "minutes") <= 1)) {
			throw Response.error_msg.tryAfterSomeTime;
		}
		let objToSave = {
			forgotPasswordGeneratedAt: moment(new Date(Date.now())).format("YYYY-MM-DD HH:mm:ss"),
			passwordResetToken: generatedString
		};
		await Services.AdminService.updateAdmins(criteria, objToSave);
		let path = "/admin/v1/admin/generatePassword?email=" + payload.email + "&token=";
		var variableDetails = {
			user_name: (adminData.firstName + adminData.lastName || "Admin User"),
			ip: config.APP_URLS.API_URL,
			baseUrl: config.APP_URLS.API_URL,
			s3Url: config.AWS.S3.s3Url,
			resetPasswordToken: config.APP_URLS.API_URL + path + generatedString
		};
		await NotificationManager.sendMail("FORGOT_PASSWORD_ADMIN", payload.email, variableDetails);
	},

	active: async(payloadData) => {
		
		
		let admins = await Services.AdminService.getAllAdmins(payload, adminProjection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
		if (admins) {
			return admins;
		} else {
			return {
				rows: [],
				count: 0,
			};
		}
	},

	 deleteAdmin: async(paramData) => {
		const schema = Joi.object().keys({
			id: Joi.string().guid({ version: "uuidv4" }).required()
		});
		let payload = await commonHelper.verifyJoiSchema(paramData, schema);
    console.log("$$$$$$$$$$$$$$",payload)
    console.log("$$$$$$$$$$$$$$",paramData)
		let criteria = {
			id: payload.id,

		};
   

		let dataTodelete = Services.AdminService.delete(criteria, adminProjection, true);
		if (dataTodelete) {
			return message.success.DELETED;
		} else {
			throw Response.error_msg.recordNotFound;
		}
	},

	getAdminProfile: async(id) => {
		let criteria = {
			id: id
		};
		console.log("step 1", criteria);
		let admin = await Services.AdminService.getAdmin(criteria, adminProjection, false);
		console.log("step 2", admin);
		return admin;
	},


};

  