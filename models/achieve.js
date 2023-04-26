module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("Achieve", {
		...require("./core")(Sequelize, DataTypes),
    Name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    achievement: {
        type: DataTypes.STRING(120),
        allowNull: false,
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
  }
);

}