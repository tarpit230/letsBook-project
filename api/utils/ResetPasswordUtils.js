const PasswordResetToken = require('../models/ResetPassword');

async function createPasswordResetToken(userId) {
    await PasswordResetToken.deleteOne({ userId });
    const tokenDoc = new PasswordResetToken({ userId });
    tokenDoc.save();
    return tokenDoc.token;
}

async function verifyResetToken(token) {
    const tokenDoc = await PasswordResetToken.findOne({ token });
    if(!tokenDoc) return { valid: false, reason: 'Token not found or expired' };
    return { valid: true, userId: tokenDoc.userId };
}

module.exports = {
    createPasswordResetToken,
    verifyResetToken,
}