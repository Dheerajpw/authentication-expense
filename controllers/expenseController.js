const Expense = require("../Expense");

// =========================
// CREATE EXPENSE
// =========================

const createExpense = async (req, res) => {
    try {

        // User ID JWT token se milegi
        const userId = req.user.id;

        const {
            amount,
            description,
            category,
            date
        } = req.body;

        const expense = await Expense.create({
            userId,
            amount,
            description,
            category,
            date
        });

        res.status(201).json({
            message: "Expense created successfully",
            expense
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to create expense",
            error: error.message
        });

    }
};


// =========================
// GET USER EXPENSES
// =========================

const getExpenses = async (req, res) => {
    try {

        const userId = req.user.id;

        const expenses = await Expense.findAll({
            where: {
                userId
            }
        });

        res.status(200).json(expenses);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch expenses",
            error: error.message
        });

    }
};


// =========================
// DELETE EXPENSE
// =========================

const deleteExpense = async (req, res) => {
    try {

        const { id } = req.params;

        const userId = req.user.id;

        const deleted = await Expense.destroy({
            where: {
                id,
                userId
            }
        });

        if (!deleted) {
            return res.status(404).json({
                message: "Expense not found or you are not authorized"
            });
        }

        res.status(200).json({
            message: "Expense deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete expense",
            error: error.message
        });

    }
};


// =========================
// UPDATE EXPENSE
// =========================

const updateExpense = async (req, res) => {
    try {

        const { id } = req.params;

        const userId = req.user.id;

        const [updated] = await Expense.update(
            req.body,
            {
                where: {
                    id,
                    userId
                }
            }
        );

        if (!updated) {
            return res.status(404).json({
                message: "Expense not found or you are not authorized"
            });
        }

        const expense = await Expense.findOne({
            where: {
                id,
                userId
            }
        });

        res.status(200).json({
            message: "Expense updated successfully",
            expense
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to update expense",
            error: error.message
        });

    }
};


module.exports = {
    createExpense,
    getExpenses,
    deleteExpense,
    updateExpense
};