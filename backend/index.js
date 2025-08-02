import express from 'express';
import multer from 'multer';
import cors from 'cors';
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

// Servir frontend
app.use(express.static(path.join(__dirname, 'public')));

// Analizar múltiples CVs
app.post('/analyze', upload.array('cvs'), async (req, res) => {
  try {
    const files = req.files;
    const reqFile = req.body.requerimiento; // Si lo manejas como base64 o multipart
    const results = [];

    for (const file of files) {
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
  try {
    const candidatos = req.body; // Array de candidatos seleccionados
    const preliminares = candidatos.map((c) => ({
      nombre: c.nombre,
      rol: c.rol,
      html: fillTemplate(c)
    }));
    res.json(preliminares);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error construyendo CV preliminar');
  }
});

// Aprobar y generar PDFs finales
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

// Catch-all para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Backend iniciado en puerto ${PORT}`));
