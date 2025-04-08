const express = require("express");
const { sendResetPasswordLink, validateResetPasswordLink } = require('../controllers/ResetPasswordController')

const router = express.Router();

router.post("/send-link", sendResetPasswordLink);
router.get("/verify-link", validateResetPasswordLink);

module.exports = router;