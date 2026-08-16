const Expense = require("../Expense");
const User = require("../User");
const { fn, col, literal } = require("sequelize");


// =========================
// SHOW LEADERBOARD
// =========================

const showLeaderboard = async (req, res) => {

    try {

        // Check logged-in user
        const currentUser = await User.findByPk(req.user.id);

        if (!currentUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Premium check
        if (!currentUser.isPremium) {

            return res.status(403).json({
                message: "Premium membership required to view leaderboard"
            });

        }


        // =========================
        // GET LEADERBOARD
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
        // GET USER DETAILS
        // =========================

        const result = [];

        for (const item of leaderboard) {

            const user = await User.findOne({

                where: {
                    id: item.userId
                },

                attributes: [
                    "id",
                    "name",
                    "isPremium"
                ],

                raw: true

            });


            if (user) {

                result.push({

                    userId: user.id,

                    name: user.name,

                    isPremium: user.isPremium,

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

                    isPremium: user.isPremium,

                    totalExpense:
                        user.totalExpense

                };

            });


        // =========================
        // RESPONSE
        // =========================

        return res.status(200).json({

            success: true,

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

        return res.status(500).json({

            success: false,

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