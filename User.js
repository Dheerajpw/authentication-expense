const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },

        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        resetToken: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        resetTokenExpiry: {
            type: DataTypes.DATE,
            allowNull: true
        },

        isPremium: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        tableName: "users",
        timestamps: false
    }
);

module.exports = User;