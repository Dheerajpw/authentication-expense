const Expense = require("../Expense");
const User = require("../User");
const { fn, col, literal } = require("sequelize");


// =========================
// SHOW LEADERBOARD
// =========================

const showLeaderboard = async (req, res) => {

    try {

        // =========================
        // FIND ALL EXPENSES
        // GROUP BY USER ID
        // =========================

        const leaderboard = await Expense.findAll({

            attributes: [
                "userId",
                [
                    fn("SUM", col("amount")),
                    "totalExpense"
                ]
            ],

            group: ["userId"],

            order: [
                [
                    literal("totalExpense"),
                    "DESC"
                ]
            ],

            raw: true
        });


        // =========================
        // GET USER NAMES
        // =========================

        const result = [];

        for (const item of leaderboard) {

            const user = await User.findOne({

                where: {
                    id: item.userId
                },

                attributes: [
                    "id",
                    "name"
                ],

                raw: true
            });


            if (user) {

                result.push({

                    userId: user.id,

                    name: user.name,

                    totalExpense:
                        Number(item.totalExpense)

                });

            }

        }


        // =========================
        // ADD RANK
        // =========================

        const rankedResult =
            result.map((user, index) => {

                return {

                    rank: index + 1,

                    name: user.name,

                    totalExpense:
                        user.totalExpense

                };

            });


        // =========================
        // SEND RESPONSE
        // =========================

        res.status(200).json({

            message:
                "Leaderboard fetched successfully",

            leaderboard:
                rankedResult

        });

    } catch (error) {

        console.log(
            "Leaderboard error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch leaderboard",

            error:
                error.message

        });

    }

};


module.exports = {
    showLeaderboard
};