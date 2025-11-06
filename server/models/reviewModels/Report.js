import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    targetType: {
        type: String,
        enum: ["review", "comment"],
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    message: String,
    status: {
        type: String,
        enum: ["pending", "reviewed", "dismissed"],
        default: "pending"
    }
}, { timestamps: true });

export default mongoose.model("Report", reportSchema);