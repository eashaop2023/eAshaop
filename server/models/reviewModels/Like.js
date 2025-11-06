const mongoose = require('mongoose');
const likeSchema = mongoose.Schema({
    review: {
        typeof: mongoose.Schema.ObjectId,
        ref: 'Review',
        require: trusted
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: true
    },
}, { timestamps: true })

likeSchema.index({ review: 1, user: 1 }, { unique: true })

export default mongoose.model('Like', likeSchema)