const express = require("express");

const {
    showLeaderboard
} = require("../controllers/premiumController");

const authenticateToken =
    require("../authMiddleware");

const router = express.Router();


// =========================
// SHOW LEADERBOARD
// =========================

router.get(
    "/showleaderboard",
    authenticateToken,
    showLeaderboard
);


module.exports = router;