const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function loginController(req, res, next) {
  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({ email });

    if (!userDoc) {
      const error = new Error("Invalid credentials!");
      error.status = 401;
      return next(error);
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) {
      const error = new Error("Incorrect password");
      error.status = 422;
      return next(error);
    }

    jwt.sign(
      { email: userDoc.email, id: userDoc._id, role: userDoc.role },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) return next(err);

        res
          .cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
          })
          .json(userDoc);
      }
    );
  } catch (error) {
    error.status = 500;
    next(error);
  }
}

function logoutController(req, res) {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ message: "Logged out successfully" });
}

module.exports = {
  loginController,
  logoutController,
};
