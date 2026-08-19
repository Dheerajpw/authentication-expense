const Expense = require("../Expense");
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

        // Agar Gemini API key nahi hai
        if (!process.env.GEMINI_API_KEY) {

            console.log(
                "GEMINI_API_KEY not found. Using Other."
            );

            return "Other";
        }


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


        const response =
            await ai.models.generateContent({

                model: "gemini-3.5-flash-lite",

                contents: prompt

            });


        let category =
            response.text
                ?.trim()
                .replace(/["'.]/g, "");


        console.log(
            "Gemini response:",
            category
        );


        // Exact allowed category check
        const matchedCategory =
            allowedCategories.find(
                item =>
                    item.toLowerCase() ===
                    category.toLowerCase()
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
        // GEMINI AI CATEGORY
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
        // SAVE EXPENSE
        // =================================================

        const expense =
            await Expense.create({

                userId,

                amount,

                description:
                    description.trim(),

                category,

                date

            });


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
// =====================================================

const deleteExpense = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        const userId =
            req.user.id;


        const deleted =
            await Expense.destroy({

                where: {

                    id,

                    userId

                }

            });


        if (!deleted) {

            return res.status(404).json({

                success: false,

                message:
                    "Expense not found or you are not authorized"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Expense deleted successfully"

        });


    }
    catch (error) {

        console.error(
            "DELETE EXPENSE ERROR:",
            error
        );


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
        // GEMINI AI CATEGORY
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
        // UPDATE EXPENSE
        // =================================================

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

                    }

                }

            );


        if (!updated) {

            return res.status(404).json({

                success: false,

                message:
                    "Expense not found or you are not authorized"

            });

        }


        // =================================================
        // GET UPDATED EXPENSE
        // =================================================

        const expense =
            await Expense.findOne({

                where: {

                    id,

                    userId

                }

            });


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