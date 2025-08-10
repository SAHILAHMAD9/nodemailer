const express = require('express');
const router = express.Router();
const { sendMail } = require('../services/mailService'); // your nodemailer code file
const config = require('../config/mailConfig.json');

// POST /contact
router.post('/send-mail', async (req, res) => {
    const { subject, message, name, email } = req.body;
    const missingFields = ['name', 'email', 'subject'].filter((f) => {
      const v = (req.body || {})[f];
      if (v === undefined || v === null) return true;
      if (typeof v === 'string' && v.trim() === '') return true;
      return false;
    });
    if (missingFields.length > 0) {
      return res.status(400).json({ error: 'Missing required fields', missingFields });
    }
    const to = config.recipient; 
    try {
      await sendMail(to, subject, message, name, email);
      res.status(200).json({ success: 'Contact email sent' });
    } catch (error) {
      console.error('Error sending contact email:', error);
      res.status(500).json({ error: 'Failed to send contact email' });
    }
  });
  

module.exports = router;
