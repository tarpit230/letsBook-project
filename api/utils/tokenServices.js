require("dotenv").config();
const jwt = require("jsonwebtoken");

function getUserDataFromToken(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (!token) {
      return reject(new Error("jwt is missing"));
    }
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) return reject(err);
      resolve(userData);
    });
  });
}

module.exports = {
    getUserDataFromToken,
}