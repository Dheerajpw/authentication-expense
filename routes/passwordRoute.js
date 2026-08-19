const express = require("express");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const User = require("../User");
const ForgotPasswordRequest = require("../ForgotPasswordRequest");
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


            if (!email || !email.trim()) {

                return res.status(400).json({

                    success: false,

                    message: "Email is required."

                });

            }


            const userEmail =
                email.trim().toLowerCase();


            const user =
                await User.findOne({

                    where: {
                        email: userEmail
                    }

                });


            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User with this email does not exist."

                });

            }


            // =================================================
            // GENERATE UUID
            // =================================================

            const requestId =
                uuidv4();


            // =================================================
            // CREATE REQUEST
            // =================================================

            await ForgotPasswordRequest.create({

                id: requestId,

                userId: user.id,

                isActive: true

            });


            console.log(
                "Forgot password request created:",
                requestId
            );


            // =================================================
            // RESET LINK
            // =================================================

            const resetLink =
                `http://localhost:3001/password/resetpassword/${requestId}`;


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
                            Click the button below to reset
                            your password.
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
// OPEN RESET PASSWORD LINK
// GET /password/resetpassword/:requestId
// =====================================================

router.get(
    "/resetpassword/:requestId",
    async (req, res) => {

        try {

            const { requestId } =
                req.params;


            // =================================================
            // FIND REQUEST
            // =================================================

            const request =
                await ForgotPasswordRequest.findOne({

                    where: {
                        id: requestId
                    }

                });


            // =================================================
            // REQUEST NOT FOUND
            // =================================================

            if (!request) {

                return res.status(404).send(
                    "Invalid password reset request."
                );

            }


            // =================================================
            // CHECK ACTIVE
            // =================================================

            if (!request.isActive) {

                return res.status(400).send(
                    "This password reset link has already been used."
                );

            }


            // =================================================
            // RESET PASSWORD FORM
            // =================================================

            return res.status(200).send(`

                <!DOCTYPE html>

                <html>

                <head>

                    <meta charset="UTF-8">

                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    >

                    <title>
                        Reset Password
                    </title>

                    <style>

                        body {

                            font-family: Arial, sans-serif;

                            background: #f4f4f4;

                            display: flex;

                            justify-content: center;

                            align-items: center;

                            min-height: 100vh;

                            margin: 0;

                        }

                        .container {

                            background: white;

                            padding: 30px;

                            width: 350px;

                            border-radius: 10px;

                            box-shadow:
                                0 4px 15px
                                rgba(0,0,0,0.15);

                        }

                        h2 {

                            text-align: center;

                            margin-bottom: 25px;

                        }

                        label {

                            display: block;

                            margin-bottom: 7px;

                        }

                        input {

                            width: 100%;

                            padding: 10px;

                            margin-bottom: 15px;

                            box-sizing: border-box;

                            border: 1px solid #ccc;

                            border-radius: 5px;

                        }

                        button {

                            width: 100%;

                            padding: 11px;

                            border: none;

                            border-radius: 5px;

                            background: #007bff;

                            color: white;

                            font-size: 16px;

                            cursor: pointer;

                        }

                        button:hover {

                            background: #0056b3;

                        }

                        #message {

                            text-align: center;

                            margin-top: 15px;

                        }

                    </style>

                </head>


                <body>

                    <div class="container">

                        <h2>
                            Reset Password
                        </h2>


                        <form
                            id="resetPasswordForm"
                        >

                            <label>
                                New Password
                            </label>

                            <input
                                type="password"
                                id="password"
                                required
                                minlength="6"
                            >


                            <label>
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                id="confirmPassword"
                                required
                                minlength="6"
                            >


                            <button
                                type="submit"
                            >
                                Update Password
                            </button>

                        </form>


                        <div id="message"></div>

                    </div>


                    <script>

                        const form =
                            document.getElementById(
                                "resetPasswordForm"
                            );


                        const message =
                            document.getElementById(
                                "message"
                            );


                        form.addEventListener(
                            "submit",
                            async function(event) {

                                event.preventDefault();


                                const password =
                                    document.getElementById(
                                        "password"
                                    ).value;


                                const confirmPassword =
                                    document.getElementById(
                                        "confirmPassword"
                                    ).value;


                                if (
                                    password !==
                                    confirmPassword
                                ) {

                                    message.innerText =
                                        "Passwords do not match.";

                                    return;

                                }


                                try {

                                    const response =
                                        await fetch(
                                            "/password/resetpassword",
                                            {

                                                method: "PUT",

                                                headers: {

                                                    "Content-Type":
                                                        "application/json"

                                                },

                                                body:
                                                    JSON.stringify({

                                                        requestId:
                                                            "${requestId}",

                                                        password:
                                                            password

                                                    })

                                            }
                                        );


                                    const data =
                                        await response.json();


                                    message.innerText =
                                        data.message;


                                    if (data.success) {

                                        form.style.display =
                                            "none";

                                    }

                                }
                                catch (error) {

                                    message.innerText =
                                        "Something went wrong.";

                                }

                            }
                        );

                    </script>

                </body>

                </html>

            `);

        }
        catch (error) {

            console.error(
                "RESET LINK ERROR:",
                error
            );


            return res.status(500).send(
                "Something went wrong."
            );

        }

    }
);


// =====================================================
// UPDATE PASSWORD
// PUT /password/resetpassword
// =====================================================

router.put(
    "/resetpassword",
    async (req, res) => {

        try {

            const {
                requestId,
                password
            } = req.body;


            // =================================================
            // VALIDATION
            // =================================================

            if (!requestId || !password) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Request ID and password are required."

                });

            }


            // =================================================
            // FIND REQUEST
            // =================================================

            const request =
                await ForgotPasswordRequest.findOne({

                    where: {
                        id: requestId
                    }

                });


            // =================================================
            // REQUEST NOT FOUND
            // =================================================

            if (!request) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Invalid password reset request."

                });

            }


            // =================================================
            // CHECK ACTIVE
            // =================================================

            if (!request.isActive) {

                return res.status(400).json({

                    success: false,

                    message:
                        "This password reset link has already been used."

                });

            }


            // =================================================
            // FIND USER
            // =================================================

            const user =
                await User.findOne({

                    where: {
                        id: request.userId
                    }

                });


            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found."

                });

            }


            // =================================================
            // HASH PASSWORD
            // =================================================

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            // =================================================
            // UPDATE PASSWORD
            // =================================================

            user.password =
                hashedPassword;

            await user.save();


            // =================================================
            // MAKE REQUEST INACTIVE
            // =================================================

            request.isActive =
                false;

            await request.save();


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