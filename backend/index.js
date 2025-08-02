
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeCV } from './analyzeCV.js';
import { fillTemplate } from './fillTemplate.js';
import { generatePDF } from './generatePDF.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ dest: 'backend/uploads/' });

// Servir el frontend
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
      const htmlPath = path.join(__dirname, 'uploads', `${candidato.nombre}_cv.html`);
      fs.writeFileSync(htmlPath, html, 'utf-8');
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
app.listen(PORT, () => console.log(`🚀 Backend iniciado en puerto ${PORT}`));
