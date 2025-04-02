import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        status: {
            type: String,
            required: true,
            enum: ['verified', 'unverified', 'suspended'],
            default: 'unverified',
        },
        verification_code: {
            type: String,
        },
        verification_exp: {
            type: Date,
        },
        password_reset_token: {
            type: String,
        },
        password_reset_otp: {
            type: String,
        },
        password_reset_exp: {
            type: Date,
        },
        is_deleted: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { timestamps: true }
);

userSchema.index({ email: 1 });

export default mongoose.model('user', userSchema);
