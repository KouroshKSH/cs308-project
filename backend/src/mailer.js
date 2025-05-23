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

// Update sendOrderConfirmation to accept invoicePdfBuffer
exports.sendOrderConfirmation = async (toEmail, orderDetails, invoicePdfBuffer) => {
  if (!toEmail || typeof toEmail !== 'string') {
    console.error(' Email sending aborted: Invalid or missing toEmail:', toEmail);
    return;
  }

  const { orderId, total_price } = orderDetails; // Removed invoice_pdf_url from here

  const mailOptions = {
    from: `"Noire Vogue" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Your Noire Vogue Order Confirmation (Order #${orderId})`,
    html: `
      <h2>Thank you for your order!</h2>
      <p>Your order has been placed successfully.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total Price:</strong> $${total_price}</p>
      <p>Your invoice is attached to this email as a PDF.</p>
      <p>We'll notify you once your order ships.</p>
      <p>Best regards,<br/>The Noire Vogue Team</p>
    `,
    attachments: [
      {
        filename: `invoice-${orderId}.pdf`,
        content: invoicePdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(` Email sent to ${toEmail} for Order #${orderId}`);
  } catch (err) {
    console.error(' Failed to send email:', err);
  }
};

exports.sendRefundConfirmation = async (toEmail, orderDetails, refundedAmount) => {
    if (!toEmail || typeof toEmail !== 'string') {
      console.error(' Email sending aborted: Invalid or missing toEmail for refund:', toEmail);
      return;
    }
  
    const { orderId } = orderDetails;
  
    const mailOptions = {
      from: `"Noire Vogue" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Noire Vogue Refund Confirmation (Order #${orderId})`,
      html: `
        <h2>Your return request for Order #${orderId} has been approved!</h2>
        <p>We've processed your refund for **$${refundedAmount.toFixed(2)}**.</p>
        <p>The refunded amount has been successfully forwarded to your bank. Please allow 3-5 business days for the amount to reflect in your account, depending on your bank's processing times.</p>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Thank you for shopping with Noire Vogue!</p>
        <p>Best regards,<br/>The Noire Vogue Team</p>
      `,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(` Refund confirmation email sent to ${toEmail} for Order #${orderId}`);
    } catch (err) {
      console.error(' Failed to send refund email:', err);
    }
};

exports.sendWishlistSaleNotification = async (toEmail, productDetails, discountPercent, endDate) => {
  if (!toEmail || typeof toEmail !== 'string') {
    console.error(' Email sending aborted: Invalid or missing toEmail for wishlist sale:', toEmail);
    return;
  }

  const { productId, productName } = productDetails;

  const mailOptions = {
    from: `"Noire Vogue" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `🚨 Sale Alert: "${productName}" from your Wishlist!`,
    html: `
      <h2>Great News! An item on your wishlist is now on sale!</h2>
      <p>The product **"${productName}"** (Product ID: ${productId}) from your wishlist is now **${discountPercent}% OFF!**</p>
      <p>This special offer is valid until **${new Date(endDate).toLocaleDateString()}**.</p>
      <p>Don't miss out on this limited-time discount!</p>
      <p>Happy Shopping!</p>
      <p>Best regards,<br/>The Noire Vogue Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(` Wishlist sale notification sent to ${toEmail} for Product #${productId}`);
  } catch (err) {
    console.error(` Failed to send wishlist sale email for Product #${productId}:`, err);
  }
};