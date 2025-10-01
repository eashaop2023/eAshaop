const Prescription = require("../models/Prescription");
const Patient = require("../models/patientModel");
const Doctor = require("../models/doctorModel");
const PDFDocument = require("pdfkit");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const path = require("path");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createPrescription = async (req, res) => {
  try {
    const { patient, patientName, patientAge, gender, hospitalName, medicines, testsRecommended, advice } = req.body;
    const doctorId = req.doctor._id;

    if (!patient || !patientName || !patientAge || !medicines?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let prescription = await Prescription.create({
      patient,
      doctor: doctorId,
      patientName,
      patientAge,
      gender,
      hospitalName,
      medicines,
      testsRecommended,
      advice,
    });

    prescription = await prescription.populate("doctor", "name");

    const doc = new PDFDocument({ margin: 50 });
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(buffers);

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "prescriptions",
            resource_type: "image",
            access_mode: "public",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(pdfBuffer).pipe(stream);
      });

      prescription.pdfUrl = result.secure_url;
      await prescription.save();

      res.status(201).json({
        message: "Prescription created successfully",
        prescription,
      });
    });

    doc.pipe(res);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    doc.strokeColor("#00A99D").lineWidth(2).rect(20, 20, pageWidth - 40, pageHeight - 40).stroke();

    const logoWidth = 100;
    const logoHeight = 100;
    const logoPath = path.join(__dirname, "../public/images/logo.png");
    try {
      doc.image(logoPath, (pageWidth - logoWidth) / 2, 30, { width: logoWidth, height: logoHeight });
    } catch (err) {
      console.log("Logo not found, skipping.");
    }

    doc.moveDown(7);
    doc.fontSize(20).text("Easha 24*7 Healthcare Pvt Ltd", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(12).text(`Date Issued: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    doc.fontSize(18).text("Prescription", { align: "center" }).moveDown();

    doc.fontSize(12).text(`Doctor ID: ${prescription.doctor._id}`);
    doc.fontSize(12).text(`Doctor Name: ${prescription.doctor.name}`);
    doc.text(`Patient: ${patientName} (Age: ${patientAge}, Gender: ${gender || "N/A"})`);
    if (hospitalName) doc.text(`Hospital: ${hospitalName}`);
    doc.moveDown();

    doc.fontSize(14).text("Medicines:");
    medicines.forEach((m, i) => {
      doc.fontSize(12).text(
        `${i + 1}. ${m.name} - ${m.dosage}, ${m.frequency}, ${m.duration}${m.instruction ? ` (${m.instruction})` : ""}`
      );
    });
    doc.moveDown();

    if (testsRecommended?.length) {
      doc.fontSize(14).text("Tests Recommended:");
      testsRecommended.forEach((t, i) => doc.fontSize(12).text(`${i + 1}. ${t}`));
      doc.moveDown();
    }

    if (advice) {
      doc.fontSize(14).text("Doctor's Advice:");
      doc.fontSize(12).text(advice);
      doc.moveDown();
    }

    doc.moveDown(2);
    doc.fontSize(12).text("Digital Signature:");
    doc.fontSize(14).text(`Dr. ${prescription.doctor.name}`, { oblique: true });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


const getPrescriptions = async (req, res) => {
  try {
    const doctorId = req.doctor._id;

    const prescriptions = await Prescription.find({ doctor: doctorId })
      .populate("patient", "name age email") 
      .populate("doctor", "name"); 
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPatientPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.query;
    if (!patientId) return res.status(400).json({ message: "patientId is required" });

    const prescriptions = await Prescription.find({ patient: patientId })
      .populate("patient", "name age gender")
      .populate("doctor", "name"); 
    res.status(200).json({
      message: "Patient prescriptions fetched successfully",
      prescriptions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getPrescriptionPdf = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("patient", "name age gender")
      .populate("doctor", "name");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=prescription_${prescription._id}.pdf`
    );

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    doc.strokeColor("#00A99D")
      .lineWidth(2)
      .rect(20, 20, pageWidth - 40, pageHeight - 40)
      .stroke();

    doc.fontSize(20).text("Easha24*7 Healthcare Pvt Ltd", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(12).text(`Date Issued: ${new Date(prescription.createdAt).toLocaleDateString()}`, { align: "right" });
    doc.moveDown();

    doc.fontSize(12).text(`Doctor ID: ${prescription.doctor._id}`);
    doc.fontSize(12).text(`Doctor Name: ${prescription.doctor.name}`);
    doc.moveDown();

    doc.fontSize(12).text(`Patient: ${prescription.patient.name} (Age: ${prescription.patient.age}, Gender: ${prescription.patient.gender || "N/A"})`);
    if (prescription.hospitalName) doc.text(`Hospital: ${prescription.hospitalName}`);
    doc.moveDown();

    if (prescription.medicines?.length > 0) {
      doc.fontSize(14).text("Medicines:");
      prescription.medicines.forEach((med, idx) => {
        doc.fontSize(12).text(
          `${idx + 1}. ${med.name} - ${med.dosage}, ${med.frequency}, ${med.duration}${med.instruction ? ` (${med.instruction})` : ""}`
        );
      });
      doc.moveDown();
    }

    if (prescription.testsRecommended?.length > 0) {
      doc.fontSize(14).text("Tests Recommended:");
      prescription.testsRecommended.forEach((test, idx) => {
        doc.fontSize(12).text(`${idx + 1}. ${test}`);
      });
      doc.moveDown();
    }

    if (prescription.advice) {
      doc.fontSize(14).text("Doctor's Advice:");
      doc.fontSize(12).text(prescription.advice);
      doc.moveDown();
    }

    if (prescription.pdfUrl) {
      doc.moveDown();
      doc.fontSize(12).text(`PDF URL: ${prescription.pdfUrl}`);
    }

    doc.moveDown(2);
    doc.fontSize(12).text(`Digital Signature: Dr. ${prescription.doctor.name}`, { align: "right" });

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Error generating PDF", error: error.message });
  }
};

module.exports = { createPrescription, getPrescriptions, getPatientPrescriptions, getPrescriptionPdf };
