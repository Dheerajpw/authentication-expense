const Expense = require("../Expense");

// =========================
// CREATE EXPENSE
// =========================

const createExpense = async (req, res) => {
    try {
        const expense = await Expense.create(req.body);

        res.status(201).json({
            message: "Expense created successfully",
            expense
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create expense",
            error: error.message
        });
    }
};


// =========================
// GET ALL EXPENSES
// =========================

const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll();

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

        const deleted = await Expense.destroy({
            where: { id }
        });

        if (!deleted) {
            return res.status(404).json({
                message: "Expense not found"
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

        const [updated] = await Expense.update(
            req.body,
            {
                where: { id }
            }
        );

        if (!updated) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        const expense = await Expense.findByPk(id);

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