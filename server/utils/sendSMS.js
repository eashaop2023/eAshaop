const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sendPrescriptionSMS = async (phone, prescriptionId) => {
  const secureLink = `${process.env.FRONTEND_URL}/prescriptions/view/${prescriptionId}`;

  await client.messages.create({
    body: `Your prescription is ready. View/download it here: ${secureLink}`,
    from: process.env.TWILIO_PHONE,
    to: phone
  });
};

module.exports = sendPrescriptionSMS;
