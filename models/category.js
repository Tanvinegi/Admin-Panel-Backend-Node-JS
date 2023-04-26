module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("Category", {
		...require("./core")(Sequelize, DataTypes),
    name: {
      type: DataTypes.STRING(120),
      defaultValue: null,
    },
    image: {
      type: DataTypes.STRING(120),
      defaultValue: null,
     
    },
  },
  {
    tableName: "Category",
    timestamps: true,
    paranoid: true,
    
  }
);
}