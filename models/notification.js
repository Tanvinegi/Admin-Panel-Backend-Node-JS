module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("notification", {
		...require("./core")(Sequelize, DataTypes),

    title: {
      type: DataTypes.STRING(120),
      defaultValue: null,
    },
    message: {
      type: DataTypes.STRING(120),
    },
    image: {
      type: DataTypes.STRING(120),
    },
  },
  {
    tableName: "notification",
    timestamps: true,
    paranoid: true,
    deletedAt: 'destroyTime'
  }
);
}