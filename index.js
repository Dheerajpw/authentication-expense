require("dotenv").config();

const express = require("express");
const cors = require("cors");

const sequelize = require("./db");

const Expense = require("./Expense");
const Order = require("./Order");

const expenseRoute = require("./routes/expenseRoute");
const paymentRoute = require("./routes/paymentRoute");

const app = express();


// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// =========================
// EXPENSE ROUTES
// =========================

app.use(
    "/expenses",
    expenseRoute
);


// =========================
// PAYMENT ROUTES
// =========================

app.use(
    "/payment",
    paymentRoute
);


// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {

    res.json({
        message: "Expense API is running"
    });

});


// =========================
// START SERVER
// =========================

async function startServer() {

    try {

        // Database connection
        await sequelize.authenticate();

        console.log(
            "Database connected successfully"
        );


        // Sync database tables
        await sequelize.sync({
            alter: true
        });

        console.log(
            "Database tables updated successfully"
        );


        // Start server
        app.listen(3001, () => {

            console.log(
                "Server running on port 3001"
            );

        });

    } catch (error) {

        console.log(
            "Database connection failed:"
        );

        console.log(
            error.message
        );

    }

}


// =========================
// RUN SERVER
// =========================

startServer();