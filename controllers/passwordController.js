const User = require("../User");
const brevo = require("@getbrevo/brevo");


// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (!email || !email.trim()) {

            return res.status(400).json({

                success: false,

                message: "Email is required"

            });

        }


        const userEmail =
            email.trim().toLowerCase();


        // =================================================
        // CHECK USER
        // =================================================

        const user =
            await User.findOne({

                where: {
                    email: userEmail
                }

            });


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }


        // =================================================
        // BREVO CONFIGURATION
        // =================================================

        const apiInstance =
            new brevo.TransactionalEmailsApi();


        apiInstance.setApiKey(
            brevo.TransactionalEmailsApiApiKeys.apiKey,
            process.env.BREVO_API_KEY
        );


        // =================================================
        // EMAIL
        // =================================================

        const sendSmtpEmail =
            new brevo.SendSmtpEmail();


        sendSmtpEmail.subject =
            "Expense Tracker - Forgot Password";


        sendSmtpEmail.htmlContent = `
            
            <h2>Expense Tracker</h2>

            <p>Hello ${user.name},</p>

            <p>
                We received a request to reset your password.
            </p>

            <p>
                This is a dummy password reset email
                for your Expense Tracker application.
            </p>

            <p>
                You can implement the actual password
                reset link in the next step.
            </p>

            <br>

            <p>
                Thanks,<br>
                Expense Tracker Team
            </p>

        `;


        sendSmtpEmail.sender = {

            name: "Expense Tracker",

            email:
                process.env.BREVO_SENDER_EMAIL

        };


        sendSmtpEmail.to = [

            {
                email: userEmail,

                name: user.name

            }

        ];


        // =================================================
        // SEND EMAIL
        // =================================================

        const result =
            await apiInstance.sendTransacEmail(
                sendSmtpEmail
            );


        console.log(
            "BREVO EMAIL SENT:",
            result
        );


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Password reset email sent successfully"

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
                "Failed to send password reset email",

            error:
                error.message

        });

    }

};


module.exports = {

    forgotPassword

};