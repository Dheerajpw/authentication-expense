const { QueryTypes } = require("sequelize");

const sequelize = require("./db");


// =========================
// GET LEADERBOARD
// =========================

const getLeaderboard = async (req, res) => {

    try {

        // Logged-in user ID
        const userId = req.user.id;


        // =========================
        // CHECK PREMIUM STATUS
        // =========================

        const users = await sequelize.query(
            `
            SELECT
                id,
                name,
                isPremium
            FROM users
            WHERE id = ?
            `,
            {
                replacements: [userId],
                type: QueryTypes.SELECT
            }
        );


        if (users.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


        const user = users[0];


        // =========================
        // PREMIUM CHECK
        // =========================

        if (Number(user.isPremium) !== 1) {

            return res.status(403).json({
                success: false,
                message: "Leaderboard is available only for premium users"
            });

        }


        // =========================
        // GET LEADERBOARD
        // =========================

        const leaderboard = await sequelize.query(
            `
            SELECT
                u.id,
                u.name,
                u.isPremium,
                COALESCE(SUM(e.amount), 0) AS totalExpense
            FROM users u
            LEFT JOIN Expenses e
                ON u.id = e.userId
            GROUP BY
                u.id,
                u.name,
                u.isPremium
            ORDER BY
                totalExpense DESC
            `,
            {
                type: QueryTypes.SELECT
            }
        );


        // =========================
        // SUCCESS RESPONSE
        // =========================

        res.status(200).json({
            success: true,
            leaderboard: leaderboard
        });


    } catch (error) {

        console.log(
            "Leaderboard Error:",
            error.message
        );


        res.status(500).json({
            success: false,
            message: "Failed to fetch leaderboard"
        });

    }

};


// =========================
// EXPORT
// =========================

module.exports = {
    getLeaderboard
};