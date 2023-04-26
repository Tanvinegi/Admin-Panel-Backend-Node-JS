module.exports = (Sequelize, DataTypes) => {
	return {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		isBlocked: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0,
			field: "isBlocked"
		},
		isDeleted: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0,
			field: "isDeleted"
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW(0),
			field: "createdAt"
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW(0),
			field: "updatedAt"
		}
	};
};
