const User = require('../models/User')
const { createPasswordResetToken, verifyResetToken } = require('../utils/ResetPasswordUtils');
const transporter = require("../config/mailer");

const sendResetPasswordLink = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.json({ message: 'If Email Exist, Reset password link will be sent via E-mail.'})
    
    const token = await createPasswordResetToken(user._id);
    const resetLink = `http://localhost:3001/reset-password/${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Password Link",
        text: `Click on the given link to reset your password ${resetLink}. It will expire in 15 minutes.`,
      };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Reset Password Link sent successfully!" });
      } catch (error) {
        res.status(500).json({ message: "Error sending Reset password Link", error });
      }  
}