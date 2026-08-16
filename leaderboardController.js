const {
    fn,
    col
} = require("sequelize");

const User = require("./User");
const Expense = require("./Expense");


// =========================
// GET LEADERBOARD
// =========================

const getLeaderboard = async (req, res) => {

    try {

        // =========================
        // LOGGED-IN USER ID
        // =========================

        const userId = req.user.id;


        // =========================
        // CHECK CURRENT USER
        // =========================

        const currentUser = await User.findByPk(
            userId,
            {
                attributes: [
                    "id",
                    "name",
                    "isPremium"
                ]
            }
        );


        if (!currentUser) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }


        // =========================
        // PREMIUM CHECK
        // =========================

        if (!currentUser.isPremium) {

            return res.status(403).json({

                success: false,

                message:
                    "Leaderboard is available only for premium users"

            });

        }


        // =========================
        // GET LEADERBOARD
        // =========================

        const leaderboard = await User.findAll({

            attributes: [

                "id",

                "name",

                "isPremium",

                [
                    fn(
                        "COALESCE",
                        fn(
                            "SUM",
                            col("Expenses.amount")
                        ),
                        0
                    ),

                    "totalExpense"
                ]

            ],


            // =========================
            // JOIN EXPENSE
            // =========================

            include: [

                {
                    model: Expense,

                    as: "Expenses",

                    attributes: [],

                    required: false
                }

            ],


            // =========================
            // GROUP
            // =========================

            group: [

                "User.id",

                "User.name",

                "User.isPremium"

            ],


            // =========================
            // ORDER
            // =========================

            order: [

                [
                    "totalExpense",
                    "DESC"
                ]

            ],


            raw: true

        });


        // =========================
        // ADD RANK
        // =========================

        const rankedLeaderboard =
            leaderboard.map(
                (user, index) => {

                    return {

                        rank: index + 1,

                        userId: user.id,

                        name: user.name,

                        isPremium:
                            Boolean(
                                user.isPremium
                            ),

                        totalExpense:
                            Number(
                                user.totalExpense
                            )

                    };

                }
            );


        // =========================
        // SUCCESS
        // =========================

        return res.status(200).json({

            success: true,

            leaderboard:
                rankedLeaderboard

        });

    } catch (error) {

        console.log(
            "Leaderboard Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch leaderboard",

            error:
                error.message

        });

    }

};


// =========================
// EXPORT
// =========================

module.exports = {
    getLeaderboard
};