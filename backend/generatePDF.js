const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

// === ADJUSTABLE VARIABLES ===
const username = "Reyhan123";
const productID = "prod567";
const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

// === FILENAME SETUP ===
const fileName = `${date}_${productID}_${username}.pdf`;
const outputDir = path.join(__dirname, "../invoice");
const outputPath = path.join(outputDir, fileName);

// === CREATE FOLDER IF NEEDED ===
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// === GENERATE PDF ===
function generatePDF() {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(outputPath));

  doc
    .fontSize(16)
    .text(`Dear ${username},`)
    .moveDown();

  doc
    .fontSize(14)
    .text(`This is your invoice for your order ${productID}.`)
    .text(`Your product ${productID} is being processed.`)
    .text(`Thank you for your purchase.`)
    .moveDown();

  doc
    .fontSize(12)
    .text(`${date}`, { align: "right" });

  doc.end();

  console.log(`✅ PDF generated: ${outputPath}`);
}

generatePDF();

