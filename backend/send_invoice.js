require('dotenv').config();

console.log('Using API Key:', process.env.SENDGRID_API_KEY);
console.log('Using Sender Email:', process.env.SENDER_EMAIL);

const sgMail = require('@sendgrid/mail');
const path       = require('path');
const fs         = require('fs');


/**
 * send_invoice.js
 *
 * Usage:
 *   node send_invoice.js <pdfFileName> <recipientEmail>
 */

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

// 4) Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// 5) Prepare the email
const msg = {
  to: recipientEmail,
  from: process.env.SENDER_EMAIL,
  subject: `Your Invoice: ${pdfFileName}`,
  text: `Hello,

Please find your invoice attached.

Thank you,
CS308 Team`,
  attachments: [
    {
      content: fs.readFileSync(pdfPath).toString('base64'),
      filename: pdfFileName,
      type: 'application/pdf',
      disposition: 'attachment',
    },
  ],
};

// 6) Send it!
sgMail
  .send(msg)
  .then(() => {
    console.log('✅ Email sent successfully!');
  })
  .catch((error) => {
    console.error('❌ Error sending email:', error);
    process.exit(1);
  });