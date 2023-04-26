var error_msg = {
	invalidToken: {
		message: "Your are unauthorized. Please login or create account to get access.",
		statusCode: 401,
		responseType: ""
	},
	invalidAccess: {
		message: "Service not Included in your Plan. Please Upgrade Your Plan for this Service",
		statusCode: 401,
		responseType: ""
	},
	InvalidID: {
		message: "Your id is invalid.",
		statusCode: 400,
		responseType: ""
	},
	InvalidPasswordToken: {
		message: "Invalid token.",
		statusCode: 400,
		responseType: ""
	},
	blockUser: {
		message: "Your account has been blocked. Please contact admin",
		statusCode: 400,
		responseType: ""
	},
	ACCOUNT_NOT_VERIFIED: {
		message: "Your account is not verified.Please verify your account",
		statusCode: 400,
		responseType: ""
	},
	deleteUser: {
		message: "Your account has been deleted. Please contact admin",
		statusCode: 400,
		responseType: ""
	},
	alreadyExist: {
		message: "This Email is already registered with us.",
		statusCode: 400,
		responseType: ""
	},
	existsInAnotherAccount: {
		message: "This Email is already associated with another account.",
		statusCode: 400,
		responseType: ""
	},
	numberAlreadyExist: {
		message: "This number is already registered with us.",
		statusCode: 400,
		responseType: ""
	},
	userNotFound: {
		message: "User not found",
		statusCode: 400,
		responseType: ""
	},
	emailNotFound: {
		statusCode: 400,
		message: "Invalid credentials",
		responseType: ""
	},
	phoneNotFound: {
		statusCode: 400,
		message: "Invalid credentials",
		responseType: ""
	},
	emailOrPhoneNumberRequired: {
		statusCode: 400,
		message: "Please enter email or phone number",
		responseType: ""
	},
	emailAndPasswordNotFound: {
		statusCode: 400,
		message: "This email or password is invalid.",
		responseType: ""
	},
	passwordNotMatch: {
		statusCode: 400,
		message: "Invalid Login credentials",
		responseType: ""
	},
	oldPasswordNotMatch: {
		statusCode: 400,
		message: "Old password is not valid.",
		responseType: ""
	},
	deletedAccount: {
		statusCode: 400,
		message: "Your account is deleted.",
		responseType: ""
	},
	invalidLink: {
		statusCode: 400,
		message: "Invalid Link.",
		responseType: ""
	},
	emailAlreadyVerified: {
		statusCode: 400,
		message: "Email already verified.",
		responseType: "emailAlreadyVerified"
	},
	implementationError: {
		statusCode: 400,
		message: "Implementation Error.",
		responseType: "IMPLEMENTATION_ERROR"
	},
	invalidOtp: {
		statusCode: 400,
		message: "Invalid verification code.",
		responseType: "INVALID_OTP"
	},
	imageRequired: {
		statusCode: 400,
		message: "Image is required.",
		responseType: "IMAGE_REQUIRED"
	},
	nameAlreadyExist: {
		message: "name should be unique.",
		statusCode: 400,
		responseType: ""
	},
	OLD_PASSWORD: {
		message: "Your old password is incorrect",
		responseType: "OLD_PASSWORD",
		statusCode: 400
	},
	OLD_NEW_PASSWORD: {
		message: "Your old password and new password is same please change to other password",
		responseType: "OLD_NEW_PASSWORD",
		statusCode: 400
	},
	recordNotFound: {
		statusCode: 400,
		message: "Record not found.",
		responseType: "RECORD_NOT_FOUND"
	},
	invalidReferralCode: {
		message: "This referral code is invalid.",
		statusCode: 400,
		responseType: ""
	},
	emailWithSocialLogin: {
		message: "There is no password associated with this id. Use Forgot password to generate password.",
		statusCode: 400,
		responseType: ""
	},
	passwordRequired: {
		statusCode: 400,
		message: "Password is required.",
		responseType: ""
	},
	appDataExist: {
		message: "App already exist with same version data and platform.",
		statusCode: 400,
		responseType: ""
	},

	greaterVersion: {
		message: 	"Please Enter greater version",
		statusCode: 400,
		responseType: ""
	},
	equalVersion: {
		message: 	" version is equal",
		statusCode: 400,
		responseType: ""
	},
	notAdded: {
		message: 	"data not added",
		statusCode: 400,
		responseType: ""
	},
	notFound: {
		message: 	"data not Found",
		statusCode: 400,
		responseType: ""
	},


};
var sendSuccess = (data)=> {
	let success_msg = {
		"statusCode": 200,
		"message": data.message || "Success",
		"data": data,
		
	};
	console.log("data",data)
	return success_msg;
};
module.exports = {
	error_msg: error_msg,
	sendSuccess: sendSuccess,
};