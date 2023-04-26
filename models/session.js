module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("sessions", {
		...require("./core")(Sequelize, DataTypes),
		userId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "users"
			},
			type: Sequelize.UUID
		},
		accessToken: {
			allowNull: true,
			type: DataTypes.TEXT
		},
		
	}, { tableName: "sessions" }
	);
};
