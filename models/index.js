var Sequelize = require("sequelize");
var sequelize = require("../dbConnection").sequelize;
module.exports = {
  Admin: require("./admin")(Sequelize, sequelize, Sequelize.DataTypes),
  AdminAchievement: require("./adminAchievement")(Sequelize, sequelize, Sequelize.DataTypes),
	AdminPermissions: require("./adminPermissions")(Sequelize, sequelize, Sequelize.DataTypes),
  AdminSessions: require("./adminSessions")(Sequelize, sequelize, Sequelize.DataTypes),
  Version: require("./version")(Sequelize, sequelize, Sequelize.DataTypes),
  User: require("./user")(Sequelize, sequelize, Sequelize.DataTypes),
  Sessions: require("./session")(Sequelize, sequelize, Sequelize.DataTypes),
  Category: require("./category")(Sequelize, sequelize, Sequelize.DataTypes),
  Notification: require("./notification")(Sequelize, sequelize, Sequelize.DataTypes),
  ReportBug: require("./reportBug")(Sequelize, sequelize, Sequelize.DataTypes),
  ReportContent: require("./reportContent")(Sequelize, sequelize, Sequelize.DataTypes),
  AchievementLevel: require("./achievementLevel")(Sequelize, sequelize, Sequelize.DataTypes),
  UserSocialAccount: require("./userSocialAccount")(Sequelize, sequelize, Sequelize.DataTypes)
}