const express = require("express");
const {
  sendResetPasswordLink,
  validateResetPasswordLink,
  resetPassword,
} = require("../controllers/ResetPasswordController");

const router = express.Router();

router.post("/send-link", sendResetPasswordLink);
router.get("/verify-link/:token", validateResetPasswordLink);
router.post("/change-password", resetPassword);

module.exports = router;
