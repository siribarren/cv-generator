// generatePDF.js - CommonJS compatible
const puppeteer = require("puppeteer");
const fs = require("fs");

async function generatePDF(htmlPath) {
  // Cloud Run requiere --no-sandbox
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  const html = fs.readFileSync(htmlPath, "utf-8");
  await page.setContent(html, { waitUntil: "networkidle0" });

  // Guardar PDF en /tmp si corres en Cloud Run
  const pdfPath = htmlPath.includes("/tmp/")
    ? htmlPath.replace(".html", ".pdf")
    : `/tmp/${htmlPath.split("/").pop().replace(".html", ".pdf")}`;

  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true
  });

  await browser.close();
  return pdfPath;
}

module.exports = generatePDF;
 