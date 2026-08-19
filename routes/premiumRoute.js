const express = require("express");

const {
    showLeaderboard,
    getPremiumStatus
} = require("../controllers/premiumController");

const authenticateToken =
    require("../authMiddleware");

const router = express.Router();


// =====================================================
// PREMIUM STATUS
// GET /premium/status
// =====================================================

router.get(
    "/status",
    authenticateToken,
    getPremiumStatus
);


// =====================================================
// LEADERBOARD
// GET /premium/showleaderboard
// =====================================================

router.get(
    "/showleaderboard",
    authenticateToken,
    showLeaderboard
);


module.exports = router;