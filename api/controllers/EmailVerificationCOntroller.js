const User = require("../models/User");
const transporter = require("../config/mailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const URL = process.env.CORS_ORIGIN;
const bcryptSalt = bcrypt.genSaltSync(10);

const sendEmailVerificationLink = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await User.deleteOne({ email });
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
      const userDoc = await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcryptSalt),
        isVerified: false,
      });
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const verificationLink = `${URL}/register?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification Link",
      html: `<a href="${verificationLink}">Click to verify</a>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.json({
        message:
          "If Email Exist, Email Verification link will be sent via E-mail.",
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error sending Email Verification Link", error });
    }
  } catch (e) {
    res.status(422).json(e);
  }
};

const validateEmailVerificationLink = async (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.json({
      success: false,
      message: "Email Verification token not Available.",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await User.updateOne({ email: decoded.email }, { isVerified: true });
    res.json({
      success: true,
      message: "Email verified!",
    });
  } catch (err) {
    res.status(400).send("Invalid or expired token");
  }
};

module.exports = {
  sendEmailVerificationLink,
  validateEmailVerificationLink,
};
