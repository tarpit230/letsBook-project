const express = require("express");
const {
  sendResetPasswordLink,
  validateResetPasswordLink,
  resetPassword,
} = require("../controllers/ResetPasswordController");
const { 
  sendEmailVerificationLink, 
  validateEmailVerificationLink, 
} = require("../controllers/EmailVerificationCOntroller");

const router = express.Router();

router.post("/register", sendEmailVerificationLink);
router.post("/register/verify-token", validateEmailVerificationLink);
router.post("/send-link", sendResetPasswordLink);
router.get("/verify-link/:token", validateResetPasswordLink);
router.post("/change-password", resetPassword);

module.exports = router;
