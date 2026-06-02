const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    review: {
        type: mongoose.Schema.ObjectId,
        ref: "Review",
        require: true
    },
    ParentComment: {
        type: mongoose.Schema.ObjectId,
        ref: "Comment",
        default: null
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        require: true
    },
    message: {
        type: String,
        require: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    reports: [
        {
            reporter:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            reason: String,
            message: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
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

module.exports = mongoose.model('Comment', commentSchema);