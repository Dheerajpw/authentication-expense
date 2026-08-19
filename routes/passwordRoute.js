const express = require("express");
const crypto = require("crypto");
const User = require("../User");
const { BrevoClient } = require("@getbrevo/brevo");

const router = express.Router();


// =====================================================
// BREVO SETUP
// =====================================================

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
});


// =====================================================
// FORGOT PASSWORD
// POST /password/forgotpassword
// =====================================================

router.post(
    "/forgotpassword",
    async (req, res) => {

        try {

            const { email } = req.body;


            // =================================================
            // VALIDATION
            // =================================================

            if (!email || !email.trim()) {

                return res.status(400).json({

                    success: false,

                    message: "Email is required."

                });

            }


            const userEmail =
                email.trim().toLowerCase();


            // =================================================
            // FIND USER
            // =================================================

            const user =
                await User.findOne({

                    where: {
                        email: userEmail
                    }

                });


            // =================================================
            // USER NOT FOUND
            // =================================================

            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User with this email does not exist."

                });

            }


            // =================================================
            // GENERATE RESET TOKEN
            // =================================================

            const resetToken =
                crypto.randomBytes(32).toString("hex");


            // Token valid for 15 minutes
            const resetTokenExpiry =
                new Date(
                    Date.now() + 15 * 60 * 1000
                );


            // =================================================
            // SAVE TOKEN
            // =================================================

            user.resetToken =
                resetToken;

            user.resetTokenExpiry =
                resetTokenExpiry;

            await user.save();


            console.log(
                "Password reset token generated for:",
                user.email
            );


            // =================================================
            // RESET PASSWORD LINK
            // =================================================

            const resetLink =
                `http://127.0.0.1:5502/reset-password.html?token=${resetToken}`;


            // =================================================
            // SEND EMAIL
            // =================================================

            const result =
                await brevo.transactionalEmails.sendTransacEmail({

                    subject:
                        "Expense Tracker - Reset Password",

                    htmlContent: `

                        <h2>Password Reset Request</h2>

                        <p>Hello ${user.name},</p>

                        <p>
                            We received a request to reset
                            your Expense Tracker password.
                        </p>

                        <p>
                            This link will expire in
                            <strong>15 minutes</strong>.
                        </p>

                        <p>
                            <a
                                href="${resetLink}"
                                style="
                                    display:inline-block;
                                    padding:12px 20px;
                                    background:#007bff;
                                    color:white;
                                    text-decoration:none;
                                    border-radius:5px;
                                "
                            >
                                Reset Password
                            </a>
                        </p>

                        <p>
                            If you did not request this,
                            you can safely ignore this email.
                        </p>

                        <p>
                            Regards,<br>
                            Expense Tracker Team
                        </p>

                    `,

                    sender: {

                        name: "Expense Tracker",

                        email:
                            process.env.BREVO_SENDER_EMAIL

                    },

                    to: [

                        {
                            email: user.email
                        }

                    ]

                });


            console.log(
                "Brevo email sent successfully:",
                result
            );


            // =================================================
            // SUCCESS
            // =================================================

            return res.status(200).json({

                success: true,

                message:
                    "Password reset email sent successfully."

            });

        }
        catch (error) {

            console.error(
                "FORGOT PASSWORD ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to send password reset email."

            });

        }

    }
);
// =====================================================
// RESET PASSWORD
// PUT /password/resetpassword
// =====================================================

router.put(
    "/resetpassword",
    async (req, res) => {

        try {

            const { token, password } = req.body;


            // =================================================
            // VALIDATION
            // =================================================

            if (!token || !password) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Token and password are required."

                });

            }


            // =================================================
            // FIND USER USING TOKEN
            // =================================================

            const user =
                await User.findOne({

                    where: {
                        resetToken: token
                    }

                });


            // =================================================
            // INVALID TOKEN
            // =================================================

            if (!user) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid or expired reset token."

                });

            }


            // =================================================
            // CHECK TOKEN EXPIRY
            // =================================================

            if (
                !user.resetTokenExpiry ||
                new Date() >
                new Date(user.resetTokenExpiry)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Reset token has expired."

                });

            }


            // =================================================
            // UPDATE PASSWORD
            // =================================================

            user.password =
                password;


            // =================================================
            // CLEAR RESET TOKEN
            // =================================================

            user.resetToken =
                null;

            user.resetTokenExpiry =
                null;


            await user.save();


            console.log(
                "Password reset successfully for:",
                user.email
            );


            // =================================================
            // SUCCESS
            // =================================================

            return res.status(200).json({

                success: true,

                message:
                    "Password reset successfully."

            });

        }
        catch (error) {

            console.error(
                "RESET PASSWORD ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to reset password."

            });

        }

    }
);

module.exports = router;