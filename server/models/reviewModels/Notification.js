const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
     notification: {
        type: mongoose.Schema.ObjectId,
        require: true
     },
     message: {
        type: String,
        require: true
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
}, { timestamps: true })

module.exports = mongoose.model('Notification', notificationSchema);