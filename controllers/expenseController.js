const Expense = require("../Expense");
const sequelize = require("../db");
const { GoogleGenAI } = require("@google/genai");


// =====================================================
// GEMINI AI
// =====================================================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// =====================================================
// ALLOWED CATEGORIES
// =====================================================

const allowedCategories = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Entertainment",
    "Other"
];


// =====================================================
// AI CATEGORY FUNCTION
// =====================================================

const getAICategory = async (description) => {

    try {

        if (!description || !description.trim()) {
            return "Other";
        }


        // =================================================
        // GEMINI API KEY CHECK
        // =================================================

        if (!process.env.GEMINI_API_KEY) {

            console.log(
                "GEMINI_API_KEY not found. Using Other."
            );

            return "Other";
        }


        // =================================================
        // GEMINI PROMPT
        // =================================================

        const prompt = `
You are an expense categorization AI.

Categorize this expense into EXACTLY ONE of these categories:

Food
Travel
Shopping
Bills
Entertainment
Other

Expense description:
"${description}"

Rules:
- Return ONLY the category name.
- Do not return explanation.
- Do not return punctuation.
- Do not return JSON.
- If uncertain, return Other.
`;


        // =================================================
        // GEMINI REQUEST
        // =================================================

        const response =
            await ai.models.generateContent({

                model: "gemini-3.5-flash-lite",

                contents: prompt

            });


        // =================================================
        // GET CATEGORY
        // =================================================

        let category =
            response.text
                ?.trim()
                .replace(/["'.]/g, "");


        console.log(
            "Gemini response:",
            category
        );


        // =================================================
        // CHECK ALLOWED CATEGORY
        // =================================================

        const matchedCategory =
            allowedCategories.find(
                item =>
                    item.toLowerCase() ===
                    category?.toLowerCase()
            );


        if (matchedCategory) {

            return matchedCategory;

        }


        return "Other";

    }
    catch (error) {

        console.error(
            "GEMINI CATEGORY ERROR:",
            error.message
        );

        return "Other";

    }

};


// =====================================================
// CREATE EXPENSE
// POST /expenses
// TRANSACTION REQUIRED ✅
// =====================================================

const createExpense = async (req, res) => {

    try {

        const userId =
            req.user.id;


        const {
            amount,
            description,
            date
        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (
            amount === undefined ||
            amount === null ||
            amount === "" ||
            !description ||
            !description.trim() ||
            !date
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Amount, description and date are required."

            });

        }


        // =================================================
        // GEMINI CATEGORY
        // =================================================

        const category =
            await getAICategory(
                description
            );


        console.log(
            "================================"
        );

        console.log(
            "DESCRIPTION:",
            description
        );

        console.log(
            "AI CATEGORY:",
            category
        );

        console.log(
            "================================"
        );


        // =================================================
        // DATABASE TRANSACTION
        // =================================================

        const expense =
            await sequelize.transaction(
                async (transaction) => {

                    const newExpense =
                        await Expense.create(

                            {

                                userId,

                                amount,

                                description:
                                    description.trim(),

                                category,

                                date

                            },

                            {

                                transaction

                            }

                        );


                    return newExpense;

                }
            );


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(201).json({

            success: true,

            message:
                "Expense created successfully",

            expense

        });

    }
    catch (error) {

        console.error(
            "CREATE EXPENSE ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to create expense",

            error:
                error.message

        });

    }

};


// =====================================================
// GET EXPENSES
// GET /expenses
// TRANSACTION NOT REQUIRED ❌
// =====================================================

const getExpenses = async (req, res) => {

    try {

        const userId =
            req.user.id;


        const expenses =
            await Expense.findAll({

                where: {

                    userId

                },

                order: [

                    [

                        "date",

                        "DESC"

                    ]

                ]

            });


        return res.status(200).json(
            expenses
        );

    }
    catch (error) {

        console.error(
            "GET EXPENSE ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch expenses",

            error:
                error.message

        });

    }

};


// =====================================================
// DELETE EXPENSE
// DELETE /expenses/:id
// TRANSACTION REQUIRED ✅
// =====================================================

const deleteExpense = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        const userId =
            req.user.id;


        // =================================================
        // DATABASE TRANSACTION
        // =================================================

        const deleted =
            await sequelize.transaction(
                async (transaction) => {

                    const deletedCount =
                        await Expense.destroy({

                            where: {

                                id,

                                userId

                            },

                            transaction

                        });


                    // =====================================
                    // EXPENSE NOT FOUND
                    // =====================================

                    if (!deletedCount) {

                        const error =
                            new Error(
                                "Expense not found or you are not authorized"
                            );

                        error.statusCode = 404;

                        throw error;

                    }


                    return deletedCount;

                }
            );


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Expense deleted successfully",

            deleted

        });

    }
    catch (error) {

        console.error(
            "DELETE EXPENSE ERROR:",
            error
        );


        // ================================================
        // NOT FOUND
        // ================================================

        if (error.statusCode === 404) {

            return res.status(404).json({

                success: false,

                message:
                    error.message

            });

        }


        // ================================================
        // SERVER ERROR
        // ================================================

        return res.status(500).json({

            success: false,

            message:
                "Failed to delete expense",

            error:
                error.message

        });

    }

};


// =====================================================
// UPDATE EXPENSE
// PUT /expenses/:id
// TRANSACTION REQUIRED ✅
// =====================================================

const updateExpense = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        const userId =
            req.user.id;


        const {
            amount,
            description,
            date
        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (
            amount === undefined ||
            amount === null ||
            amount === "" ||
            !description ||
            !description.trim() ||
            !date
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Amount, description and date are required."

            });

        }


        // =================================================
        // GEMINI CATEGORY
        // =================================================

        const category =
            await getAICategory(
                description
            );


        console.log(
            "================================"
        );

        console.log(
            "UPDATED DESCRIPTION:",
            description
        );

        console.log(
            "UPDATED AI CATEGORY:",
            category
        );

        console.log(
            "================================"
        );


        // =================================================
        // DATABASE TRANSACTION
        // =================================================

        const expense =
            await sequelize.transaction(
                async (transaction) => {

                    // =====================================
                    // UPDATE
                    // =====================================

                    const [updated] =
                        await Expense.update(

                            {

                                amount,

                                description:
                                    description.trim(),

                                category,

                                date

                            },

                            {

                                where: {

                                    id,

                                    userId

                                },

                                transaction

                            }

                        );


                    // =====================================
                    // EXPENSE NOT FOUND
                    // =====================================

                    if (!updated) {

                        const error =
                            new Error(
                                "Expense not found or you are not authorized"
                            );

                        error.statusCode = 404;

                        throw error;

                    }


                    // =====================================
                    // GET UPDATED EXPENSE
                    // SAME TRANSACTION
                    // =====================================

                    const updatedExpense =
                        await Expense.findOne({

                            where: {

                                id,

                                userId

                            },

                            transaction

                        });


                    return updatedExpense;

                }
            );


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Expense updated successfully",

            expense

        });

    }
    catch (error) {

        console.error(
            "UPDATE EXPENSE ERROR:",
            error
        );


        // ================================================
        // NOT FOUND
        // ================================================

        if (error.statusCode === 404) {

            return res.status(404).json({

                success: false,

                message:
                    error.message

            });

        }


        // ================================================
        // SERVER ERROR
        // ================================================

        return res.status(500).json({

            success: false,

            message:
                "Failed to update expense",

            error:
                error.message

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    createExpense,

    getExpenses,

    deleteExpense,

    updateExpense

};