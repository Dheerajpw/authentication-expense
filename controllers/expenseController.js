const Expense = require("../Expense");

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
// FREE AI-LIKE CATEGORY FUNCTION
// =====================================================

const getAICategory = async (description) => {

    try {

        if (!description || !description.trim()) {
            return "Other";
        }

        const text = description
            .toLowerCase()
            .trim();


        // =================================================
        // FOOD
        // =================================================

        const foodKeywords = [
            "pizza",
            "burger",
            "food",
            "restaurant",
            "hotel",
            "biryani",
            "chicken",
            "mutton",
            "fish",
            "rice",
            "dal",
            "roti",
            "paratha",
            "paneer",
            "sandwich",
            "coffee",
            "tea",
            "chai",
            "breakfast",
            "lunch",
            "dinner",
            "snacks",
            "grocery",
            "groceries",
            "milk",
            "bread",
            "vegetable",
            "vegetables",
            "fruit",
            "fruits",
            "swiggy",
            "zomato",
            "dominos",
            "kfc",
            "mcdonald",
            "starbucks"
        ];


        if (
            foodKeywords.some(keyword =>
                text.includes(keyword)
            )
        ) {

            return "Food";

        }


        // =================================================
        // TRAVEL
        // =================================================

        const travelKeywords = [
            "petrol",
            "diesel",
            "fuel",
            "uber",
            "ola",
            "rapido",
            "taxi",
            "cab",
            "bus",
            "train",
            "flight",
            "airline",
            "airport",
            "metro",
            "travel",
            "trip",
            "hotel booking",
            "toll",
            "parking"
        ];


        if (
            travelKeywords.some(keyword =>
                text.includes(keyword)
            )
        ) {

            return "Travel";

        }


        // =================================================
        // SHOPPING
        // =================================================

        const shoppingKeywords = [
            "shopping",
            "amazon",
            "flipkart",
            "myntra",
            "clothes",
            "shirt",
            "tshirt",
            "jeans",
            "shoes",
            "watch",
            "mobile",
            "phone",
            "laptop",
            "computer",
            "headphone",
            "earphone",
            "electronics",
            "furniture",
            "grocery shopping",
            "purchase",
            "bought"
        ];


        if (
            shoppingKeywords.some(keyword =>
                text.includes(keyword)
            )
        ) {

            return "Shopping";

        }


        // =================================================
        // BILLS
        // =================================================

        const billKeywords = [
            "bill",
            "electricity",
            "electric",
            "water bill",
            "gas bill",
            "internet",
            "wifi",
            "broadband",
            "mobile recharge",
            "recharge",
            "phone bill",
            "rent",
            "emi",
            "loan",
            "insurance",
            "subscription"
        ];


        if (
            billKeywords.some(keyword =>
                text.includes(keyword)
            )
        ) {

            return "Bills";

        }


        // =================================================
        // ENTERTAINMENT
        // =================================================

        const entertainmentKeywords = [
            "movie",
            "cinema",
            "netflix",
            "prime video",
            "hotstar",
            "spotify",
            "game",
            "gaming",
            "concert",
            "party",
            "club",
            "entertainment",
            "youtube premium",
            "disney"
        ];


        if (
            entertainmentKeywords.some(keyword =>
                text.includes(keyword)
            )
        ) {

            return "Entertainment";

        }


        // =================================================
        // OTHER
        // =================================================

        return "Other";


    } catch (error) {

        console.error(
            "CATEGORY ERROR:",
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

        const userId = req.user.id;

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
        // FREE AI CATEGORY
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


    } catch (error) {

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


    } catch (error) {

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


    } catch (error) {

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
        // CATEGORY AGAIN
        // =================================================

        const category =
            await getAICategory(
                description
            );


        console.log(
            "UPDATED DESCRIPTION:",
            description
        );

        console.log(
            "UPDATED AI CATEGORY:",
            category
        );


        // =================================================
        // UPDATE
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


    } catch (error) {

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