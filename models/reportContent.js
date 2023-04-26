module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("reportContent", {
		...require("./core")(Sequelize, DataTypes),

    ReportedItem: {
      type: DataTypes.STRING(120),
      defaultValue: null,
    },
    Status: {
      type:DataTypes.ENUM("approved", "declined","pending"),
    defaultValue: "pending",
    },
    
    ReportedBy: {
      type: DataTypes.STRING(120),
    },

    Description:{
         type: DataTypes.STRING(120),
         defaultValue: null,
    }
  },
  {
    tableName: "reportContent",
    timestamps: true,
    paranoid: true,
    deletedAt: 'destroyTime'
  }
);
}



