module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define(
		"admin_permissions",
		{
			...require("./core")(Sequelize, DataTypes),
			adminId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "admin", // name of Target model
					key: "id", // key in Target model that we"re referencing
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			dashboard: {
				type: DataTypes.TINYINT(1),
				allowNull: false,
				defaultValue: 0,
			},
			userManagement: {
				type: DataTypes.TINYINT(1),
				allowNull: false,
				defaultValue: 0,
			},
			adminManagement: {
				type: DataTypes.TINYINT(1),
				allowNull: false,
				defaultValue: 0,
			},
			notificationManagement: {
				type: DataTypes.TINYINT(1),
				allowNull: false,
				defaultValue: 0,
			},
			systemConfiguration: {
				type: DataTypes.TINYINT(1),
				allowNull: false,
				defaultValue: 0,
			},
			reportManagement: {
				type: DataTypes.TINYINT(1),
				allowNull: false,
				defaultValue: 0,
			}
		},
		{
			tableName: "admin_permissions"
		});
};