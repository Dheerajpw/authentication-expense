const express = require("express");

const {
    createOrder,
    verifyPayment
} = require("../controllers/paymentController");

const authenticateToken =
    require("../authMiddleware");

const router = express.Router();


// CREATE ORDER
router.post(
    "/create-order",
    authenticateToken,
    createOrder
);


// VERIFY PAYMENT
router.get(
    "/verify/:orderId",
    authenticateToken,
    verifyPayment
);


module.exports = router;