module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("reportBug", {
		...require("./core")(Sequelize, DataTypes),

    ReportedItem: {
      type: DataTypes.STRING(120),
      defaultValue: null,
    },
    Status: {
      type:DataTypes.ENUM("pending", "approved", "declined"),
    defaultValue: "pending",
    },
    
    ReportedBy: {
      type: DataTypes.STRING(120),
    },
  },
  {
    tableName: "reportBug",
    timestamps: true,
    paranoid: true,
    deletedAt: 'destroyTime'
  }
);
}



