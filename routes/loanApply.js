const express = require('express');
const router = express.Router();
const { sendLoanApplicationMail } = require('../services/mailService');
const config = require('../config/mailConfig.json');

// POST /loanApply/apply
router.post('/apply', async (req, res) => {
  const payload = req.body; // { product, name, email, mobileNumber, city, loanAmount, companyName, monthlyIncome, message }
  // Validate required fields
  const requiredFields = [
    'product',
    'name',
    'email',
    'mobileNumber',
    'city',
    'loanAmount',
    'companyName',
    'monthlyIncome',
    'message'
  ];
  const missingFields = requiredFields.filter((fieldName) => {
    const value = (payload || {})[fieldName];
    if (value === undefined || value === null) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    return false;
  });
  if (missingFields.length > 0) {
    return res.status(400).json({ error: 'Missing required fields', missingFields });
  }

  try {
    const to = config.recipient; // from config
    await sendLoanApplicationMail(to, payload);
    res.status(200).json({ success: 'Loan application sent' });
  } catch (err) {
    console.error('Error sending loan application:', err);
    res.status(500).json({ error: 'Failed to send loan application' });
  }
});

module.exports = router;

