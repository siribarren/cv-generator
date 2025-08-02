import puppeteer from "puppeteer";
import fs from "fs";

export async function generatePDF(htmlPath) {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();

  const html = fs.readFileSync(htmlPath, "utf-8");
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfPath = htmlPath.replace(".html", ".pdf");
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true
  });

  await browser.close();
  return pdfPath;
}
