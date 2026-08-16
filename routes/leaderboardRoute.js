const express = require("express");

const {
    getLeaderboard
} = require("../leaderboardController");

const authenticateToken =
    require("../authMiddleware");

const router = express.Router();


// =========================
// GET LEADERBOARD
// =========================

router.get(
    "/",
    authenticateToken,
    getLeaderboard
);


// =========================
// EXPORT
// =========================

module.exports = router;