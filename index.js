const express = require("express");
const cors = require("cors");

const sequelize = require("./db");
const Expense = require("./Expense");
const expenseRoute = require("./routes/expenseRoute");

const app = express();

// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(express.json());


// =========================
// EXPENSE ROUTES
// =========================

app.use("/expenses", expenseRoute);


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

        // Test database connection
        await sequelize.authenticate();

        console.log(
            "Database connected successfully"
        );


        // Update existing table structure
        // This will add userId column if required
        await sequelize.sync({
            alter: true
        });

        console.log(
            "Expense table updated successfully"
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