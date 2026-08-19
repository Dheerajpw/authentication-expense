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


// =====================================================
// FORGOT PASSWORD REQUEST RELATIONSHIP
// =====================================================

const ForgotPasswordRequest =
    require("./ForgotPasswordRequest");

User.hasMany(
    ForgotPasswordRequest,
    {
        foreignKey: "userId"
    }
);

ForgotPasswordRequest.belongsTo(
    User,
    {
        foreignKey: "userId"
    }
);


module.exports = User;