const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ResetPasswordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true,
    },
    token: {
        type: String,
        required: true,
        default: uuidv4,
        unique: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 15 * 60 * 1000),
    }
});

// auto delete expired token
ResetPasswordSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordResetToken  = mongoose.model('PasswordResetToken ', ResetPasswordSchema);

module.exports = PasswordResetToken;