const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Expense = sequelize.define("Expense", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    description: {
        type: DataTypes.STRING,
        allowNull: false
    },

    category: {
        type: DataTypes.STRING,
        allowNull: false
    },

    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
});

module.exports = Expense;