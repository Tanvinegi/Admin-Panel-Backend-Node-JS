const Sequelize = require("sequelize");
const env = require("./config/env")();

var sequelize = new Sequelize(
  
  env.DATABASE.name,
	env.DATABASE.user,
	env.DATABASE.password,
  {
  host: env.DATABASE.host,
  
  dialect: "mysql",
  logging: true,
});

var connectDB = () => {
  sequelize
    .authenticate()
    .then(() => {
      sequelize.sync({ alter: false });
      console.log("Connected Successfully");
    })
    .catch((err) => {
      console.log("Sequelize Connection Error:  ", err);
    });
};

module.exports = {
  sequelize: sequelize,
  connectDB: connectDB,
};