const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { 
  createPrescription, 
  getPrescriptions, 
  getPrescriptionPdf,
  getPatientPrescriptions 
} = require("../controllers/prescriptionController");

router.post("/", protect, createPrescription);          
router.get("/", protect, getPrescriptions);             
router.get("/:id/pdf", protect, getPrescriptionPdf);    

router.get("/patient", getPatientPrescriptions);        

module.exports = router;
