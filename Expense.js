const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Expense = sequelize.define(
    "Expense",
    {
        // =========================
        // ID
        // =========================

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        // =========================
        // USER ID
        // =========================

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        // =========================
        // AMOUNT
        // =========================

        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        // =========================
        // DESCRIPTION
        // =========================

        description: {
            type: DataTypes.STRING,
            allowNull: false
        },

        // =========================
        // NOTE
        // =========================

        note: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        // =========================
        // CATEGORY
        // =========================

        category: {
            type: DataTypes.STRING,
            allowNull: false
        },

        // =========================
        // DATE
        // =========================

        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    },

    {
        // =========================
        // DATABASE TABLE
        // =========================

        tableName: "Expenses",

        // =========================
        // TIMESTAMPS
        // =========================

        timestamps: false
    }
);

module.exports = Expense;