const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    "expense_db",
    "root",
    "Dheeraj@123",
    {
        host: "localhost",
        dialect: "mysql"
    }
);

module.exports = sequelize;