let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("users", {
		...require("./core")(Sequelize, DataTypes),
		firstName: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		lastName: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		email: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		password: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		countryCode: {
			type: DataTypes.STRING(5),
			defaultValue: null,
		},
		phoneNumber: {
			type: DataTypes.INTEGER(10),
			defaultValue: null,
		},
		passwordResetToken: {
			type: DataTypes.STRING(200),
			allowNull: true,
			field: "passwordResetToken"
		},
		

	}, { tableName: "users" }
	);
};
