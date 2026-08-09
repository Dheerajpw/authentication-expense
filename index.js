const express = require("express");
const cors = require("cors");

const sequelize = require("./db");
const Expense = require("./Expense");
const expenseRoute = require("./routes/expenseRoute");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Expense Routes
app.use("/expenses", expenseRoute);


// Test Route
app.get("/", (req, res) => {
    res.json({
        message: "Expense API is running"
    });
});


// Start Server
async function startServer() {
    try {

        await sequelize.authenticate();

        console.log("Database connected successfully");

        await sequelize.sync();

        console.log("Expense table created successfully");

        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });

    } catch (error) {

        console.log("Database connection failed:");
        console.log(error.message);

    }
}

startServer();