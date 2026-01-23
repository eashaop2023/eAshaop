const express = require("express");
const router = express.Router();
const UserNotification = require("../models/userNotification");
const DoctorNotification = require("../models/doctorNotification");

// ✅ Mark all notifications as read - Must be defined before parameterized routes
const markAllAsRead = async (req, res) => {
  try {
    const { type } = req.query;
    const { userId, doctorId } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Type (user/doctor) is required" });
    }

    const Model = type === "doctor" ? DoctorNotification : UserNotification;
    const id = type === "doctor" ? doctorId : userId;

    if (!id) {
      return res.status(400).json({ 
        message: `${type === "doctor" ? "doctorId" : "userId"} is required` 
      });
    }

    const result = await Model.updateMany(
      { [type === "doctor" ? "doctorId" : "userId"]: id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

router.patch("/mark-all-read", markAllAsRead);

/**
 * @route   GET /api/notifications/:role/:id
 * @desc    Get notifications for a user or doctor by ID
 * @param   role - 'user' or 'doctor'
 * @param   id - MongoDB _id of user or doctor
 */
router.get("/:role/:id", async (req, res) => {
  try {
    const { role, id } = req.params;

    let notifications;

    if (role === "user") {
      notifications = await UserNotification.find({ userId: id })
        .sort({ "message.createdAt": -1 });
    } else if (role === "doctor") {
      notifications = await DoctorNotification.find({ doctorId: id })
        .sort({ "message.createdAt": -1 });
    } else {
      return res.status(400).json({ message: "Invalid role. Use 'user' or 'doctor'." });
    }

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: "No notifications found." });
    }

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });

  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching notifications",
      error: error.message,
    });
  }
});

router.patch("/:id/read", async (req,res)=>{
  try{
    const {id} = req.params;
    const {type}=req.query;
    if (!type) return res.status(400).json({ message: "Type (user/doctor) is required" });
    const Model = type === "doctor" ? DoctorNotification : UserNotification;
    const notification = await Model.findByIdAndUpdate(id, { isRead: true }, { new: true });

    if (!notification) return res.status(404).json({ message: "Notification not found" });

    res.status(200).json({ message: "Marked as read", notification });
  } catch(err){
    console.error("Error marking notification as read:", err);
    res.status(500).json({ message: "Server error" }); 
  }
});

// ✅ 3️⃣ Get unread count (for bell icon)
router.get("/unread/:role/:id", async (req, res) => {
  try {
    const { role, id } = req.params;

    const Model = role === "doctor" ? DoctorNotification : UserNotification;
    const unread = await Model.find({
      [role === "doctor" ? "doctorId" : "userId"]: id,
      isRead: false,
    }).sort({ "message.createdAt": -1 });

    res.status(200).json({
      success: true,
      count: unread.length,
      unread,
    });
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
