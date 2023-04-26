module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("adminAchievementLevel", {
		...require("./core")(Sequelize, DataTypes),
    levelName: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    achievementId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: "adminAchievement",
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
  }
);

}