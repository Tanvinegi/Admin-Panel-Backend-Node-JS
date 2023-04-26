const constants = require("../config/constants.js");
module.exports = () => {
	let environment = process.env;
	switch (environment.NODE_ENV) {
		case "dev":
			return {
				APP_NAME: constants.APP_NAME,
				DEFAULTS: constants.DEFAULTS,
				APP_URLS: constants.APP_URLS.DEV,
				AWS: constants.AWS.DEV,
				DATABASE: constants.DATABASE.DEV,
				EMAIL: constants.EMAIL.DEV,
				FCM: constants.FCM.DEV
			};
		case "production":
			return {
				APP_NAME: constants.APP_NAME,
				DEFAULTS: constants.DEFAULTS,
				APP_URLS: constants.APP_URLS.PROD,
				AWS: constants.AWS.PROD,
				DATABASE: constants.DATABASE.PROD,
				EMAIL: constants.EMAIL.PROD,
				FCM: constants.FCM.PROD
			};
		case "local":
			return {
				APP_NAME: constants.APP_NAME,
				DEFAULTS: constants.DEFAULTS,
				APP_URLS: constants.APP_URLS.LOCAL,
				AWS: constants.AWS.LOCAL,
				DATABASE: constants.DATABASE.LOCAL,
				EMAIL: constants.EMAIL.LOCAL,
				FCM: constants.FCM.LOCAL
			};
		default:
			return {
				APP_NAME: constants.APP_NAME,
				DEFAULTS: constants.DEFAULTS,
				APP_URLS: constants.APP_URLS.LOCAL,
				AWS: constants.AWS.LOCAL,
				DATABASE: constants.DATABASE.LOCAL,
				EMAIL: constants.EMAIL.LOCAL,
				FCM: constants.FCM.LOCAL
			};
	}
};
