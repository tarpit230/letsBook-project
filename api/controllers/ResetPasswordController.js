const User = require('../models/User')
const { createPasswordResetToken, verifyResetToken } = require('../utils/ResetPasswordUtils');
const transporter = require("../config/mailer");
require('dotenv').config();

const URL = process.env.CORS_ORIGIN;

const sendResetPasswordLink = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.json({ message: 'If Email Exist, Reset password link will be sent via E-mail.'})
    
    const token = await createPasswordResetToken(user._id);
    const resetLink = `${URL}/reset-password/${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Password Link",
        text: `Click on the given link to reset your password ${resetLink}. It will expire in 15 minutes.`,
      };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "If Email Exist, Reset password link will be sent via E-mail." });
      } catch (error) {
        res.status(500).json({ message: "Error sending Reset password Link", error });
      }  
}

const validateResetPasswordLink = async (req, res) => {
  const token = req.params.token;
  console.log("token", token)
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Reset Link Expired or not valid'
    });
  }

  const response = verifyResetToken(token);
  if(response.valid) res.status(200).json({ 
    success: true,
    message: 'Token is valid',
    userId: (await response).userId,
  })
}

module.exports = {
  sendResetPasswordLink,
  validateResetPasswordLink,
}