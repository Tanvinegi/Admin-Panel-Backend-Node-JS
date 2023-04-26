let appConstants = require("./../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("admin", {
		...require("./core")(Sequelize, DataTypes),
		firstName: {
			type: DataTypes.STRING(150),
			allowNull: true
		},
		lastName: {
			type: DataTypes.STRING(150),
			allowNull: true
		},
		email: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		countryCode: {
			type: DataTypes.STRING(5),
			defaultValue: null,
		},
		phoneNumber: {
			type: DataTypes.STRING(16),
			defaultValue: null,
		},
		emailVerified: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0,
			field: "emailVerified"
		},
		password: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: "password"
		},
		passwordResetToken: {
			type: DataTypes.STRING(200),
			allowNull: true,
			field: "passwordResetToken"
		},
		adminType: {
			type: DataTypes.ENUM,
			values: appConstants.APP_CONSTANTS.ADMIN_TYPES
		},
		image: {
			type: DataTypes.STRING(200),
			field: "image"
		},
		forgotPasswordGeneratedAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW(0),
			field: "forgotPasswordGeneratedAt"
		}
	}, {
		tableName: "admin"
	});
};