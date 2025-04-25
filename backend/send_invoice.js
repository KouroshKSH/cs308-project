#!/usr/bin/env node
/**
 * send_invoice.js
 *
 * Usage:
 *   node send_invoice.js <pdfFileName> <recipientEmail>
 *
 * Example:
 *   node send_invoice.js invoice999999.pdf customer@example.com
 */

require('dotenv').config();

const nodemailer = require('nodemailer');
const path       = require('path');
const fs         = require('fs');

// 1) Parse CLI arguments
if (process.argv.length < 4) {
  console.error('❌ Usage: node send_invoice.js <pdfFileName> <recipientEmail>');
  process.exit(1);
}
const [ , , pdfFileName, recipientEmail ] = process.argv;

// 2) Resolve path to the invoices folder
const invoicesDir = path.join(__dirname, 'invoices');
const pdfPath     = path.join(invoicesDir, pdfFileName);

// 3) Check that the PDF exists
if (!fs.existsSync(pdfPath)) {
  console.error(`❌ File not found: ${pdfPath}`);
  process.exit(1);
}

// 4) Create the transporter using Gmail + App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.OUR_EMAIL_ADDRESS,
    pass: process.env.OUR_EMAIL_PASSWORD
  }
});

// 5) Prepare the email
const mailOptions = {
  from: `"CS308 Team" <${process.env.GMAIL_USER}>`,
  to: recipientEmail,
  subject: `Your Invoice: ${pdfFileName}`,
  text:    `Hello,

Please find your invoice attached.

Thank you,
CS308 Team`,
  attachments: [
    {
      filename:    pdfFileName,
      path:        pdfPath,
      contentType: 'application/pdf'
    }
  ]
};

// 6) Send it!
transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error('❌ Error sending email:', err);
    process.exit(1);
  }
  console.log('✅ Email sent successfully!');
  console.log('   SMTP response:', info.response);
});
