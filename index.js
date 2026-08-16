require("dotenv").config();

const express = require("express");
const cors = require("cors");

const sequelize = require("./db");

const User = require("./User");
const Expense = require("./Expense");
require("./Order");


// =========================
// ASSOCIATIONS
// =========================

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


// =========================
// ROUTES
// =========================

const expenseRoute =
    require("./routes/expenseRoute");

const paymentRoute =
    require("./routes/paymentRoute");

const premiumRoute =
    require("./routes/premiumRoute");

const leaderboardRoute =
    require("./routes/leaderboardRoute");


// =========================
// APP
// =========================

const app = express();


// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// =========================
// EXPENSE ROUTE
// =========================

app.use(
    "/expenses",
    expenseRoute
);


// =========================
// PAYMENT ROUTE
// =========================

app.use(
    "/payment",
    paymentRoute
);


// =========================
// PREMIUM ROUTE
// =========================

app.use(
    "/premium",
    premiumRoute
);


// =========================
// LEADERBOARD ROUTE
// =========================

app.use(
    "/leaderboard",
    leaderboardRoute
);


// =========================
// TEST ROUTE
// =========================

app.get(
    "/",
    (req, res) => {

        res.json({
            message: "Expense API is running"
        });

    }
);


// =========================
// START SERVER
// =========================

async function startServer() {

    try {

        await sequelize.authenticate();

        console.log(
            "Database connected successfully"
        );


        await sequelize.sync({
            alter: true
        });

        console.log(
            "Database tables updated successfully"
        );


        app.listen(
            3001,
            () => {

                console.log(
                    "Server running on port 3001"
                );

            }
        );

    } catch (error) {

        console.log(
            "Database connection failed:"
        );

        console.log(
            error.message
        );

    }

}

startServer();