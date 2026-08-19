require("dotenv").config();


// =====================================================
// CHECK GEMINI API KEY
// =====================================================

console.log("======================================");
console.log("GEMINI API KEY CHECK");

if (process.env.GEMINI_API_KEY) {
    console.log("GEMINI API KEY: LOADED ✅");
} else {
    console.log("GEMINI API KEY: NOT FOUND ❌");
}

console.log("======================================");


// =====================================================
// IMPORTS
// =====================================================

const express = require("express");
const cors = require("cors");

const sequelize = require("./db");

const User = require("./User");
const Expense = require("./Expense");

require("./Order");


// =====================================================
// ASSOCIATIONS
// =====================================================

// One User can have many Expenses

User.hasMany(Expense, {
    foreignKey: "userId",
    as: "Expenses"
});


// One Expense belongs to one User

Expense.belongsTo(User, {
    foreignKey: "userId",
    as: "User"
});


// =====================================================
// ROUTES
// =====================================================

const expenseRoute =
    require("./routes/expenseRoute");

const paymentRoute =
    require("./routes/paymentRoute");

const premiumRoute =
    require("./routes/premiumRoute");

const leaderboardRoute =
    require("./routes/leaderboardRoute");


// =====================================================
// PASSWORD ROUTE
// =====================================================

const passwordRoute =
    require("./routes/passwordRoute");


// =====================================================
// CREATE EXPRESS APP
// =====================================================

const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// =====================================================
// EXPENSE ROUTES
// =====================================================

app.use(
    "/expenses",
    expenseRoute
);


// =====================================================
// PAYMENT ROUTES
// =====================================================

app.use(
    "/payment",
    paymentRoute
);


// =====================================================
// PREMIUM ROUTES
// =====================================================

app.use(
    "/premium",
    premiumRoute
);


// =====================================================
// LEADERBOARD ROUTES
// =====================================================

app.use(
    "/leaderboard",
    leaderboardRoute
);


// =====================================================
// PASSWORD ROUTES
// =====================================================

app.use(
    "/password",
    passwordRoute
);


// =====================================================
// TEST ROUTE
// =====================================================

app.get(
    "/",
    (req, res) => {

        return res.status(200).json({

            success: true,

            message:
                "Expense API is running"

        });

    }
);


// =====================================================
// START SERVER
// =====================================================

async function startServer() {

    try {

        // ---------------------------------------------
        // CHECK DATABASE CONNECTION
        // ---------------------------------------------

        await sequelize.authenticate();

        console.log(
            "Database connected successfully ✅"
        );


        // ---------------------------------------------
        // SYNC DATABASE
        // ---------------------------------------------

        await sequelize.sync({
            alter: true
        });

        console.log(
            "Database tables updated successfully ✅"
        );


        // ---------------------------------------------
        // START EXPRESS SERVER
        // ---------------------------------------------

        app.listen(
            3001,
            () => {

                console.log(
                    "======================================"
                );

                console.log(
                    "Server running on port 3001 🚀"
                );

                console.log(
                    "http://localhost:3001"
                );

                console.log(
                    "======================================"
                );

            }
        );

    } catch (error) {

        console.log(
            "======================================"
        );

        console.log(
            "SERVER START ERROR ❌"
        );

        console.log(
            error.message
        );

        console.log(
            "======================================"
        );

    }

}


// =====================================================
// RUN SERVER
// =====================================================

startServer();