const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        rating: {
            type: Number,
            require: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            require: true,
            trim: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);