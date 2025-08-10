const express = require('express');
const router = express.Router();
const { sendMail } = require('../services/mailService');

router.post('/send-mail', async (req, res) => {
  const { to, subject, message, name, email } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    await sendMail(to, subject, message, name, email);
    res.status(200).json({ success: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending mail:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
