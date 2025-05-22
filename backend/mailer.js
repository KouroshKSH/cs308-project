const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // SSL port
  secure: true, // true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

exports.sendOrderConfirmation = async (toEmail, orderDetails) => {
  if (!toEmail || typeof toEmail !== 'string') {
    console.error(' Email sending aborted: Invalid or missing toEmail:', toEmail);
    return;
  }

  const { orderId, total_price, invoice_pdf_url } = orderDetails;

  const mailOptions = {
    from: `"Noire Vogue" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Your Noire Vogue Order Confirmation (Order #${orderId})`,
    html: `
      <h2>Thank you for your order!</h2>
      <p>Your order has been placed successfully.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total Price:</strong> $${total_price}</p>
      <p>You can download your invoice here: <a href="${invoice_pdf_url}">${invoice_pdf_url}</a></p>
      <p>We'll notify you once your order ships.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(` Email sent to ${toEmail} for Order #${orderId}`);
  } catch (err) {
    console.error(' Failed to send email:', err);
  }
};