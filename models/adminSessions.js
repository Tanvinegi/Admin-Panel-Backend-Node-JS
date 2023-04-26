module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("admin_sessions", {
		...require("./core")(Sequelize, DataTypes),
		adminId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "admin"
			},
			type: Sequelize.UUID
		},
		userType: {
			allowNull: true,
			type: DataTypes.STRING(20)
		},
		accessToken: {
			allowNull: true,
			type: DataTypes.TEXT
		}
	}, { tableName: "admin_sessions" });
};