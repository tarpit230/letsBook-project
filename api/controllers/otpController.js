const otpGenerator = require("otp-generator");
const transporter = require("../config/mailer");
const { setOtp, getOtp } = require("../utils/otpStore");

// Generate & send OTP
const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
  setOtp(email, otp);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
};

// Verify OTP
const verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

  const storedOtp = getOtp(email);
  if (storedOtp === otp) {
    res.json({ message: "OTP verified successfully!" });
  } else {
    res.status(400).json({ message: "Invalid or expired OTP" });
  }
};

module.exports = { sendOtp, verifyOtp };
