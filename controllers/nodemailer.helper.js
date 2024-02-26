const nodemailer = require("nodemailer");
const schemeExpoGo = "exp://";
const localIp = process.env.FRONTEND_BASE_IP;

const expoGoLink = schemeExpoGo + localIp;

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
  console.log("SendPasswordResetEmail reset token is " + resetToken);
  // Construct email message
  const message = {
    from: "freeagentapplications@gmail.com",
    to: email,
    subject: "Password Reset",
    text: `Click the following link to reset your password: free_agent://app/NewPasswordScreen`,
    html: `<p>Click the following link to reset your password: <a href="http://192.168.0.14:3001/redirect-to-app.html?token=${resetToken}">Reset Password</a></p>`,
  };

  // Send email
  try {
    console.log("Password reset email sending...");
    console.log("Expo Go link is " + expoGoLink);
    await transporter.sendMail(message);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};
