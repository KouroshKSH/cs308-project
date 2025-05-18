#!/usr/bin/env node
/**
 * send_invoice.js — Send a PDF invoice via SendGrid
 *
 * Usage:
 *   node send_invoice.js <pdfFileName> <recipientEmail>
 */

require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const sg   = require('@sendgrid/mail');

// 1) Check API key
if (!process.env.SENDGRID_API_KEY) {
  console.error('❌ Missing SENDGRID_API_KEY in .env');
  process.exit(1);
}
sg.setApiKey(process.env.SENDGRID_API_KEY);

// 2) Parse CLI args
if (process.argv.length < 4) {
  console.error('❌ Usage: node send_invoice.js <pdfFileName> <recipientEmail>');
  process.exit(1);
}
const [ , , pdfFileName, recipientEmail ] = process.argv;

// 3) Resolve the file path
const invoicesDir = path.join(__dirname, 'invoices');
const pdfPath     = path.join(invoicesDir, pdfFileName);

// 4) Verify file exists
if (!fs.existsSync(pdfPath)) {
  console.error(`❌ File not found: ${pdfPath}`);
  process.exit(1);
}

// 5) Read & base64-encode the PDF
const pdfData = fs.readFileSync(pdfPath).toString('base64');

// 6) Build the message
const msg = {
  from: process.env.SENDER_EMAIL,
  to:   recipientEmail,
  subject: `Your Invoice: ${pdfFileName}`,
  text:    'Hello,\n\nPlease find your invoice attached.\n\nThank you!',
  attachments: [
    {
      content:  pdfData,
      filename: pdfFileName,
      type:     'application/pdf',
      disposition: 'attachment'
    }
  ]
};

// 7) Send it!
sg.send(msg)
  .then(() => {
    console.log('✅ Email sent successfully via SendGrid!');
  })
  .catch(err => {
    console.error('❌ SendGrid error:', err.response?.body || err.message);
    process.exit(1);
  });
