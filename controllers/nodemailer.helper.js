const nodemailer = require("nodemailer");

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Set to true if using SSL/TLS
  auth: {
    user: "freeagentapplications@gmail.com",
    pass: "eqyz cwha dwia pcdl",
  },
});

// Function to send password reset email
exports.sendPasswordResetEmail = async (email, resetToken) => {
  // Construct email message
  const message = {
    from: "freeagentapplications@gmail.com",
    to: email,
    subject: "Password Reset",
    text: `Click the following link to reset your password: free_agent://reset?token=${resetToken}`,
    html: `<p>Click the following link to reset your password: <a href="free_Agent://reset?token=${resetToken}">Reset Password</a></p>`,
  };

  // Send email
  try {
    console.log("Password reset email sending...");

    await transporter.sendMail(message);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};
