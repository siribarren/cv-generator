const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const analyzeCV = require('./analyzeCV.js');
const fillTemplate = require('./fillTemplate.js');
const generatePDF = require('./generatePDF.js');

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 1. Asegurar carpeta temporal de Cloud Run
if (!fs.existsSync('/tmp')) {
  fs.mkdirSync('/tmp', { recursive: true });
}

// 🔹 2. Usar /tmp para todos los archivos temporales
const uploadDir = '/tmp';
const upload = multer({ dest: uploadDir });

// 🔹 3. Servir el frontend
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint de análisis
app.post('/analyze', upload.array('cvs'), async (req, res) => {
  try {
    const reqFile = req.body.requerimiento || "";
    const results = [];
    for (const file of req.files) {
      const result = await analyzeCV(file.path, reqFile);
      results.push(result);
    }
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error analizando CV');
  }
});

// Construcción de CVs preliminares
app.post('/build-preliminary-cvs', async (req, res) => {
  const candidatos = req.body;
  const preliminares = candidatos.map(c => ({
    nombre: c.nombre,
    rol: c.rol,
    html: fillTemplate(c)
  }));
  res.json(preliminares);
});

// Aprobación final y generación de PDFs
app.post('/approve', async (req, res) => {
  try {
    const candidatos = req.body;
    const pdfs = [];
    for (const candidato of candidatos) {
      const html = fillTemplate(candidato);

      // Guardar HTML temporalmente en /tmp
      const htmlPath = path.join(uploadDir, `${candidato.nombre}_cv.html`);
      fs.writeFileSync(htmlPath, html, 'utf-8');

      // Generar PDF
      const pdfPath = await generatePDF(htmlPath);
      pdfs.push({ nombre: candidato.nombre, pdfPath });
    }
    res.json(pdfs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generando PDFs');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
