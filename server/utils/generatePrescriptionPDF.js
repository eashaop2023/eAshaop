const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePrescriptionPDF = async (prescription) => {
  const filePath = path.join(__dirname, `../temp/prescription-${prescription._id}.pdf`);
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(18).text('Prescription', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Date: ${new Date(prescription.dateIssued).toLocaleDateString()}`);
  doc.text(`Patient Name: ${prescription.patientName}`);
  doc.text(`Hospital Name: ${prescription.hospitalName}`);
  doc.text(`Patient Age: ${prescription.patientAge}`);
  doc.moveDown();

  doc.text('Medicines:', { underline: true });
  prescription.medicines.forEach((med, idx) => {
    doc.text(`${idx + 1}. ${med.name} - ${med.dosage} - ${med.frequency} - ${med.duration} - ${med.instruction}`);
  });

  if (prescription.testsRecommended) doc.moveDown().text(`Tests: ${prescription.testsRecommended}`);
  if (prescription.advice) doc.moveDown().text(`Advice: ${prescription.advice}`);

  doc.end();
  return filePath;
};

module.exports = generatePrescriptionPDF;
