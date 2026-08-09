const express = require("express");

const {
    createExpense,
    getExpenses,
    deleteExpense,
    updateExpense
} = require("../controllers/expenseController");

const router = express.Router();


// Create Expense
router.post("/", createExpense);


// Get All Expenses
router.get("/", getExpenses);


// Delete Expense
router.delete("/:id", deleteExpense);


// Update Expense
router.put("/:id", updateExpense);


module.exports = router;