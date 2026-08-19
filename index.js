
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
const morgan = require("morgan");

const sequelize = require("./db");

// LOGGER
const { writeLog } = require("./logger");

const User = require("./User");
const Expense = require("./Expense");

require("./Order");


// =====================================================
// CREATE INITIAL LOG
// =====================================================

writeLog("======================================");
writeLog("Application starting...");
writeLog("======================================");


// =====================================================
// ASSOCIATIONS
// =====================================================

User.hasMany(Expense, {
    foreignKey: "userId",
    as: "Expenses"
});

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


// =====================================================
// MORGAN LOGGER
// =====================================================

app.use(
    morgan("combined", {

        stream: {

            write: (message) => {

                writeLog(
                    `MORGAN: ${message.trim()}`
                );

            }

        }

    })
);


app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// =====================================================
// ROUTES
// =====================================================

app.use(
    "/expenses",
    expenseRoute
);

app.use(
    "/payment",
    paymentRoute
);

app.use(
    "/premium",
    premiumRoute
);

app.use(
    "/leaderboard",
    leaderboardRoute
);

app.use(
    "/password",
    passwordRoute
);


// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {

    writeLog(
        "GET / - Expense API accessed"
    );

    return res.status(200).json({

        success: true,

        message:
            "Expense API is running"

    });

});


// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {

    writeLog(
        `404 - Route not found: ${req.method} ${req.originalUrl}`
    );

    return res.status(404).json({

        success: false,

        message:
            "Route not found"

    });

});


// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
    (error, req, res, next) => {

        console.error(
            "Global Error:",
            error
        );

        writeLog(
            `GLOBAL ERROR: ${error.stack || error.message}`
        );

        return res.status(500).json({

            success: false,

            message:
                "Internal server error"

        });

    }
);


// =====================================================
// START SERVER
// =====================================================

async function startServer() {

    try {

        // ---------------------------------------------
        // DATABASE CONNECTION
        // ---------------------------------------------

        await sequelize.authenticate();

        console.log(
            "Database connected successfully ✅"
        );

        writeLog(
            "Database connected successfully"
        );


        // ---------------------------------------------
        // DATABASE SYNC
        // ---------------------------------------------

        await sequelize.sync({
            alter: true
        });

        console.log(
            "Database tables updated successfully ✅"
        );

        writeLog(
            "Database tables updated successfully"
        );


        // ---------------------------------------------
        // PORT
        // ---------------------------------------------

        const PORT =
            process.env.PORT || 3001;


        // ---------------------------------------------
        // START EXPRESS SERVER
        // ---------------------------------------------

        app.listen(
            PORT,
            () => {

                console.log(
                    "======================================"
                );

                console.log(
                    `Server running on port ${PORT} 🚀`
                );

                console.log(
                    `http://localhost:${PORT}`
                );

                console.log(
                    "======================================"
                );

                writeLog(
                    `Server started successfully on port ${PORT}`
                );

            }
        );

    }

    catch (error) {

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


        writeLog(
            `SERVER START ERROR: ${error.stack || error.message}`
        );

    }

}


// =====================================================
// RUN SERVER
// =====================================================

startServer();
