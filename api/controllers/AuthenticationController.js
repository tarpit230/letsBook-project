const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function loginController(req, res) {
  const { email, password } = req.body;

  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id, role: userDoc.role },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("Incorrect password");
    }
  } else {
    res.status(401).json({ message: "Invalid credentials!" });
  }
}

function logoutController(req, res) {
    res.clearCookie("token", { path: "/" });
    res.status(200).json({ message: "Logged out successfully" });
}

module.exports = {
    loginController,
    logoutController,
}
