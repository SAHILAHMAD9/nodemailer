const nodemailer = require('nodemailer');
const config = require('../config/mailConfig.json');
const fs = require('fs');
const path = require('path');

let transporter;
let testAccountPromise;

// Check if we want to use Ethereal (for development)
const useEthereal = process.env.USE_ETHEREAL === 'true';

if (useEthereal) {
  // Create Ethereal test account
  testAccountPromise = nodemailer.createTestAccount().then((testAccount) => {
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log('🧪 Ethereal Test Account created:');
    console.log('  Login:', testAccount.user);
    console.log('  Pass :', testAccount.pass);
  });
} else {
  // Use real SMTP (e.g., Gmail)
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.email,
      pass: config.appPassword
    }
  });
  // For Gmail, no need to wait for test account
  testAccountPromise = Promise.resolve();
}

// Read and cache the email template
let emailTemplate = '';
try {
  emailTemplate = fs.readFileSync(path.join(__dirname, '../emailTemplate.html'), 'utf8');
} catch (err) {
  console.error('Failed to read email template:', err);
}

// Update sendMail to accept 'name' parameter
const sendMail = async (to, subject, message, name) => {
  await testAccountPromise;

  // Replace placeholders in the template
  let htmlBody = emailTemplate
    .replace(/{{name}}/g, name)
    .replace(/{{message}}/g, message);

  const mailOptions = {
    from: `${config.domain} <${transporter.options.auth.user}>`,
    to: to,
    subject: subject,
    html: htmlBody
  };

  const info = await transporter.sendMail(mailOptions);

  // If using Ethereal, log the preview URL
  if (useEthereal) {
    console.log('📧 Test email sent:', info.messageId);
    console.log('🔗 Preview URL:', nodemailer.getTestMessageUrl(info));
  }

  return info;
};

module.exports = { sendMail };