const fetch = require('node-fetch');
const { AppError } = require('../helpers/common');

const token = process.env.ACCESS_TOKEN;
const phoneNumberId = process.env.PHONE_NUMBER_ID;

const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
};

const sendTemplateMessage = async (to, templateName = 'hello_world') => {
  const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;

  const body = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: { code: 'en_US' },
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new AppError(errorData.error.message || 'Failed to send WhatsApp message', 500);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('WhatsApp API Error:', error);
    throw new AppError(error.message || 'Failed to send WhatsApp message', 500);
  }
};

module.exports = { sendTemplateMessage };
