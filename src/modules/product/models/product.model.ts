import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['shirts', 'skirts', 'socks', 'shorts', 'sweater'],
            requied: true,
        },
        variant: {
            type: String,
            enum: ['s', 'l', 'xl', 'xxl', 'xxxl'],
            requied: true,
        },
        inventory: {
            type: Number,
            default: 0,
            min: 0,
        },
        creator: {
            type: mongoose.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        is_deleted: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { timestamps: true }
);

productSchema.index({ creator: 1, name: 1 });

export default mongoose.model('product', productSchema);
