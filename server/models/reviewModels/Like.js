const mongoose = require('mongoose');
const likeSchema = mongoose.Schema({
    review: {
        type: mongoose.Schema.ObjectId,
        ref: 'Review',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true })

likeSchema.index({ review: 1, user: 1 }, { unique: true })

module.exports = mongoose.model('Like', likeSchema)