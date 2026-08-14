const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    orderId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM(
            "PENDING",
            "SUCCESSFUL",
            "FAILED"
        ),
        defaultValue: "PENDING"
    }
});

module.exports = Order;