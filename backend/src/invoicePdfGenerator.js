const PDFDocument = require('pdfkit');

async function generateInvoicePdf(orderDetails, items) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 }); // Added margin for better aesthetics
    let buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      let pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
    doc.on('error', reject);

    // --- Invoice Header ---
    doc.fontSize(28)
       .fillColor('#333') // A slightly darker gray
       .text('INVOICE', { align: 'right' });

    doc.moveDown();

    // --- Company Info (Placeholder) ---
    doc.fontSize(12)
       .fillColor('#555')
       .text('Noire Vogue', 50, 80)
       .text('123 Fashion Street', 50, 95)
       .text('Style City, SC 12345', 50, 110)
       .text('contact@noirevogue.com', 50, 125);

    doc.moveDown();

    // --- Invoice Details ---
    const invoiceDetailsY = 80;
    doc.fontSize(12)
       .fillColor('#555')
       .text(`Invoice Number: #${orderDetails.orderId.toString().padStart(5, '0')}`, 300, invoiceDetailsY, { align: 'right' })
       .text(`Order Date: ${new Date(orderDetails.order_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 300, invoiceDetailsY + 15, { align: 'right' });

    doc.moveDown(3); // Add some space

    // --- Billing Address ---
    doc.fontSize(14).fillColor('#333').text('Bill To:', 50, doc.y);
    doc.fontSize(12).fillColor('#555').text(orderDetails.delivery_address, 50, doc.y + 15);

    doc.moveDown(2); // Add some space

    // --- Items Table Header ---
    const tableTop = doc.y;
    const itemCol1X = 50;
    const itemCol2X = 250;
    const itemCol3X = 350;
    const itemCol4X = 450;
    const itemCol5X = 500; // For padding/right alignment

    doc.font('Helvetica-Bold')
       .fillColor('#333')
       .text('Product Name', itemCol1X, tableTop, { width: itemCol2X - itemCol1X - 10 })
       .text('Qty', itemCol2X, tableTop, { width: itemCol3X - itemCol2X - 10 })
       .text('Unit Price', itemCol3X, tableTop, { width: itemCol4X - itemCol3X - 10, align: 'right' })
       .text('Amount', itemCol4X, tableTop, { width: itemCol5X - itemCol4X, align: 'right' });

    doc.strokeColor('#aaaaaa')
       .lineWidth(1)
       .moveTo(50, tableTop + 20)
       .lineTo(550, tableTop + 20)
       .stroke();

    doc.moveDown();
    let currentY = doc.y + 10; // Start items below the line

    // --- Items List ---
    doc.font('Helvetica')
       .fillColor('#000'); // Black for item details

    items.forEach(item => {
      const price = parseFloat(item.price_at_purchase) || 0;
      const amount = price * item.quantity;

      doc.text(item.product_name, itemCol1X, currentY, { width: itemCol2X - itemCol1X - 10 });
      doc.text(item.quantity.toString(), itemCol2X, currentY, { width: itemCol3X - itemCol2X - 10 });
      doc.text(`$${price.toFixed(2)}`, itemCol3X, currentY, { width: itemCol4X - itemCol3X - 10, align: 'right' });
      doc.text(`$${amount.toFixed(2)}`, itemCol4X, currentY, { width: itemCol5X - itemCol4X, align: 'right' });
      currentY += 20; // Move down for the next item
    });

    doc.strokeColor('#aaaaaa')
       .lineWidth(1)
       .moveTo(50, currentY)
       .lineTo(550, currentY)
       .stroke();

    doc.moveDown();
    currentY = doc.y + 10;

    // --- Total Amount ---
    doc.font('Helvetica-Bold')
       .fontSize(16)
       .fillColor('#000')
       .text('Total Amount:', 50, currentY, { align: 'right', width: itemCol4X - itemCol1X })
       .text(`$${parseFloat(orderDetails.total_price).toFixed(2)}`, itemCol4X, currentY, { align: 'right', width: itemCol5X - itemCol4X });

    doc.moveDown(2);

    // --- Footer ---
    doc.fontSize(10)
       .fillColor('#777')
       .text('Thank you for your business!', 50, doc.page.height - 50, { align: 'center' });

    doc.end();
  });
}

module.exports = { generateInvoicePdf };