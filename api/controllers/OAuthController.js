require("dotenv").config;
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken");

const googleTokenVerification = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { email, name } = payload;
    const user = await User.findOne({ email });

    if(!user) {
      user = await User.create({ name, email, password: "google_oauth", isVerified: false })
    }

    const jwtToken = jwt.sign(
      { email: user.email, name: user.name, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only send over HTTPS in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // needed for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      path: "/",
    });
    return res.status(200).json({
      loggedIn: true,
      name: payload.name,
      email: payload.email,
    });
  } catch (err) {
    return res.status(400).json({
      message: "No User Found",
      loggedIn: false,
      error: err,
    });
  }
};

module.exports = {
  googleTokenVerification,
};
