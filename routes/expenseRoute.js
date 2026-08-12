const express = require("express");

const {
    createExpense,
    getExpenses,
    deleteExpense,
    updateExpense
} = require("../controllers/expenseController");

const authenticateToken = require("../authMiddleware");

const router = express.Router();


// =========================
// CREATE EXPENSE
// =========================

router.post(
    "/",
    authenticateToken,
    createExpense
);


// =========================
// GET USER EXPENSES
// =========================

router.get(
    "/",
    authenticateToken,
    getExpenses
);


// =========================
// DELETE EXPENSE
// =========================

router.delete(
    "/:id",
    authenticateToken,
    deleteExpense
);


// =========================
// UPDATE EXPENSE
// =========================

router.put(
    "/:id",
    authenticateToken,
    updateExpense
);


module.exports = router;