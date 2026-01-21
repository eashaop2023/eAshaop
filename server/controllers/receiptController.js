const Receipt = require("../models/Receipt");
const Appointment = require("../models/Appointment");

// Get all receipts for a user
exports.getUserReceipts = async (req, res) => {
  try {
    const { userId } = req.params;

    const receipts = await Receipt.find({ userId })
      .populate("doctorId", "name speciality email mobile hospitalName hospitalLocation profileImage")
      .populate("appointmentId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: receipts.length,
      receipts
    });
  } catch (error) {
    console.error("Get User Receipts Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all receipts for a doctor
exports.getDoctorReceipts = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const receipts = await Receipt.find({ doctorId })
      .populate("userId", "full_name email phone_number address")
      .populate("appointmentId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: receipts.length,
      receipts
    });
  } catch (error) {
    console.error("Get Doctor Receipts Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get a single receipt by ID
exports.getReceiptById = async (req, res) => {
  try {
    const { receiptId } = req.params;

    const receipt = await Receipt.findById(receiptId)
      .populate("userId", "full_name email phone_number address")
      .populate("doctorId", "name speciality email mobile hospitalName hospitalLocation profileImage")
      .populate("appointmentId");

    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    res.status(200).json({
      success: true,
      receipt
    });
  } catch (error) {
    console.error("Get Receipt By ID Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get receipt by appointment ID
exports.getReceiptByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const receipt = await Receipt.findOne({ appointmentId })
      .populate("userId", "full_name email phone_number address")
      .populate("doctorId", "name speciality email mobile hospitalName hospitalLocation profileImage")
      .populate("appointmentId");

    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found for this appointment" });
    }

    res.status(200).json({
      success: true,
      receipt
    });
  } catch (error) {
    console.error("Get Receipt By Appointment ID Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

