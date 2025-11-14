const { sendTemplateMessage } = require('../../services/whatsappService');
const { AppError, asyncHandler } = require('../../helpers/common');

const sendWhatsAppMessage = asyncHandler(async (req, res) => {
  const { to, templateName } = req.body;

  if (!to) {
    throw new AppError('Recipient phone number required', 400);
  }

  try {
    const response = await sendTemplateMessage(to, templateName);
    return res.status(200).json({
      success: true,
      message: 'WhatsApp message sent successfully',
      data: response,
    });
  } catch (error) {
    throw new AppError(error.message, 500);
  }
});

module.exports = { sendWhatsAppMessage };
