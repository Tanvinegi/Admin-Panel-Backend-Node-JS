module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("adminAchievement", {
		...require("./core")(Sequelize, DataTypes),
    
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
     Type:{
        type:DataTypes.STRING(120),
        allowNull: false,
     }
    },
    {
        tableName: "adminAchievement",
        timestamps: true,
        paranoid: true,
       
    }
  );
  
}