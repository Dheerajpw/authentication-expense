const axios = require("axios");
const Order = require("../Order");
const sequelize = require("../db");

// =========================
// CREATE ORDER
// =========================

const createOrder = async (req, res) => {
    try {

        const userId = req.user.id;
        const amount = 100;

        const orderId =
            "ORDER_" + userId + "_" + Date.now();

        const response = await axios.post(
            "https://sandbox.cashfree.com/pg/orders",

            {
                order_id: orderId,
                order_amount: amount,
                order_currency: "INR",

                customer_details: {
                    customer_id: String(userId),
                    customer_phone: "9999999999"
                },

                order_meta: {
                    return_url:
                        "http://127.0.0.1:5502/expense%20tracker/index.html?order_id={order_id}"
                }
            },

            {
                headers: {
                    "x-client-id":
                        process.env.CASHFREE_APP_ID,

                    "x-client-secret":
                        process.env.CASHFREE_SECRET_KEY,

                    "x-api-version":
                        "2025-01-01",

                    "Content-Type":
                        "application/json",

                    "Accept":
                        "application/json"
                }
            }
        );

        // Save order in database
        await Order.create({
            orderId: orderId,
            userId: userId,
            amount: amount,
            status: "PENDING"
        });

        res.status(201).json({
            message: "Order created successfully",
            orderId: orderId,
            paymentSessionId:
                response.data.payment_session_id
        });

    } catch (error) {

        console.log(
            "Cashfree error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "Failed to create order",
            error:
                error.response?.data ||
                error.message
        });
    }
};


// =========================
// VERIFY PAYMENT
// =========================

const verifyPayment = async (req, res) => {

    try {

        const userId = req.user.id;
        const orderId = req.params.orderId;


        // =========================
        // FIND ORDER
        // =========================

        const order = await Order.findOne({
            where: {
                orderId: orderId,
                userId: userId
            }
        });


        if (!order) {

            return res.status(404).json({
                message: "Order not found"
            });

        }


        // =========================
        // GET PAYMENT FROM CASHFREE
        // =========================

        const response = await axios.get(
            `https://sandbox.cashfree.com/pg/orders/${orderId}/payments`,

            {
                headers: {
                    "x-client-id":
                        process.env.CASHFREE_APP_ID,

                    "x-client-secret":
                        process.env.CASHFREE_SECRET_KEY,

                    "x-api-version":
                        "2025-01-01",

                    "Accept":
                        "application/json"
                }
            }
        );


        const payments = response.data;


        console.log(
            "Cashfree payment response:",
            payments
        );


        // =========================
        // PAYMENT FOUND
        // =========================

        if (
            Array.isArray(payments) &&
            payments.length > 0
        ) {

            const payment = payments[0];

            const paymentStatus =
                payment.payment_status;


            // =========================
            // SUCCESSFUL PAYMENT
            // =========================

            if (paymentStatus === "SUCCESS") {


                // Update ORDER
                await Order.update(
                    {
                        status: "SUCCESSFUL"
                    },

                    {
                        where: {
                            orderId: orderId,
                            userId: userId
                        }
                    }
                );


                // =========================
                // MAKE USER PREMIUM
                // =========================

                await sequelize.query(
                    `
                    UPDATE users
                    SET isPremium = 1
                    WHERE id = ?
                    `,
                    {
                        replacements: [userId]
                    }
                );


                console.log(
                    "User became premium:",
                    userId
                );


                return res.status(200).json({

                    message:
                        "Transaction successful",

                    status:
                        "SUCCESSFUL",

                    orderId:
                        orderId,

                    isPremium:
                        true
                });

            }


            // =========================
            // FAILED PAYMENT
            // =========================

            if (
                paymentStatus === "FAILED" ||
                paymentStatus === "USER_DROPPED"
            ) {


                await Order.update(
                    {
                        status: "FAILED"
                    },

                    {
                        where: {
                            orderId: orderId,
                            userId: userId
                        }
                    }
                );


                return res.status(200).json({

                    message:
                        "TRANSACTION FAILED.",

                    status:
                        "FAILED",

                    orderId:
                        orderId
                });

            }

        }


        // =========================
        // PENDING
        // =========================

        return res.status(200).json({

            message:
                "Payment is still pending",

            status:
                "PENDING",

            orderId:
                orderId
        });


    } catch (error) {

        console.log(
            "Payment verification error:",
            error.response?.data ||
            error.message
        );


        res.status(500).json({

            message:
                "Failed to verify payment",

            error:
                error.response?.data ||
                error.message
        });

    }
};


// =========================
// EXPORT
// =========================

module.exports = {
    createOrder,
    verifyPayment
};