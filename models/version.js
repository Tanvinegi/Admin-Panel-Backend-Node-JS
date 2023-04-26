module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("appVersion", {
		...require("./core")(Sequelize, DataTypes),
    appname: {
      type: Sequelize.DataTypes.STRING,
      defaultValue: null,
    },
    version: {
      type: Sequelize.DataTypes.FLOAT,
      defaultValue: null,
     
    },
    platform: {
      type: Sequelize.DataTypes.ENUM('Android', 'IOS'),
      defaultValue: null,
    },

    minimumVersion: {
      type: Sequelize.DataTypes.FLOAT,
      defaultValue: null,
    },
    latestVersion: {
      type: Sequelize.DataTypes.FLOAT,
      defaultValue: null,
    }
  },
  {
    tableName: "appVersion",
    timestamps: true,
    paranoid: true,
    deletedAt: 'destroyTime'
  }
);
}