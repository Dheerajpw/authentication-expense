const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const ForgotPasswordRequest = sequelize.define(
    "ForgotPasswordRequest",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        tableName: "ForgotPasswordRequests",
        timestamps: false
    }
);

module.exports = ForgotPasswordRequest;